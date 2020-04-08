
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

const _utils = _interopRequireDefault(require('./utils'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Trader = {
  extract: function extract(rate, type) {
    let res = {};
    const split = rate.split(':').map(Number);
    const metal = split[0];
    const crystal = split[1];
    const deut = split[2];

    if (type === 'metal') {
      res = {
        rateMetal: 1,
        rateCrystal: crystal / metal,
        rateDeut: deut / metal,
      };
    } else if (type === 'crystal') {
      res = {
        rateMetal: metal / crystal,
        rateCrystal: 1,
        rateDeut: deut / crystal,
      };
    } else if (type === 'deut') {
      res = {
        rateMetal: metal,
        rateCrystal: crystal,
        rateDeut: 1,
      };
    } else {
      throw new Error(''.concat(type, ' is not part of the game, try one of metal, crystal, deut'));
    }

    return res;
  },
  parseRate: function parseRate() {
    const rate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '2:1.5:1';
    const type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'deut';
    const split = rate.split(':');

    if (split.length !== 3) {
      throw new Error('rate not parsed correctly');
    }

    const res = this.extract(rate, type);

    if ((0, _utils.default)(Object.values(res))) {
      throw new Error('rate not parsed correctly');
    }

    return res;
  },
  sellDeut: function sellDeut() {
    const deut = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    const percentM = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 60;
    const percentC = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 40;
    const rate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '2:1.5:1';
    const pMetal = percentM / 100;
    const pCrystal = percentC / 100;

    const _this$parseRate = this.parseRate(rate, 'deut');
    const { rateMetal } = _this$parseRate;
    const { rateCrystal } = _this$parseRate;

    const metal = pMetal * rateMetal * deut;
    const crystal = pCrystal * rateCrystal * deut;
    return {
      metal: Math.round(metal),
      crystal: Math.round(crystal),
    };
  },
  sellMetal: function sellMetal() {
    const metal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    const percentD = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 40;
    const percentC = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 60;
    const rate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '2:1.5:1';
    const pDeut = percentD / 100;
    const pCrystal = percentC / 100;

    const _this$parseRate2 = this.parseRate(rate, 'metal');
    const { rateDeut } = _this$parseRate2;
    const { rateCrystal } = _this$parseRate2;

    const deut = pDeut * rateDeut * metal;
    const crystal = pCrystal * rateCrystal * metal;
    return {
      deut: Math.round(deut),
      crystal: Math.round(crystal),
    };
  },
  sellCrystal: function sellCrystal() {
    const crystal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    const percentD = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 40;
    const percentM = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 60;
    const rate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '2:1.5:1';
    const pDeut = percentD / 100;
    const pMetal = percentM / 100;

    const _this$parseRate3 = this.parseRate(rate, 'crystal');
    const { rateDeut } = _this$parseRate3;
    const { rateMetal } = _this$parseRate3;

    const deut = pDeut * rateDeut * crystal;
    const metal = pMetal * rateMetal * crystal;
    return {
      deut: Math.round(deut),
      metal: Math.round(metal),
    };
  },
};
const _default = Trader;
exports.default = _default;
