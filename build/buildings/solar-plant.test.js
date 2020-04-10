"use strict";

var _solarPlant = _interopRequireDefault(require("./solar-plant"));

var _buildings = _interopRequireDefault(require("../models/buildings"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('Solar plant informations should be correctly return when', function () {
  it('Level 25 is given', function () {
    var mine = _buildings["default"][4].base;
    var solarPlant = (0, _solarPlant["default"])(mine, 25);
    expect(solarPlant).toEqual({
      production: 5417,
      energy: 0,
      metal: 1262558,
      crystal: 505023,
      deuterium: 0
    });
  });
});