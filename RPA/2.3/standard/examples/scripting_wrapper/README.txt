This example shows how to write an extension for GNU Octave - the popular language for numerical computation.   

For more information about development extensions for GNU Octave see the following links:

	http://octave.sourceforge.net/octave/function/mkoctfile.html 
	https://www.gnu.org/software/octave/doc/interpreter/External-Code-Interface.html#External-Code-Interface

How to compile and run this example
-----------------------------------

1. Update the script build_octave.sh as folows:

	- ensure you have installed Octave development files, and update the pathes OCTAVE_INC1, OCTAVE_INC2, and OCTAVE_LIB
	- ensure you have installed Qt 4.8.x development files, and update the pathes QT_INC1, QT_INC2, and QT_INC3

2. Execute the script build_octave.sh. On success, the script should run without any output, and generate the shared library rpa_octave.oct

3. Execute the script run_octave.sh. This script will run Octave with the example file "test-rpa.m" which loads RPA scripting wrapper, 
   executes the RPA JS script "examples/scripts/RD-275.js", and obtains two parameters from the JS script.   

