/*
 * RPA - Tool for Rocket Propulsion Analysis
 * RPA Scripting Utility
 *
 * Copyright 2009,2015 Alexander Ponomarenko.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This software is a commercial product; you can use it under the terms of the
 * RPA Standard Edition License as published at http://propulsion-analysis.com/lic_standard.htm
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the
 * implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
 * PURPOSE.  See the RPA SDK License for more details (a copy is included
 * in the sdk_eula.htm file that accompanied this program).
 *
 * You should have received a copy of the RPA SDK License along with this program;
 * if not, write to author <contact@propulsion-analysis.com>
 *
 * Please contact author <contact@propulsion-analysis.com> or visit http://www.propulsion-analysis.com
 * if you need additional information or have any questions.
 */

#ifndef SCRIPTING_SRC_RPAS_HPP_
#define SCRIPTING_SRC_RPAS_HPP_

#include <QtCore/QtGlobal>

#if defined(SHARED)
#  define SDLL Q_DECL_EXPORT
#else
#  define SDLL Q_DECL_IMPORT
#endif

//*****************************************************************************

/**
 * Initializes the RPA library, creating loggers and loading database files using following paths:<br>
 * resources/thermo.inp <br>
 * resources/usr_thermo.inp <br>
 * resources/properties.inp <br>
 * resources/usr_properties.inp <br>
 * resources/trans.inp <br>
 *
 * @param consoleOutput if true, duplicate the logging in console
 */
SDLL void rpaInitialize(bool consoleOutput);

/**
 * Initializes the RPA library, creating loggers and loading database files using specified paths:<br>
 * $(logpath)/rpa_info.log <br>
 * $(respath)/thermo.inp <br>
 * $(respath)/usr_thermo.inp <br>
 * $(respath)/properties.inp <br>
 * $(respath)/usr_properties.inp <br>
 * $(respath)/trans.inp <br>
 *
 * @param respath path to resource directory with database files (default is <RPA-dist-path>/resources)
 * @param usrrespath path to resource directory with user-defined database files (default is <User-data-path>/RPA/resources)
 * @param logpath path to log directory
 * @param consoleOutput if true, duplicate the logging in console
 */
SDLL void rpaInitializeWithPath(const std::string& respath, const std::string& usrrespath, const std::string& logpath, bool consoleOutput);

/**
 * Finalizes the RPA library, closing all open file loggers.
 */
SDLL void rpaFinalize();

/**
 * Initializes the RPA Scripting engine
 *
 * @param script contents of the script which has to be executed; if empty, scripting will be started as an interactive interpreter
 * @param scriptPath path to script file which has to be executed
 * @param scriptLineNumbers
 * @return Pointer to initialized instance of QScriptEngine
 */
SDLL QScriptEngine* rpaScriptingInitialize();

/**
 * Starts the scripting console in interactive mode
 *
 * @param eng pointer to initialized instance of QScriptEngine
 */
SDLL void rpaScriptingInteractive(QScriptEngine* eng);

/**
 * Loads and executes the script from specified file
 *
 * @param eng pointer to initialized instance of QScriptEngine
 * @param scriptPath path to script file
 * @return Result of execution of the script file
 */
SDLL QScriptValue rpaScriptingEvaluateFile(QScriptEngine* eng, QFileInfo scriptPath);

/**
 * Executes the script from specified string
 *
 * @param eng pointer to initialized instance of QScriptEngine
 * @param script script
 * @return Result of execution of the script
 */
SDLL QScriptValue rpaScriptingEvaluate(QScriptEngine* eng, QString script);

/**
 * Initializes the RPA Scripting engine
 *
 * @param eng pointer to initialized instance of QScriptEngine
 */
SDLL void rpaScriptingFinalize(QScriptEngine* eng);

//*****************************************************************************


#endif /* SCRIPTING_SRC_RPAS_HPP_ */
