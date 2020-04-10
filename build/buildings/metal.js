"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function getMineProduction(baseProduction, targetLevel, universeSpeed) {
  var levelFactor = Math.pow(1.1, targetLevel);
  return Math.floor(baseProduction * targetLevel * levelFactor * universeSpeed);
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
 * Return information about the metal mine given a specific level
 * @param {object} mine The metal mine base information
 * @param {number} targetLevel
 * @param {number} universeSpeed production factor is increased for some universe
 * @returns {Object} informations about the metal mine at this specific level
 */


function getMetalMine(mine, targetLevel) {
  var universeSpeed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  return {
    crystal: getCrystalCost(mine.crystal, targetLevel),
    deuterium: 0,
    energy: getEnergyCost(mine.energy, targetLevel),
    metal: getMetalCost(mine.metal, targetLevel),
    production: getMineProduction(mine.production, targetLevel, universeSpeed)
  };
}

var _default = getMetalMine;
exports["default"] = _default;