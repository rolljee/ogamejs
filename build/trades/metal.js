"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _parseRate2 = _interopRequireDefault(require("./parseRate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function sellMetal() {
  var metal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var percentD = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 40;
  var percentC = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 60;
  var rate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '2:1.5:1';
  var pDeut = percentD / 100;
  var pCrystal = percentC / 100;

  var _parseRate = (0, _parseRate2["default"])(rate, 'metal'),
      rateDeut = _parseRate.rateDeut,
      rateCrystal = _parseRate.rateCrystal;

  var deut = pDeut * rateDeut * metal;
  var crystal = pCrystal * rateCrystal * metal;
  return {
    deut: Math.round(deut),
    crystal: Math.round(crystal)
  };
}

var _default = sellMetal;
exports["default"] = _default;