"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function getPositionFactor(avg) {
  return 0.68 - 0.002 * avg;
}

function getMineProduction(energyCost, avg, universeSpeed) {
  var factor = getPositionFactor(avg);
  return Math.floor(universeSpeed * energyCost * factor);
}

function getEnergyCost(baseEnergyCost, targetLevel) {
  var level = targetLevel;
  var levelFactor = Math.pow(1.1, level);
  return Math.floor(baseEnergyCost * level * levelFactor);
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
 * Return information about the deuterium synth given a specific level
 * @param {object} mine The deut synth base information
 * @param {number} targetLevel the deuterieum synth target level
 * @param {number} avg planet average temperature - The lower the higher the prod is
 * @param {number} universeSpeed production factor is increased for some universe
 * @returns {Object} informations about the deut synth at this specific level
 */


function getDeutSynth(mine, targetLevel, avg) {
  var universeSpeed = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  var energyCost = getEnergyCost(mine.energy, targetLevel);
  return {
    crystal: getCrystalCost(mine.crystal, targetLevel),
    energy: energyCost,
    deuterium: 0,
    metal: getMetalCost(mine.metal, targetLevel),
    production: getMineProduction(energyCost, avg, universeSpeed)
  };
}

var _default = getDeutSynth;
exports["default"] = _default;