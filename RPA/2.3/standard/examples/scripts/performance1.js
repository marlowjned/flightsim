/***************************************************
 RPA - Tool for Rocket Propulsion Analysis
 Copyright 2009-2017 Alexander Ponomarenko
 http://www.propulsion-analysis.com 
 
 This script loads existing configuration file, 
 solves the performance problem and prints out the results
****************************************************/

// Load configuration file "examples/RD-275.cfg".
c = ConfigFile("examples/RD-275.cfg");
c.read();

// Create Performance object, initializing it with loaded configuration.
p = Performance(c);

// Solve the problem
p.solve();

// Print out the results in SI units (default).
p.printResults();

