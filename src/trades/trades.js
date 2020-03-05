import hasNaN from './utils';

const Ogame = {
	extract(rate, type) {
		let res = {};
		const split = rate.split(':').map(Number);
		const metal = split[0];
		const crystal = split[1];
		const deut = split[2];

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
			throw new Error(`${type} is not part of the game, try one of metal, crystal, deut`);
		}

		return res;
	},

	parseRate(rate = '2:1.5:1', type = 'deut') {
		const split = rate.split(':');

		if (split.length !== 3) {
			throw new Error('rate not parsed correctly');
		}

		const res = this.extract(rate, type);

		if (hasNaN(Object.values(res))) {
			throw new Error('rate not parsed correctly');
		}

		return res;
	},

	sellDeut(deut = 0, percentM = 60, percentC = 40, rate = '2:1.5:1') {
		const pMetal = percentM / 100;
		const pCrystal = percentC / 100;
		const { rateMetal, rateCrystal } = this.parseRate(rate, 'deut');
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
		const { rateDeut, rateCrystal } = this.parseRate(rate, 'metal');
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
		const { rateDeut, rateMetal } = this.parseRate(rate, 'crystal');
		const deut = pDeut * rateDeut * crystal;
		const metal = pMetal * rateMetal * crystal;

		return {
			deut: Math.round(deut),
			metal: Math.round(metal)
		};
	}
};

export default Ogame;
