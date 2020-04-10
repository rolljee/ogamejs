"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/**
 *
 * Returns the number of debris generated
 * @param {number} shipId The ship identifier
 * @param {number} number The number of ship
 * @param {number} factor The universe debris factor
 * @return {Object} The debris generated
 */
function getDebris(ship, number, factor) {
  var cost = ship.cost;
  var metalDebris = cost.metal ? cost.metal * factor : 0;
  var crystalDebris = cost.crystal ? cost.crystal * factor : 0;
  return {
    metal: metalDebris * number,
    crystal: crystalDebris * number
  };
}

var _default = getDebris;
exports["default"] = _default;