"use strict";

var _fusionReactor = _interopRequireDefault(require("./fusion-reactor"));

var _buildings = _interopRequireDefault(require("../models/buildings"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('Fusion reactor informations should be correctly return when', function () {
  it('Level 19 is given with ernergy tech 17', function () {
    var reactor = _buildings["default"][5].base;
    var fusionReact = (0, _fusionReactor["default"])(reactor, 19, 17, 5);
    expect(fusionReact).toEqual({
      production: 24929,
      energy: 0,
      metal: 35411767,
      crystal: 14164706,
      deuterium: 7082353,
      consumption: 5810
    });
  });
});