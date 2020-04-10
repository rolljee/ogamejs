"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function getEnergyProduction(baseProduction, targetLevel) {
  var levelFactor = Math.pow(1.1, targetLevel);
  return Math.floor(baseProduction * targetLevel * levelFactor);
}

function getMetalCost(baseMetalCost, targetLevel) {
  var level = targetLevel - 1;
  return Math.floor(baseMetalCost * Math.pow(1.5, level));
}

function getCrystalCost(baseCrystalCost, targetLevel) {
  var level = targetLevel - 1;
  return Math.floor(baseCrystalCost * Math.pow(1.5, level));
}
/**
 *
 * Return information about the solar plant given a specific level
 * @param {object} solarPlant The solarPlant base information
 * @param {number} targetLevel
 * @returns {Object} informations about the solar plant at this specific level
 */


function getSolarPlant(solarPlant, targetLevel) {
  return {
    crystal: getCrystalCost(solarPlant.crystal, targetLevel),
    energy: 0,
    deuterium: 0,
    metal: getMetalCost(solarPlant.metal, targetLevel),
    production: getEnergyProduction(solarPlant.production, targetLevel)
  };
}

var _default = getSolarPlant;
exports["default"] = _default;