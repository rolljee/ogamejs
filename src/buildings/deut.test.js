import getDeutMine from './deut.js';
import BUILDINGS from '../models/buildings.js';

describe('Deut mine informations should be correctly return when', () => {
  it('Level 30 is given and universe speed is 5 and average temperature is 37', () => {
    const mine = BUILDINGS[3];
    const crystalMine = getDeutMine(mine, 30, 37, 5);
    expect(crystalMine).toEqual({
      production: 31721,
      energyCost: 0,
      energyConsumption: 10469,
      deuteriumConsumption: 0,
      metal: 28762658,
      crystal: 9587552,
      deuterium: 0,
    });
  });

  it('Level 32 is given and universe speed is 5 and average temperature is 138', () => {
    const mine = BUILDINGS[3];
    const crystalMine = getDeutMine(mine, 31, -138, 5);
    expect(crystalMine).toEqual({
      production: 56882,
      energyCost: 0,
      energyConsumption: 11900,
      deuteriumConsumption: 0,
      metal: 43143988,
      crystal: 14381329,
      deuterium: 0,
    });
  });
});
