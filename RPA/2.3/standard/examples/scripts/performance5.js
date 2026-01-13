/***************************************************
 RPA - Tool for Rocket Propulsion Analysis
 Copyright 2009-2017 Alexander Ponomarenko
 http://www.propulsion-analysis.com
****************************************************/

// Load configuration file "examples/RD-275.cfg".
c = ConfigFile("examples/RD-275.cfg");
c.read();

// Create Performance object, initializing it with loaded configuration, 
// and then solve the problem to get chamber/throat conditions. 
p = Performance(c);
p.solve();

// Get the combustion chamber object.
chamber = p.getChamber();

// Nozzle area ratios
subsonic = [1.54, 1.35, 1.2, 1];
supersonic = [5, 10, 26.2, 50, 100];

printf("#%6s %5s %5s %8s", "A/At", "Mach", "p,MPa", "Is_v,s");

// For each subsonic nozzle section, print out A/At, Mach number, and pressure
for (i=0; i<subsonic.length; ++i) {
    s = NozzleSectionConditions(chamber, subsonic[i], "A/At", false);
    printf(" %6.2f %5.2f %5.2f", s.getFr(), s.getMach(), s.getP("MPa"));
}

// For each supersonic nozzle section, print out A/At, Mach number, pressure, and vacuum specific impulse
for (i=0; i<supersonic.length; ++i) {
    s = NozzleSectionConditions(chamber, supersonic[i], "A/At", true);
    printf(" %6.2f %5.2f %5.2f %8.2f", s.getFr(), s.getMach(), s.getP("MPa"), s.getIs_v("s"));
}
