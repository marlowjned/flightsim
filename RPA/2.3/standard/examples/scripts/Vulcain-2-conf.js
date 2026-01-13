/***************************************************
 RPA - Tool for Rocket Propulsion Analysis
 Copyright 2009-2017 Alexander Ponomarenko
 http://www.propulsion-analysis.com 
 
 This example performes the following tasks:
  - solves engine performance problem
  - designs combustion chamber
  - designs nozzle contour
  - solves cycle analysis problem
  - estimates engine dry mass

 All parameters are obtained from configuration file "examples/cycle_analysis/Vulcain-2.cfg".
****************************************************/

// This script is used for printing out the chamber parameters.
load("utils.js");

//*********************************
// Read configuration file

conf = ConfigFile("examples/cycle_analysis/Vulcain-2.cfg");
conf.read();

//*********************************
// Solve engine performance problem

perf = Performance(conf);
perf.solve();
perf.printResults();

//*********************************
// Design combustion chamber 
chamber = CombustionChamberContour(perf, CorrectionFactors(perf), conf);
Utils.printChamberParameters(chamber);

//*********************************
// Design nozzle contour 
nozzle = NozzleContour(conf, chamber);
Utils.printNozzleParameters(chamber, nozzle, 0);

//*********************************
// Solve cycle analysis problem
cycle = EngineCycle(conf, nozzle);
cycle.print();

//*********************************
// Estimate cycle performence
p = CyclePerformance(perf, chamber, cycle);
p.print();

//*********************************
// Estimate engine dry mass
m = MassEstimation(conf, cycle, nozzle);
m.print();

