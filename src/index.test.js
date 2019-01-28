import Ogame from './index';

test('Should parse rate correctly if not specified', () => {
	const res = Ogame.parseRate();
	expect(res).toEqual({
		rateMetal: 2,
		rateCristal: 1.5,
		rateDeut: 1
	});
});

test('Should parse rate correctly if correctly specified', () => {
	const res = Ogame.parseRate('3:1.7:1');
	expect(res).toEqual({
		rateMetal: 3,
		rateCristal: 1.7,
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
	const { metal, cristal } = Ogame.sellDeut(100000, 60, 40, '2:1.5:1');
	expect(metal).toBe(120000);
	expect(cristal).toBe(60000);
});
