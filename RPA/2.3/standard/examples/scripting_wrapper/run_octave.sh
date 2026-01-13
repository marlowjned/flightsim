#!/bin/sh

cd ../../
LD_LIBRARY_PATH=./:examples/scripting_wrapper/:$LD_LIBRARY_PATH octave examples/scripting_wrapper/test-rpa.m


