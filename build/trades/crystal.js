"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _parseRate2 = _interopRequireDefault(require("./parseRate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function sellCrystal() {
  var crystal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var percentD = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 40;
  var percentM = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 60;
  var rate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '2:1.5:1';
  var pDeut = percentD / 100;
  var pMetal = percentM / 100;

  var _parseRate = (0, _parseRate2["default"])(rate, 'crystal'),
      rateDeut = _parseRate.rateDeut,
      rateMetal = _parseRate.rateMetal;

  var deut = pDeut * rateDeut * crystal;
  var metal = pMetal * rateMetal * crystal;
  return {
    deut: Math.round(deut),
    metal: Math.round(metal)
  };
}

var _default = sellCrystal;
exports["default"] = _default;