import getDebris from './getDebris';

describe('Debris should be correctly return when', () => {
	it('A 10 light fighter crash with 60% in harvest fields', () => {
		const debris = getDebris(1, 10, 0.6);
		expect(debris).toEqual({ metal: 18000, crystal: 6000 });
	});

	it('A 10 light fighter crash with 30% in harvest fields', () => {
		const debris = getDebris(1, 10, 0.3);
		expect(debris).toEqual({ metal: 9000, crystal: 3000 });
	});
});
