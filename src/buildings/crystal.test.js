import getCrystalMine from './crystal';
import BUILDINGS from '../models/buildings';

describe('Crystal mine informations should be correctly return when', () => {
  it('Level 30 is given and universe speed is 5 and position is 1', () => {
    const mine = BUILDINGS[2].base;
    const crystalMine = getCrystalMine(mine, 30, 1, 5);
    expect(crystalMine).toEqual({
      production: 68052,
      energy: 5234,
      metal: 39876839,
      crystal: 19938419,
      deuterium: 0,
    });
  });

  it('Level 30 is given and universe speed is 5 and position is 15', () => {
    const mine = BUILDINGS[2].base;
    const crystalMine = getCrystalMine(mine, 30, 15, 5);
    expect(crystalMine).toEqual({
      production: 52348,
      energy: 5234,
      metal: 39876839,
      crystal: 19938419,
      deuterium: 0,
    });
  });
});
