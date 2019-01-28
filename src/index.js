import { hasNaN } from './utils';

const Ogame = {
	parseRate(rate = '2:1.5:1') {
		const split = rate.split(':');

		if (split.length !== 3) {
			throw new Error('rate not parsed correctly');
		}

		const res = {
			rateMetal: Number(split[0]),
			rateCrystal: Number(split[1]),
			rateDeut: Number(split[2])
		};

		if (hasNaN(Object.values(res))) {
			throw new Error('rate not parsed correctly');
		}

		return res;
	},

	sellDeut(deut = 0, percentM = 60, percentC = 40, rate = '2:1.5:1') {
		const pMetal = percentM / 100;
		const pCrystal = percentC / 100;
		const { rateMetal, rateCrystal } = this.parseRate(rate);
		const metal = pMetal * rateMetal * deut;
		const crystal = pCrystal * rateCrystal * deut;

		return {
			metal: Math.round(metal),
			crystal: Math.round(crystal)
		};
	},

	sellMetal(metal = 0, percentD = 40, percentC = 60, rate = '2:1.5:1') {
		const pDeut = percentD / 100;
		const pCrystal = percentC / 100;
		const { rateDeut, rateCrystal } = this.parseRate(rate);
		const deut = pDeut * rateDeut * metal;
		const crystal = pCrystal * rateCrystal * metal;

		return {
			deut: Math.round(deut),
			crystal: Math.round(crystal)
		};
	},

	sellCrystal(crystal = 0, percentD = 40, percentM = 60, rate = '2:1.5:1') {
		const pDeut = percentD / 100;
		const pMetal = percentM / 100;
		const { rateDeut, rateMetal } = this.parseRate(rate);
		const deut = pDeut * rateDeut * crystal;
		const metal = pMetal * rateMetal * crystal;

		return {
			deut: Math.round(deut),
			metal: Math.round(metal)
		};
	}
};

export default Ogame;
