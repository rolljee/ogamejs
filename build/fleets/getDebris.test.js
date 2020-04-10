"use strict";

var _getDebris = _interopRequireDefault(require("./getDebris"));

var _destroyable = _interopRequireDefault(require("../models/destroyable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('Debris should be correctly return when', function () {
  it('A 10 light fighter crash with 60% in harvest fields', function () {
    var ship = _destroyable["default"][1];
    var debris = (0, _getDebris["default"])(ship, 10, 0.6);
    expect(debris).toEqual({
      metal: 18000,
      crystal: 6000
    });
  });
  it('A 10 light fighter crash with 30% in harvest fields', function () {
    var ship = _destroyable["default"][1];
    var debris = (0, _getDebris["default"])(ship, 10, 0.3);
    expect(debris).toEqual({
      metal: 9000,
      crystal: 3000
    });
  });
});