/***************************************************
 RPA - Tool for Rocket Propulsion Analysis
 Copyright 2009-2017 Alexander Ponomarenko
 http://www.propulsion-analysis.com 
****************************************************/

load("utils.js");

solver = Utils.load("examples/cycle_analysis/RD-275.cfg");
solver.run(Utils.Solver.ALL);
solver.print(Utils.Solver.ALL);

