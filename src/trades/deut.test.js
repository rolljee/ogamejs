import sellDeut from './deut';

describe('A deut trade', () => {
	it('Sell 100000 at 50/50 at rate 2:1.5:1', () => {
		const { metal, crystal } = sellDeut(100000, 50, 50, '2:1.5:1');
		expect(metal).toBe(100000);
		expect(crystal).toBe(75000);
	});
});
