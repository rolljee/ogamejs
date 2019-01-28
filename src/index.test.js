import Ogame from './index';

test('Should parse rate correctly if correctly specified', () => {
	const res = Ogame.parseRate('3:1.7:1');
	expect(res).toEqual({
		rateMetal: 3,
		rateCrystal: 1.7,
		rateDeut: 1
	});
});

test('Should return an error if rate is not correctly specified', () => {
	try {
		const res = Ogame.parseRate('3:toto:1');
		expect(res).toBe(true); // explicitly fail since we test the throw
	} catch (e) {
		expect(e).toEqual(new Error('rate not parsed correctly'));
	}
});

test('Should calc deut correclty', () => {
	const { metal, crystal } = Ogame.sellDeut(100000, 50, 50, '2:1.5:1');
	expect(metal).toBe(120000);
	expect(crystal).toBe(60000);
});

test('Should calc metal correclty', () => {
	const { deut, crystal } = Ogame.sellMetal(100000, 50, 50, '2:1.5:1');
	expect(deut).toBe(60000);
	expect(crystal).toBe(60000);
});

test('Should calc crystal correclty', () => {
	const { deut, metal } = Ogame.sellCrystal(100000, 50, 50, '2:1.5:1');
	expect(deut).toBe(133333);
	expect(metal).toBe(66666);
});
