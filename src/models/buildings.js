const BUILDINGS = Object.freeze({
	1: {
		name: 'Mine de métal',
		base: {
			production: 30,
			consumption: 0,
			metal: 60,
			crystal: 15,
			deutrium: 0,
			energy: 10
		}
	},
	2: {
		name: 'Mine de cristal',
		base: {
			production: 20,
			consumption: 0,
			metal: 48,
			crystal: 24,
			deutrium: 0,
			energy: 10
		}
	},
	3: {
		name: 'Synthétiseur de deutérium',
		base: {
			production: 10,
			consumption: 0,
			metal: 225,
			crystal: 75,
			deutrium: 0,
			energy: 20
		}
	},
	4: {
		name: 'Centrale électrique solaire',
		base: {
			production: 20,
			consumption: 0,
			metal: 75,
			crystal: 30,
			deutrium: 0,
			energy: 0
		}
	},
	5: {
		name: 'Centrale électrique de fusion',
		base: {
			production: 30,
			consumption: 10,
			metal: 900,
			crystal: 360,
			deutrium: 180,
			energy: 0
		}
	}
});

export default BUILDINGS;
