import hasNaN from './utils';

describe('Test has NaN function', () => {
	it('Giving a NaN should return true', () => {
		const res = hasNaN([NaN, 10, 11]);
		expect(res).toBe(true);
	});

	it('Giving good number should return false', () => {
		const res = hasNaN([15, 10, 11]);
		expect(res).toBe(false);
	});
});
