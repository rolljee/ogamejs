import { hasNaN } from './utils';

test('Giving a NaN should return true', () => {
	const res = hasNaN([NaN, 10, 11]);
	expect(res).toBe(true);
});

test('Giving good number should return false', () => {
	const res = hasNaN([15, 10, 11]);
	expect(res).toBe(false);
});
