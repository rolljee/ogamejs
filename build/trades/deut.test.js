"use strict";

var _deut = _interopRequireDefault(require("./deut"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('A deut trade', function () {
  it('Sell 100000 at 50/50 at rate 2:1.5:1', function () {
    var _sellDeut = (0, _deut["default"])(100000, 50, 50, '2:1.5:1'),
        metal = _sellDeut.metal,
        crystal = _sellDeut.crystal;

    expect(metal).toBe(100000);
    expect(crystal).toBe(75000);
  });
});