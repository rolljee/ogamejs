import getSolarPlant from './solar-plant.js';
import BUILDINGS from '../models/buildings.js';

describe('Solar plant informations should be correctly return when', () => {
  it('Level 25 is given', () => {
    const mine = BUILDINGS[4];
    const solarPlant = getSolarPlant(mine, 25);
    expect(solarPlant).toEqual({
      production: 5417,
      energyCost: 0,
      energyConsumption: 0,
      deuteriumConsumption: 0,
      metal: 1262558,
      crystal: 505023,
      deuterium: 0,
    });
  });
});
