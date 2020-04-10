"use strict";

var _parseRate = _interopRequireDefault(require("./parseRate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('Parse rate given a resource and a rate', function () {
  it('Parse rate by selling deut', function () {
    var res = (0, _parseRate["default"])('2:1.5:1', 'deut');
    expect(res).toEqual({
      rateMetal: 2,
      rateCrystal: 1.5,
      rateDeut: 1
    });
  });
  it('Parse rate by selling metal', function () {
    var res = (0, _parseRate["default"])('2:1.5:1', 'metal');
    expect(res).toEqual({
      rateMetal: 2 / 2,
      rateCrystal: 1.5 / 2,
      rateDeut: 1 / 2
    });
  });
  it('Parse rate by selling crystal', function () {
    var res = (0, _parseRate["default"])('2:1.5:1', 'crystal');
    expect(res).toEqual({
      rateMetal: 2 / 1.5,
      rateCrystal: 1.5 / 1.5,
      rateDeut: 1 / 1.5
    });
  });
  it('Should return an error if rate is not correctly specified', function () {
    try {
      var res = (0, _parseRate["default"])('3:toto:1');
      expect(res).toBe(true); // explicitly fail since we test the throw
    } catch (e) {
      expect(e).toEqual(new Error('rate not parsed correctly'));
    }
  });
});