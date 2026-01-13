/***************************************************
 RPA - Tool for Rocket Propulsion Analysis
 Copyright 2009-2017 Alexander Ponomarenko
 http://www.propulsion-analysis.com 
****************************************************/

load("utils.js");

solver = Utils.load("examples/cycle_analysis/RD-170.cfg");
solver.run();
solver.print();

