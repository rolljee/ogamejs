"use strict";

var _metal = _interopRequireDefault(require("./metal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('A deut trade', function () {
  it('Sell 100000 at 50/50 at rate 2:1.5:1', function () {
    var _sellMetal = (0, _metal["default"])(100000, 50, 50, '2:1.5:1'),
        deut = _sellMetal.deut,
        crystal = _sellMetal.crystal;

    expect(deut).toBe(25000);
    expect(crystal).toBe(37500);
  });
});