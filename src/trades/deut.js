import parseRate from './parseRate';

function sellDeut(deut = 0, percentM = 60, percentC = 40, rate = '2:1.5:1') {
	const pMetal = percentM / 100;
	const pCrystal = percentC / 100;
	const { rateMetal, rateCrystal } = parseRate(rate, 'deut');
	const metal = pMetal * rateMetal * deut;
	const crystal = pCrystal * rateCrystal * deut;

	return {
		metal: Math.round(metal),
		crystal: Math.round(crystal)
	};
}

export default sellDeut;
