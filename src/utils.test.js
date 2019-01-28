import { sum, hasNaN } from './utils';

test('adds 1 + 2 to equal 3', () => {
	expect(sum(1, 2)).toBe(3);
});

test('Giving a NaN should return true', () => {
	const res = hasNaN([NaN, 10, 11]);
	expect(res).toBe(true);
});

test('Giving good number should return false', () => {
	const res = hasNaN([15, 10, 11]);
	expect(res).toBe(false);
});
