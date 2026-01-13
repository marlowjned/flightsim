#!/bin/sh

OCTAVE_INC1=/usr/include/octave-3.8.2/
OCTAVE_INC2=/usr/include/octave-3.8.2/octave/
OCTAVE_LIB=/usr/lib64/octave/3.8.2/
QT_INC1=/usr/include/QtCore/
QT_INC2=/usr/include/QtGui/
QT_INC3=/usr/include/QtScript/

mkoctfile -I$OCTAVE_INC1 -I$OCTAVE_INC2 -I$QT_INC1 -I$QT_INC2 -I$QT_INC3 -L$OCTAVE_LIB \
    -I./ -I../../include -L../../ -lrpas -s ./rpa_octave.cpp

rm -f *.o

