import parseRate from './parseRate';

function sellCrystal(crystal = 0, percentD = 40, percentM = 60, rate = '2:1.5:1') {
	const pDeut = percentD / 100;
	const pMetal = percentM / 100;
	const { rateDeut, rateMetal } = parseRate(rate, 'crystal');
	const deut = pDeut * rateDeut * crystal;
	const metal = pMetal * rateMetal * crystal;

	return {
		deut: Math.round(deut),
		metal: Math.round(metal)
	};
}

export default sellCrystal;
