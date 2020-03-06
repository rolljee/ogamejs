"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _utils = _interopRequireDefault(require("./utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Trader = {
  extract: function extract(rate, type) {
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
  },
  parseRate: function parseRate() {
    var rate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '2:1.5:1';
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'deut';
    var split = rate.split(':');

    if (split.length !== 3) {
      throw new Error('rate not parsed correctly');
    }

    var res = this.extract(rate, type);

    if ((0, _utils["default"])(Object.values(res))) {
      throw new Error('rate not parsed correctly');
    }

    return res;
  },
  sellDeut: function sellDeut() {
    var deut = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var percentM = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 60;
    var percentC = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 40;
    var rate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '2:1.5:1';
    var pMetal = percentM / 100;
    var pCrystal = percentC / 100;

    var _this$parseRate = this.parseRate(rate, 'deut'),
        rateMetal = _this$parseRate.rateMetal,
        rateCrystal = _this$parseRate.rateCrystal;

    var metal = pMetal * rateMetal * deut;
    var crystal = pCrystal * rateCrystal * deut;
    return {
      metal: Math.round(metal),
      crystal: Math.round(crystal)
    };
  },
  sellMetal: function sellMetal() {
    var metal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var percentD = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 40;
    var percentC = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 60;
    var rate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '2:1.5:1';
    var pDeut = percentD / 100;
    var pCrystal = percentC / 100;

    var _this$parseRate2 = this.parseRate(rate, 'metal'),
        rateDeut = _this$parseRate2.rateDeut,
        rateCrystal = _this$parseRate2.rateCrystal;

    var deut = pDeut * rateDeut * metal;
    var crystal = pCrystal * rateCrystal * metal;
    return {
      deut: Math.round(deut),
      crystal: Math.round(crystal)
    };
  },
  sellCrystal: function sellCrystal() {
    var crystal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var percentD = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 40;
    var percentM = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 60;
    var rate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '2:1.5:1';
    var pDeut = percentD / 100;
    var pMetal = percentM / 100;

    var _this$parseRate3 = this.parseRate(rate, 'crystal'),
        rateDeut = _this$parseRate3.rateDeut,
        rateMetal = _this$parseRate3.rateMetal;

    var deut = pDeut * rateDeut * crystal;
    var metal = pMetal * rateMetal * crystal;
    return {
      deut: Math.round(deut),
      metal: Math.round(metal)
    };
  }
};
var _default = Trader;
exports["default"] = _default;