import getDeutMine from './deut';
import BUILDINGS from '../models/buildings';

describe('Deut mine informations should be correctly return when', () => {
	it('Level 30 is given and universe speed is 5 and average temperature is 37', () => {
		const mine = BUILDINGS[3].base;
		const crystalMine = getDeutMine(mine, 30, 37, 5);
		expect(crystalMine).toEqual({
			production: 31721,
			energy: 10469,
			metal: 28762658,
			crystal: 9587552,
			deuterium: 0
		});
	});

	it('Level 32 is given and universe speed is 5 and average temperature is 138', () => {
		const mine = BUILDINGS[3].base;
		const crystalMine = getDeutMine(mine, 31, -138, 5);
		expect(crystalMine).toEqual({
			production: 56882,
			energy: 11900,
			metal: 43143988,
			crystal: 14381329,
			deuterium: 0
		});
	});
});
