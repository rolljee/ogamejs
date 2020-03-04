import Ogame from './trades';

test('Parse rate by selling deut', () => {
	const res = Ogame.parseRate('2:1.5:1', 'deut');
	expect(res).toEqual({
		rateMetal: 2,
		rateCrystal: 1.5,
		rateDeut: 1
	});
});

test('Parse rate by selling metal', () => {
	const res = Ogame.parseRate('2:1.5:1', 'metal');
	expect(res).toEqual({
		rateMetal: 2 / 2,
		rateCrystal: 1.5 / 2,
		rateDeut: 1 / 2
	});
});

test('Parse rate by selling crystal', () => {
	const res = Ogame.parseRate('2:1.5:1', 'crystal');
	expect(res).toEqual({
		rateMetal: 2 / 1.5,
		rateCrystal: 1.5 / 1.5,
		rateDeut: 1 / 1.5
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
	expect(metal).toBe(100000);
	expect(crystal).toBe(75000);
});

test('Should calc metal correclty', () => {
	const { deut, crystal } = Ogame.sellMetal(100000, 50, 50, '2:1.5:1');
	expect(deut).toBe(25000);
	expect(crystal).toBe(37500);
});

test('Should calc crystal correclty', () => {
	const { deut, metal } = Ogame.sellCrystal(100000, 50, 50, '2:1.5:1');
	expect(deut).toBe(33333);
	expect(metal).toBe(66667);
});
