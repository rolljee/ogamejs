"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = parseRate;

var _utils = _interopRequireDefault(require("./utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function extract(rate, type) {
  var res = {};
  var split = rate.split(':').map(Number);
  var metal = split[0];
  var crystal = split[1];
  var deut = split[2];

  if (type === 'metal') {
    res = {
      rateMetal: 1,
      rateCrystal: crystal / metal,
      rateDeut: deut / metal
    };
  } else if (type === 'crystal') {
    res = {
      rateMetal: metal / crystal,
      rateCrystal: 1,
      rateDeut: deut / crystal
    };
  } else if (type === 'deut') {
    res = {
      rateMetal: metal,
      rateCrystal: crystal,
      rateDeut: 1
    };
  } else {
    throw new Error("".concat(type, " is not part of the game, try one of metal, crystal, deut"));
  }

  return res;
}

function parseRate() {
  var rate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '2:1.5:1';
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'deut';
  var split = rate.split(':');

  if (split.length !== 3) {
    throw new Error('rate not parsed correctly');
  }

  var res = extract(rate, type);

  if ((0, _utils["default"])(Object.values(res))) {
    throw new Error('rate not parsed correctly');
  }

  return res;
}