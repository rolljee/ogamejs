import getSolarPlant from './solar-plant';

describe('Solar plant informations should be correctly return when', () => {
	it('Level 25 is given', () => {
		const solarPlant = getSolarPlant(25, 5);
		expect(solarPlant).toEqual({
			production: 5417,
			energy: 0,
			metal: 1262558,
			crystal: 505023,
			deuterium: 0
		});
	});
});
