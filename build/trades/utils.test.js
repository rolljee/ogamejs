"use strict";

var _utils = _interopRequireDefault(require("./utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('Test has NaN function', function () {
  it('Giving a NaN should return true', function () {
    var res = (0, _utils["default"])([NaN, 10, 11]);
    expect(res).toBe(true);
  });
  it('Giving good number should return false', function () {
    var res = (0, _utils["default"])([15, 10, 11]);
    expect(res).toBe(false);
  });
});