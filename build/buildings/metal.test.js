"use strict";

var _metal = _interopRequireDefault(require("./metal"));

var _buildings = _interopRequireDefault(require("../models/buildings"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('Metal mine informations should be correctly return when', function () {
  it('Level 10 is given and universe speed is 5', function () {
    var mine = _buildings["default"][1].base;
    var metalMine = (0, _metal["default"])(mine, 10, 5);
    expect(metalMine).toEqual({
      production: 3890,
      energy: 259,
      metal: 2306,
      crystal: 576,
      deuterium: 0
    });
  });
  it('Level 36 is given and universe speed is 5', function () {
    var mine = _buildings["default"][1].base;
    var metalMine = (0, _metal["default"])(mine, 36, 5);
    expect(metalMine).toEqual({
      production: 166928,
      energy: 11128,
      metal: 87366576,
      crystal: 21841644,
      deuterium: 0
    });
  });
});