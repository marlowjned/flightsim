#
# RPA - Tool for Rocket Propulsion Analysis
# RPA Scripting Utility
#
# Copyright 2009,2015 Alexander Ponomarenko.
#
#
# This is an example Octave file which loads and uses RPA Scripting via rpa_octave.oct (compiled from rpa_octave.cpp).
#

# Load external functions
autoload("rpaInit", "rpa_octave.oct")
autoload("rpaFin", "rpa_octave.oct")    
autoload("rpaEval", "rpa_octave.oct")  
autoload("rpaEvalFile", "rpa_octave.oct")  

# Initialize RPA
rpaInit("./");

# Load and evaluate the RPA scripting file
rpaEvalFile("examples/scripts/RD-275.js")

# Obtain the inlet pressure in two different units: MPa and atm
p_in = rpaEval("oxFeedSystem.getFlowPath().getInletPort().getP('MPa')")
p_in = rpaEval("oxFeedSystem.getFlowPath().getInletPort().getP('atm')")

# Finalize RPA
rpaFin();

