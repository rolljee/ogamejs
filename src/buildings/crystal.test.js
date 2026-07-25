import getCrystalMine from './crystal.js';
import BUILDINGS from '../models/buildings.js';

describe('Crystal mine informations should be correctly return when', () => {
  it('Level 30 is given and universe speed is 5 and position is 1', () => {
    const mine = BUILDINGS[2];
    const crystalMine = getCrystalMine(mine, 30, 1, 5);
    expect(crystalMine).toEqual({
      production: 68052,
      energyCost: 0,
      energyConsumption: 5234,
      deuteriumConsumption: 0,
      metal: 39876839,
      crystal: 19938419,
      deuterium: 0,
    });
  });

  it('Level 30 is given and universe speed is 5 and position is 15', () => {
    const mine = BUILDINGS[2];
    const crystalMine = getCrystalMine(mine, 30, 15, 5);
    expect(crystalMine).toEqual({
      production: 52348,
      energyCost: 0,
      energyConsumption: 5234,
      deuteriumConsumption: 0,
      metal: 39876839,
      crystal: 19938419,
      deuterium: 0,
    });
  });
});
