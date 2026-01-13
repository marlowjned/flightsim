#include <octave/oct.h>
#include <octave/parse.h>

#include <QApplication>
#include <QScriptEngine>
#include <QScriptValue>
#include <QDir>

#include <string>

#include "rpas.hpp"

static QApplication* app = 0;
static QScriptEngine* eng = 0;

DEFUN_DLD (rpaInit, args, nargout, "Initialize RPA") {
	int nargin = args.length();

	std::string respath = "";
	std::string logpath = "";
	bool consoleOutput = true;

	int nextIdx = 0;
	if (nargin>0 && args(0).is_string()) {
		respath = args(0).string_value();
		nextIdx++;

		if (nargin>1 && args(1).is_string()) {
			logpath = args(1).string_value();
			nextIdx++;
		}
	}
	if (nargin>nextIdx && args(nextIdx).is_bool_scalar()) {
		consoleOutput = args(nextIdx).bool_value();
	}

	int argc = 0;
	char **argv = 0;

	app = new QApplication(argc, argv);

	rpaInitializeWithPath(respath, "", logpath, consoleOutput);

	eng = rpaScriptingInitialize();

	return octave_value();
}

DEFUN_DLD (rpaFin, args, nargout, "Finalize RPA") {
	if (eng) {
		rpaScriptingFinalize(eng);
		eng = 0;
	}
	rpaFinalize();
	delete app;
	app = 0;
	return octave_value();
}

DEFUN_DLD (rpaEval, args, nargout, "Execute RPA script") {
	octave_value retval;
	if (eng && args.length()>0 && args(0).is_string()) {
		std::string script = args(0).string_value();
		QScriptValue v = rpaScriptingEvaluate(eng, script.c_str());
		if (v.isNumber()) {
			retval = v.toNumber();
		} else
		if (v.isBool()) {
			retval = v.toBool();
		}
	}
	return retval;
}

DEFUN_DLD (rpaEvalFile, args, nargout, "Execute RPA script file") {
	octave_value retval;
	if (eng && args.length()>0 && args(0).is_string()) {
		std::string scriptPath = args(0).string_value();
		QScriptValue v = rpaScriptingEvaluateFile(eng, QFileInfo(scriptPath.c_str()));
		if (v.isNumber()) {
			retval = v.toNumber();
		} else
		if (v.isBool()) {
			retval = v.toBool();
		}
	}
	return retval;
}


