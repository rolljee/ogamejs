"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _parseRate2 = _interopRequireDefault(require("./parseRate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function sellDeut() {
  var deut = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var percentM = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 60;
  var percentC = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 40;
  var rate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '2:1.5:1';
  var pMetal = percentM / 100;
  var pCrystal = percentC / 100;

  var _parseRate = (0, _parseRate2["default"])(rate, 'deut'),
      rateMetal = _parseRate.rateMetal,
      rateCrystal = _parseRate.rateCrystal;

  var metal = pMetal * rateMetal * deut;
  var crystal = pCrystal * rateCrystal * deut;
  return {
    metal: Math.round(metal),
    crystal: Math.round(crystal)
  };
}

var _default = sellDeut;
exports["default"] = _default;