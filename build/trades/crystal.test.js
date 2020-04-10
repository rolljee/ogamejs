"use strict";

var _crystal = _interopRequireDefault(require("./crystal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('A crystal trade', function () {
  it('Sell 100000 at 50/50 at rate 2:1.5:1', function () {
    var _sellCrystal = (0, _crystal["default"])(100000, 50, 50, '2:1.5:1'),
        deut = _sellCrystal.deut,
        metal = _sellCrystal.metal;

    expect(deut).toBe(33333);
    expect(metal).toBe(66667);
  });
});