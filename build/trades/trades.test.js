"use strict";

var _trades = _interopRequireDefault(require("./trades"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

test('Parse rate by selling deut', function () {
  var res = _trades["default"].parseRate('2:1.5:1', 'deut');

  expect(res).toEqual({
    rateMetal: 2,
    rateCrystal: 1.5,
    rateDeut: 1
  });
});
test('Parse rate by selling metal', function () {
  var res = _trades["default"].parseRate('2:1.5:1', 'metal');

  expect(res).toEqual({
    rateMetal: 2 / 2,
    rateCrystal: 1.5 / 2,
    rateDeut: 1 / 2
  });
});
test('Parse rate by selling crystal', function () {
  var res = _trades["default"].parseRate('2:1.5:1', 'crystal');

  expect(res).toEqual({
    rateMetal: 2 / 1.5,
    rateCrystal: 1.5 / 1.5,
    rateDeut: 1 / 1.5
  });
});
test('Should return an error if rate is not correctly specified', function () {
  try {
    var res = _trades["default"].parseRate('3:toto:1');

    expect(res).toBe(true); // explicitly fail since we test the throw
  } catch (e) {
    expect(e).toEqual(new Error('rate not parsed correctly'));
  }
});
test('Should calc deut correclty', function () {
  var _Trader$sellDeut = _trades["default"].sellDeut(100000, 50, 50, '2:1.5:1'),
      metal = _Trader$sellDeut.metal,
      crystal = _Trader$sellDeut.crystal;

  expect(metal).toBe(100000);
  expect(crystal).toBe(75000);
});
test('Should calc metal correclty', function () {
  var _Trader$sellMetal = _trades["default"].sellMetal(100000, 50, 50, '2:1.5:1'),
      deut = _Trader$sellMetal.deut,
      crystal = _Trader$sellMetal.crystal;

  expect(deut).toBe(25000);
  expect(crystal).toBe(37500);
});
test('Should calc crystal correclty', function () {
  var _Trader$sellCrystal = _trades["default"].sellCrystal(100000, 50, 50, '2:1.5:1'),
      deut = _Trader$sellCrystal.deut,
      metal = _Trader$sellCrystal.metal;

  expect(deut).toBe(33333);
  expect(metal).toBe(66667);
});