import { hasNaN } from './utils';

const Ogame = {
	parseRate(rate = '2:1.5:1') {
		const split = rate.split(':');

		if (split.length !== 3) {
			throw new Error('rate not parsed correctly');
		}

		const res = {
			rateMetal: Number(split[0]),
			rateCristal: Number(split[1]),
			rateDeut: Number(split[2])
		};

		if (hasNaN(Object.values(res))) {
			throw new Error('rate not parsed correctly');
		}

		return res;
	},

	sellDeut(deut = 0, percentM = 60, percentC = 40, rate = '2:1.5:1') {
		const pMetal = percentM / 100;
		const pCristal = percentC / 100;
		const { rateMetal, rateCristal } = this.parseRate(rate);
		const metal = pMetal * rateMetal * deut;
		const cristal = pCristal * rateCristal * deut;

		return {
			metal: Math.round(metal),
			cristal: Math.round(cristal)
		};
	}
};

export default Ogame;
