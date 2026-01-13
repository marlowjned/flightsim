
function Config(name, load) {
  if (!!name) {
    this.c = new ConfigFile(name);
  } else {
    this.c = new ConfigFile();
  }
  if (!!load) {
	  this.c.read();
  }
}
Config.prototype.config = function() {
    return this.c;
}
Config.prototype.read = function(name) {
  if (!!name) {
    this.c.read(name);
  } else {
    this.c.read();
  }
}
Config.prototype.write = function(name) {
  if (!!name) {
    this.c.write(name);
  } else {
    this.c.write();
  }
}
Config.prototype.getVersion = function() {
  return this.c.getVersion();
}
Config.prototype.setName = function(name) {
  this.c.setName(name);
}
Config.prototype.getName = function() {
  return this.c.getName();
}
Config.prototype.setInfo = function(info) {
  this.c.setInfo(info);
}
Config.prototype.getInfo = function() {
  return this.c.getInfo();
}
Config.prototype.isMultiphaseFlow = function() {
  return this.c.getGeneralOptions().isMultiphaseFlow();
}
Config.prototype.setMultiphaseFlow = function(multiphase) {
  this.c.getGeneralOptions().setMultiphaseFlow(!!!multiphase?false:true);
}
Config.prototype.isIons = function() {
  return this.c.getGeneralOptions().isIons();
}
Config.prototype.setIons = function(ions) {
  this.c.getGeneralOptions().setIons(!!!ions?false:true);
}
Config.prototype.isFlowSeparation = function() {
  return this.c.getGeneralOptions().isFlowSeparation();
}
Config.prototype.setFlowSeparation = function(flowSep) {
  this.c.getGeneralOptions().setFlowSeparation(!!!flowSep?false:true);
}

Config.prototype.getChamberPressure = function(unit) {
  return this.c.getCombustionChamberConditions().getPressure(unit);
}
Config.prototype.setChamberPressure = function(p, unit) {
  this.c.getCombustionChamberConditions().setPressure(p, unit);
}

Config.prototype.getCalculateNozzleFlow = function() {
  return this.c.getNozzleFlowOptions().isCalculateNozzleFlow();
}
Config.prototype.setCalculateNozzleFlow = function(calculate) {
  return this.c.getNozzleFlowOptions().setCalculateNozzleFlow(!!!calculate?false:true);
}

Config.prototype.isFreezingConditions = function() {
  return this.c.getNozzleFlowOptions().isFreezingConditions() && this.c.getNozzleFlowOptions().getFreezingConditions().isCalculate();
}
Config.prototype.getFreezingConditions = function() {
  return this.c.getNozzleFlowOptions().getFreezingConditions();
}
Config.prototype.setFreezingConditions = function(set) {
  if (!!!set) {
    this.c.getNozzleFlowOptions().deleteFreezingConditions();
  } else {
    this.c.getNozzleFlowOptions().setFreezingConditions().setCalculate(true);
  }
}
Config.prototype.checkFreezingConditionsType = function(type) {
  if ("A/At"==type || "areaRatio"==type) {
    return this.c.getNozzleFlowOptions().setFreezingConditions().isExpansionRatio();
  }
  if ("p"==type || "pressure"==type) {
    return this.c.getNozzleFlowOptions().setFreezingConditions().isPressure();
  }
  if ("pp"==type || "pressureRatio"==type) {
    return this.c.getNozzleFlowOptions().setFreezingConditions().isPressureRatio();
  }
  return false;
}
Config.prototype.getFreezingPressure = function(unit) {
    return this.c.getNozzleFlowOptions().setFreezingConditions().getPressure(unit);
}
Config.prototype.setFreezingPressure = function(p, unit) {
    return this.c.getNozzleFlowOptions().setFreezingConditions().setPressure(p, unit);
}
Config.prototype.deleteFreezingPressure = function() {
    return this.c.getNozzleFlowOptions().setFreezingConditions().deletePressure();
}
Config.prototype.getFreezingAreaRatio = function() {
    return this.c.getNozzleFlowOptions().setFreezingConditions().getExpansionRatio();
}
Config.prototype.setFreezingAreaRatio = function(e) {
    return this.c.getNozzleFlowOptions().setFreezingConditions().setExpansionRatio(!!!e?false:true);
}
Config.prototype.deleteFreezingAreaRatio = function() {
    return this.c.getNozzleFlowOptions().setFreezingConditions().deleteExpansionRatio();
}
Config.prototype.getFreezingPressureRatio = function() {
    return this.c.getNozzleFlowOptions().setFreezingConditions().getPressureRatio();
}
Config.prototype.setFreezingsetPressureRatio = function(pp) {
    return this.c.getNozzleFlowOptions().setFreezingConditions().setPressureRatio(!!!pp?false:true);
}
Config.prototype.deleteFreezingPressureRatio = function() {
    return this.c.getNozzleFlowOptions().setFreezingConditions().deletePressureRatio();
}


Config.prototype.isNozzleInletConditions = function() {
  return this.c.getNozzleFlowOptions().isNozzleInletConditions();
}
Config.prototype.getNozzleInletConditions = function() {
  return this.c.getNozzleFlowOptions().getNozzleInletConditions();
}
Config.prototype.setNozzleInletConditions = function(set) {
  if (!!!set) {
    this.c.getNozzleFlowOptions().deleteNozzleInletConditions();
    return null;
  } else {
    return this.c.getNozzleFlowOptions().setNozzleInletConditions();
  }
}

Config.prototype.checkNozzleInletConditionsType = function(type) {
  if ("A/At"==type || "areaRatio"==type || "contractionRatio"==type) {
	return this.c.getNozzleFlowOptions().setNozzleInletConditions().isContractionAreaRatio();
  }
  if ("massFlux"==type) {
	return this.c.getNozzleFlowOptions().setNozzleInletConditions().isMassFlux();
  }
  return false;
}
Config.prototype.getNozzleInletContractionRatio = function() {
    return this.c.getNozzleFlowOptions().setNozzleInletConditions().getContractionAreaRatio();
}
Config.prototype.setNozzleInletContractionRatio = function(r) {
    this.c.getNozzleFlowOptions().setNozzleInletConditions().setContractionAreaRatio(r);
}
Config.prototype.getNozzleInletMassFlux = function(unit) {
    return this.c.getNozzleFlowOptions().setNozzleInletConditions().getMassFlux(unit);
}
Config.prototype.setNozzleInletMassFlux = function(m, unit) {
    this.c.getNozzleFlowOptions().setNozzleInletConditions().setMassFlux(m, unit);
}
Config.prototype.deleteNozzleInletMassFlux = function(m, unit) {
    this.c.getNozzleFlowOptions().setNozzleInletConditions().deleteMassFlux();
}

Config.prototype.isNozzleExitConditions = function() {
  return this.c.getNozzleFlowOptions().isNozzleExitConditions();
}
Config.prototype.getNozzleExitConditions = function() {
  return this.c.getNozzleFlowOptions().getNozzleExitConditions();
}
Config.prototype.setNozzleExitConditions = function(set) {
  if (!!!set) {
    this.c.getNozzleFlowOptions().deleteNozzleExitConditions();
    return null;
  } else {
    return this.c.getNozzleFlowOptions().setNozzleExitConditions();
  }
}

Config.prototype.checkNozzleExitConditionsType = function(type) {
  if ("A/At"==type || "areaRatio"==type || "expansionRatio"==type) {
	return this.c.getNozzleFlowOptions().setNozzleExitConditions().isAreaRatio();
  }
  if ("pp"==type || "pressureRatio"==type) {
	return this.c.getNozzleFlowOptions().setNozzleExitConditions().isPressureRatio();
  }
  if ("p"==type || "pressure"==type) {
	return this.c.getNozzleFlowOptions().setNozzleExitConditions().isPressureRatio();
  }
  return false;
}
Config.prototype.getNozzleExitAreaRatio = function() {
    return this.c.getNozzleFlowOptions().setNozzleExitConditions().getAreaRatio();
}
Config.prototype.setNozzleExitAreaRatio = function(r) {
    this.c.getNozzleFlowOptions().setNozzleExitConditions().setAreaRatio(r);
}
Config.prototype.deleteNozzleExitAreaRatio = function() {
    this.c.getNozzleFlowOptions().setNozzleExitConditions().deleteAreaRatio();
}

Config.prototype.getNozzleExitPressureRatio = function() {
    return this.c.getNozzleFlowOptions().setNozzleExitConditions().getPressureRatio();
}
Config.prototype.setNozzleExitPressureRatio = function(r) {
    this.c.getNozzleFlowOptions().setNozzleExitConditions().setPressureRatio(r);
}
Config.prototype.deleteNozzleExitPressureRatio = function() {
    this.c.getNozzleFlowOptions().setNozzleExitConditions().deletePressureRatio();
}

Config.prototype.getNozzleExitPressure = function(unit) {
    return this.c.getNozzleFlowOptions().setNozzleExitConditions().getPressure(unit);
}
Config.prototype.setNozzleExitPressure = function(p, unit) {
    this.c.getNozzleFlowOptions().setNozzleExitConditions().setPressure(p, unit);
}
Config.prototype.deleteNozzleExitPressure = function() {
    this.c.getNozzleFlowOptions().setNozzleExitConditions().deletePressure();
}

Config.prototype.isEfficiencyFactors = function() {
  return this.c.getNozzleFlowOptions().isEfficiencyFactors() && this.c.getNozzleFlowOptions().getEfficiencyFactors().isApplyEfficiencyFactors();
}
Config.prototype.getEfficiencyFactors = function() {
  return this.c.getNozzleFlowOptions().getEfficiencyFactors();
}
Config.prototype.setEfficiencyFactors = function(set) {
  if (!!!set) {
    this.c.getNozzleFlowOptions().deleteEfficiencyFactors();
    return null;
  } else {
    return this.c.getNozzleFlowOptions().setEfficiencyFactors();
  }
}

Config.prototype.checkEfficiencyType = function(type) {
  if ("cycle"==type || "cycleEfficiency"==type) {
	return this.c.getNozzleFlowOptions().setEfficiencyFactors().isCycleEfficiency();
  }
  if ("reaction"==type || "reactionEfficiency"==type) {
	return this.c.getNozzleFlowOptions().setEfficiencyFactors().isReactionEfficiency();
  }
  if ("nozzle"==type || "nozzleEfficiency"==type) {
	return this.c.getNozzleFlowOptions().setEfficiencyFactors().isNozzleEfficiency();
  }
  if ("length"==type || "nozzleLength"==type) {
	return this.c.getNozzleFlowOptions().setEfficiencyFactors().isNozzleLength();
  }
  if ("halfAngle"==type || "cConeHalfAngle"==type) {
	return this.c.getNozzleFlowOptions().setEfficiencyFactors().isConeHalfAngle();
  }
  return false;
}

Config.prototype.setEfficiencyFactors = function(s) {
    this.c.getNozzleFlowOptions().getEfficiencyFactors().setApplyEfficiencyFactors(!!!s?false:true);
}
Config.prototype.setCycleEfficiency = function(e) {
    this.c.getNozzleFlowOptions().setEfficiencyFactors().setCycleEfficiency(e);
}
Config.prototype.getCycleEfficiency = function() {
    return this.c.getNozzleFlowOptions().setEfficiencyFactors().getCycleEfficiency();
}
Config.prototype.deleteCycleEfficiency = function() {
    this.c.getNozzleFlowOptions().setEfficiencyFactors().deleteCycleEfficiency();
}
Config.prototype.setReactionEfficiency = function(e) {
    this.c.getNozzleFlowOptions().setEfficiencyFactors().setReactionEfficiency(e);
}
Config.prototype.getReactionEfficiency = function() {
    return this.c.getNozzleFlowOptions().setEfficiencyFactors().setReactionEfficiency();
}
Config.prototype.deleteReactionEfficiency = function() {
    this.c.getNozzleFlowOptions().setEfficiencyFactors().deleteReactionEfficiency();
}
Config.prototype.setNozzleEfficiency = function(e) {
    this.c.getNozzleFlowOptions().setEfficiencyFactors().setNozzleEfficiency(e);
}
Config.prototype.getNozzleEfficiency = function() {
    return this.c.getNozzleFlowOptions().setEfficiencyFactors().getNozzleEfficiency();
}
Config.prototype.deleteNozzleEfficiency = function() {
    this.c.getNozzleFlowOptions().setEfficiencyFactors().deleteNozzleEfficiency();
}
Config.prototype.setNozzleLength = function(e) {
    this.c.getNozzleFlowOptions().setEfficiencyFactors().setNozzleLength(e);
}
Config.prototype.getNozzleLength = function() {
    return this.c.getNozzleFlowOptions().setEfficiencyFactors().getNozzleLength();
}
Config.prototype.deleteNozzleLength = function() {
    this.c.getNozzleFlowOptions().setEfficiencyFactors().deleteNozzleLength();
}
Config.prototype.setConeHalfAngle = function(e) {
    this.c.getNozzleFlowOptions().setEfficiencyFactors().setConeHalfAngle(e);
}
Config.prototype.getConeHalfAngle = function() {
    return this.c.getNozzleFlowOptions().setEfficiencyFactors().getConeHalfAngle();
}
Config.prototype.deleteConeHalfAngle = function() {
    this.c.getNozzleFlowOptions().setEfficiencyFactors().deleteConeHalfAngle();
}

Config.prototype.isAmbientConditions = function() {
  return this.c.getNozzleFlowOptions().isAmbientConditions();
}
Config.prototype.getAmbientConditions = function() {
  return this.c.getNozzleFlowOptions().getAmbientConditions();
}
Config.prototype.setAmbientConditions = function(set) {
  if (!!!set) {
    this.c.getNozzleFlowOptions().deleteAmbientConditions();
    return null;
  } else {
    return this.c.getNozzleFlowOptions().setAmbientConditions();
  }
}
Config.prototype.getAmbientPressure = function(unit) {
  if (this.c.getNozzleFlowOptions().isAmbientConditions()) {
    return this.c.getNozzleFlowOptions().getAmbientPressure(unit);
  } else {
    return 0;
  }
}
Config.prototype.checkAmbientConditionsType = function(type) {
  if ("fp"==type || "fixePressure"==type) {
    return this.c.getNozzleFlowOptions().setAmbientConditions().isFixedPressure();
  }
  if ("pr"==type || "pressureRange"==type) {
    return this.c.getNozzleFlowOptions().setAmbientConditions().isRangePressure();
  }
  return false;
}
Config.prototype.getAmbientFixedPressure = function(unit) {
  return this.c.getNozzleFlowOptions().setAmbientConditions().getFixedPressure(unit);
}
Config.prototype.setAmbientFixedPressure = function(p, unit) {
  this.c.getNozzleFlowOptions().setAmbientConditions().setFixedPressure(p, unit);
}
Config.prototype.deleteAmbientFixedPressure = function() {
  this.c.getNozzleFlowOptions().setAmbientConditions().deleteFixedPressure();
}
Config.prototype.getAmbientMinPressure = function(unit) {
  return this.c.getNozzleFlowOptions().setAmbientConditions().getRangePressureMin(unit);
}
Config.prototype.setAmbientMinPressure = function(p, unit) {
  this.c.getNozzleFlowOptions().setAmbientConditions().setRangePressureMin(p, unit);
}
Config.prototype.getAmbientMaxPressure = function(unit) {
  return this.c.getNozzleFlowOptions().setAmbientConditions().getRangePressureMaxn(unit);
}
Config.prototype.setAmbientMaxPressure = function(p, unit) {
  this.c.getNozzleFlowOptions().setAmbientConditions().setRangePressureMax(p, unit);
}
Config.prototype.deleteRangePressure = function() {
  this.c.getNozzleFlowOptions().getAmbientConditions().deleteRangePressure();
}

Config.prototype.isThrottlingConditions = function() {
  return this.c.getNozzleFlowOptions().isThrottlingConditions();
}
Config.prototype.getThrottlingConditions = function() {
  return this.c.getNozzleFlowOptions().getThrottlingConditions();
}
Config.prototype.setThrottlingConditions = function(set) {
  if (!!!set) {
    this.c.getNozzleFlowOptions().deleteThrottlingConditions();
    return null;
  } else {
    return this.c.getNozzleFlowOptions().setThrottlingConditions();
  }
}

Config.prototype.checkThrottlingConditionsType = function(type) {
  if ("ffr"==type || "fixeFlowRate"==type) {
    return this.c.getNozzleFlowOptions().setThrottlingConditions().isFixedFlowrate();
  }
  if ("rfr"==type || "rangeFlowrate"==type) {
    return this.c.getNozzleFlowOptions().setThrottlingConditions().isRangeFlowrate();
  }
  return false;
}
Config.prototype.getThrottlingFixedFlowrate = function() {
  return this.c.getNozzleFlowOptions().setThrottlingConditions().getFixedFlowrate();
}
Config.prototype.setThrottlingFixedFlowrate = function(r) {
  this.c.getNozzleFlowOptions().setThrottlingConditions().setFixedFlowrate(r);
}
Config.prototype.deleteThrottlingFixedFlowrate = function() {
  this.c.getNozzleFlowOptions().setThrottlingConditions().deleteFixedFlowrate(r);
}

Config.prototype.getThrottlingMinFlowrate = function() {
  return this.c.getNozzleFlowOptions().setThrottlingConditions().getRangeFlowrateMin();
}
Config.prototype.setThrottlingMinFlowrate = function(r) {
  this.c.getNozzleFlowOptions().setThrottlingConditions().setRangeFlowrateMin(r);
}
Config.prototype.getThrottlingMaxFlowrate = function() {
  return this.c.getNozzleFlowOptions().setThrottlingConditions().getRangeFlowrateMax();
}
Config.prototype.setThrottlingMaxFlowrate = function(r) {
  this.c.getNozzleFlowOptions().setThrottlingConditions().setRangeFlowrateMax(r);
}
Config.prototype.deleteThrottlingFlowrateRange = function() {
  this.c.getNozzleFlowOptions().setThrottlingConditions().deleteRangeFlowrate();
}


Config.prototype.getComponentRatioType = function() {
  return this.c.getPropellant().getRatioType();
}
Config.prototype.getComponentRatio = function() {
  return this.c.getPropellant().getRatio();
}
Config.prototype.setComponentRatio = function(r, type) {
  this.c.getPropellant().setRatio(r, type);
}
Config.prototype.getOxidizerListSize = function() {
  return this.c.getPropellant().getOxidizerListSize();
}
Config.prototype.getOxidizer = function(n) {
  return this.c.getPropellant().getOxidizer(n);
}
Config.prototype.addOxidizer = function(name, mf, T, Tunit, p, punit) {
  this.c.getPropellant().addOxidizer(new ConfigComponent(name, mf, T, Tunit, p, punit));
}
Config.prototype.getFuelListSize = function() {
  return this.c.getPropellant().getFuelListSize();
}
Config.prototype.getFuel = function(n) {
  return this.c.getPropellant().getFuel(n);
}
Config.prototype.addFuel = function(name, mf, T, Tunit, p, punit) {
  this.c.getPropellant().addOxidizer(new ConfigComponent(name, mf, T, Tunit, p, punit));
}
Config.prototype.getSpeciesListSize = function() {
  return this.c.getPropellant().getSpeciesListSize();
}
Config.prototype.getSpecies = function(n) {
  return this.c.getPropellant().getSpecies(n);
}
Config.prototype.addSpecies = function(name, mf, T, Tunit, p, punit) {
  this.c.getPropellant().addSpecies(new ConfigComponent(name, mf, T, Tunit, p, punit));
}

Config.prototype.setOxidizerTemperature = function(t, unit) {
  for (var i=0; i<this.c.getPropellant().getOxidizerListSize(); ++i) {
    this.c.getPropellant().getOxidizer(i).setT(t, unit);
  }
}
Config.prototype.setFuelTemperature = function(t, unit) {
  for (var i=0; i<this.c.getPropellant().getFuelListSize(); ++i) {
    this.c.getPropellant().getFuel(i).setT(t, unit);
  }
}
Config.prototype.setSpeciesTemperature = function(t, unit) {
  for (var i=0; i<this.c.getPropellant().getSpeciesListSize(); ++i) {
    this.c.getPropellant().getSpecies(i).setT(t, unit);
  }
}

Config.prototype.setOxidizerPressure = function(p, unit) {
  for (var i=0; i<this.c.getPropellant().getOxidizerListSize(); ++i) {
    this.c.getPropellant().getOxidizer(i).setP(p, unit);
  }
}
Config.prototype.setFuelPressure = function(p, unit) {
  for (var i=0; i<this.c.getPropellant().getFuelListSize(); ++i) {
    this.c.getPropellant().getFuel(i).setP(p, unit);
  }
}
Config.prototype.setSpeciesPressure = function(p, unit) {
  for (var i=0; i<this.c.getPropellant().getSpeciesListSize(); ++i) {
    this.c.getPropellant().getSpecies(i).setT(p, unit);
  }
}


Config.prototype.checkEngineSizingType = function(type) {
  if ("thrust"==type) {
    return this.c.getEngineSize().isThrust();
  }
  if ("mdot"==type) {
    return this.c.getEngineSize().isMdot();
  }
  if ("throat"==type) {
    return this.c.getEngineSize().isThroatD();
  }
  return false;
}

Config.prototype.getEngineSizingThrust = function(unit) {
    return this.c.getEngineSize().getThrust(unit);
}
Config.prototype.getEngineSizingThrustAmbientPressure = function(unit) {
    if (this.c.getEngineSize().isAmbientPressure()) {
      return this.c.getEngineSize().getAmbientPressure(unit);
    } else {
      return 0;
    }
}
Config.prototype.setEngineSizingThrust = function(t, unit, p, punit) {
    this.c.getEngineSize().setThrust(t, unit);
    if (!!p) {
      this.c.getEngineSize().setAmbientPressure(p, punit);
    }
}
Config.prototype.getEngineSizingMdot = function(unit) {
    return this.c.getEngineSize().getMdot(unit);
}
Config.prototype.setEngineSizingMdot = function(m, unit) {
    this.c.getEngineSize().setMdot(m, unit);
}
Config.prototype.getEngineSizingThroatDiameter = function(unit) {
    return this.c.getEngineSize().getThroatD(unit);
}
Config.prototype.setEngineSizingThroatDiameter = function(d, unit) {
    this.c.getEngineSize().setThroatD(d, unit);
}


Config.prototype.getEngineSizingChambersNumber = function() {
    return this.c.getEngineSize().getChambersNo();
}
Config.prototype.setEngineSizingChambersNumber = function(n) {
    this.c.getEngineSize().setChambersNo(n);
}

Config.prototype.getChamberLengthStar = function(unit) {
  return this.c.getChamberGeometry().getChamberLength();
}
Config.prototype.setChamberLengthStar = function(l, unit) {
  return this.c.getChamberGeometry().setChamberLength(l, unit);
}
Config.prototype.getChamberContractionAngle = function(unit) {
  return this.c.getChamberGeometry().getContractionAngle();
}
Config.prototype.setChamberContractionAngle = function(a) {
  return this.c.getChamberGeometry().setContractionAngle(a);
}
Config.prototype.getChamberR1ToRtRatio = function() {
  return this.c.getChamberGeometry().getR1ToRtRatio();
}
Config.prototype.setChamberR1ToRtRatio = function(r) {
  return this.c.getChamberGeometry().setR1ToRtRatio(r);
}
Config.prototype.getChamberRnToRtRatio = function() {
  return this.c.getChamberGeometry().getRnToRtRatio();
}
Config.prototype.setChamberRnToRtRatio = function(r) {
  return this.c.getChamberGeometry().setRnToRtRatio(r);
}
Config.prototype.getChamberR2ToR2maxRatio = function() {
  return this.c.getChamberGeometry().getR2ToR2maxRatio();
}
Config.prototype.setChamberR2ToR2maxRatio = function(r) {
  return this.c.getChamberGeometry().setR2ToR2maxRatio(r);
}
Config.prototype.checkNozzleShapeType = function(type) {
  if ("toc"==type || "TOC"==type) {
    return this.c.getChamberGeometry().isTOC();
  }
  if ("parabolic"==type) {
    return this.c.getChamberGeometry().isParabolicExitAngle();
  }
  return false;
}
Config.prototype.setTOC = function(s) {
  this.c.getChamberGeometry().setTOC(!!!s?false:true);
}
Config.prototype.setParabolicExitAngle = function(a) {
  this.c.getChamberGeometry().setParabolicExitAngle(a);
}
Config.prototype.getParabolicExitAngle = function() {
  return this.c.getChamberGeometry().getParabolicExitAngle();
}

Config.prototype.getPropellant = function() {
  return this.c.getPropellant().getPropellant();
}


