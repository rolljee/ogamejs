import getSolarPlant from './solar-plant';
import BUILDINGS from '../models/buildings';

describe('Solar plant informations should be correctly return when', () => {
  it('Level 25 is given', () => {
    const mine = BUILDINGS[4].base;
    const solarPlant = getSolarPlant(mine, 25);
    expect(solarPlant).toEqual({
      production: 5417,
      energy: 0,
      metal: 1262558,
      crystal: 505023,
      deuterium: 0,
    });
  });
});
