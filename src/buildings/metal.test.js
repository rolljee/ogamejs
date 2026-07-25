import getMetalMine from './metal.js';
import BUILDINGS from '../models/buildings.js';

describe('Metal mine informations should be correctly return when', () => {
  it('Level 10 is given and universe speed is 5', () => {
    const mine = BUILDINGS[1];
    const metalMine = getMetalMine(mine, 10, 5);
    expect(metalMine).toEqual({
      production: 3890,
      energyCost: 0,
      energyConsumption: 259,
      deuteriumConsumption: 0,
      metal: 2306,
      crystal: 576,
      deuterium: 0,
    });
  });

  it('Level 36 is given and universe speed is 5', () => {
    const mine = BUILDINGS[1];
    const metalMine = getMetalMine(mine, 36, 5);
    expect(metalMine).toEqual({
      production: 166928,
      energyCost: 0,
      energyConsumption: 11128,
      deuteriumConsumption: 0,
      metal: 87366576,
      crystal: 21841644,
      deuterium: 0,
    });
  });
});
