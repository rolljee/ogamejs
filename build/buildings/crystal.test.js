"use strict";

var _crystal = _interopRequireDefault(require("./crystal"));

var _buildings = _interopRequireDefault(require("../models/buildings"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('Crystal mine informations should be correctly return when', function () {
  it('Level 30 is given and universe speed is 5 and position is 1', function () {
    var mine = _buildings["default"][2].base;
    var crystalMine = (0, _crystal["default"])(mine, 30, 1, 5);
    expect(crystalMine).toEqual({
      production: 68052,
      energy: 5234,
      metal: 39876839,
      crystal: 19938419,
      deuterium: 0
    });
  });
  it('Level 30 is given and universe speed is 5 and position is 15', function () {
    var mine = _buildings["default"][2].base;
    var crystalMine = (0, _crystal["default"])(mine, 30, 15, 5);
    expect(crystalMine).toEqual({
      production: 52348,
      energy: 5234,
      metal: 39876839,
      crystal: 19938419,
      deuterium: 0
    });
  });
});