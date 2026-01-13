/***************************************************
 RPA - Tool for Rocket Propulsion Analysis
 Copyright 2009-2017 Alexander Ponomarenko
 http://www.propulsion-analysis.com 
****************************************************/

//*********************************
// Read configuration file

conf = ConfigFile("examples/thermal/Aestus.cfg");
conf.read();

//*********************************
// Solve engine performance problem

perf = Performance(conf);
perf.solve();

//*********************************
// Design thrust chamber geometry

chamber = CombustionChamberContour(perf, CorrectionFactors(perf), conf);
nozzle = NozzleContour(conf, chamber);

printf("thrust = %8.3f kN (vac)", chamber.getThrust("kN"));
printf("m_dot  = %8.3f kg/s", chamber.getMdot("kg/s"));
printf("Lstar  = %8.3f mm", chamber.getLstar("mm"));
printf("Lc     = %8.3f mm", chamber.getLc("mm"));
printf("Lcyl   = %8.3f mm", chamber.getLcyl("mm"));
printf("Dt     = %8.3f mm", chamber.getDt("mm"));
printf("Dc     = %8.3f mm", chamber.getDc("mm"));
printf("R1     = %8.3f mm", chamber.getR1("mm"));
printf("R2     = %8.3f mm", chamber.getR2("mm"));
printf("b      = %8.3f deg", chamber.getB("deg"));
printf("Ae/At  = %8.3f", chamber.getFre());
printf("Le     = %8.3f mm", nozzle.getL("mm"));
printf("De     = %8.3f mm", nozzle.getD(1, "mm", false));
printf("t_max  = %8.3f deg", nozzle.getThetaMax("deg"));
printf("t_e    = %8.3f deg", nozzle.getThetaE("deg"));
printf("");

//*********************************
// Design thrust chamber cooling

cooling = NozzleCooling(nozzle, 1.0, 75);
cooling.setEmissivity(0.8);
// cooling.setDesignMode(true);

// Define coolant
mix = Mixture();
mix.addSpecies("CH6N2(L)", 1.0);
mix.setT(298, "K");
mix.setP(18, "bar");

// Add channel wall segment
s0 = cooling.addChannelWallSegment(3, "mm", 2, "mm", 2, "mm", 4, "mm", mix, 0.328, 0, "mm");
s0.setH(0.7, "mm");
s0.setLambda(300, "W/(m K)");
s0.setHrg(0.5, "mm");
s0.setSrg(10*0.5, "mm");
s0.setOppositeFlow(true);
s0.setN(120);

// Add radiation segment
s1 = cooling.addRadiationSegment(0.75, 591, "mm");
s1.setH(1.5, "mm");
s1.setLambda(50, "W/(m K)");

var Twg0 = 1000; // K
var wallLayer = 0.05;
var applyCooling = true;
var applyFilmCooling = true;
var withRadiativeHeatTransfer = true;
cooling.solve(Twg0, "K", wallLayer, applyCooling, applyFilmCooling, withRadiativeHeatTransfer);

// Array for results
// We will fill it with objects {x, r, Twg, a, q, Twi, Twc, Tc, Wc, Pc, Rhoc}
var results = [];

// Collect results

// Get results for hot (gas) side of the wall
for (var i=0; i<cooling.getNumberOfSections(); ++i) {
  var s = cooling.getSection(i);
  var sr = {};
  sr.x = s.getX("m");
  sr.r = s.getR("m");
  sr.Twg = s.getTwg(0, "K");
  sr.a = s.getAlphaTEffective(0);
  sr.q = s.getQ(0);
  results[i] = sr;
}

// Get results for cold side of the wall
for (var j=0; j<cooling.getNumberOfSegments(); ++j) {
  var s = cooling.getSegment(j);
  
  for (var i=s.getStartIndex(); i<=s.getEndIndex(); ++i) {
    var idx = i-s.getStartIndex();
    var sr = results[i];
    sr.Twi = s.getTwi(idx, "K");
    sr.Twc = s.getTwc(idx, "K");
    if (s.getType()=="TubularWallSegment" || s.getType()=="ChannelWallSegment" || s.getType()=="CoaxialShellSegment") {
      sr.Tc = s.getTc(idx, "K");
      sr.Wc = s.getWc(idx, "m/s");
      sr.Pc = s.getPc(idx, "MPa");
      sr.Rhoc = s.getRhoc(idx, "kg/m^3");
    } else {
      sr.Tc = Math.NaN;
    }
  }
  
}

printf("--------------------------------------------------------------------------------");
printf("%6s %6s %8s %8s %6s %6s %6s %6s %6s %6s %6s", "x", "R", "a",        "q",      "Twg", "Twi", "Twc", "Tc", "Wc",  "Pc",  "Rho");
printf("%6s %6s %8s %8s %6s %6s %6s %6s %6s %6s %6s", "m", "m", "kW/m^2-K", "kW/m^2", "K",   "K",   "K",   "K",  "m/s", "MPa", "kg/m^3");
printf("--------------------------------------------------------------------------------");
for (var i=0; i<results.length; ++i){
    var sr = results[i];
    if (!isNaN(sr.Tc)) {
      printf("%6.3f %6.3f %8.4f %8.2f %6.1f %6.1f %6.1f %6.1f %6.2f %6.2f %6.1f", sr.x, sr.r, sr.a, sr.q, sr.Twg, sr.Twi, sr.Twc, sr.Tc, sr.Wc, sr.Pc, sr.Rhoc);
    } else {
      printf("%6.3f %6.3f %8.4f %8.2f %6.1f %6.1f %6.1f", sr.x, sr.r, sr.a, sr.q, sr.Twg, sr.Twi, sr.Twc);
    }
}
printf("--------------------------------------------------------------------------------");

