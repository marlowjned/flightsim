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

solver = Utils.load("examples/cycle_analysis/Vulcain-2.cfg");
solver.run();
solver.print();
