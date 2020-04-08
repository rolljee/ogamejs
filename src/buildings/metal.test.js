import getMetalMine from './metal';
import BUILDINGS from '../models/buildings';

describe('Metal mine informations should be correctly return when', () => {
  it('Level 10 is given and universe speed is 5', () => {
    const mine = BUILDINGS[1].base;
    const metalMine = getMetalMine(mine, 10, 5);
    expect(metalMine).toEqual({
      production: 3890,
      energy: 259,
      metal: 2306,
      crystal: 576,
      deuterium: 0,
    });
  });

  it('Level 36 is given and universe speed is 5', () => {
    const mine = BUILDINGS[1].base;
    const metalMine = getMetalMine(mine, 36, 5);
    expect(metalMine).toEqual({
      production: 166928,
      energy: 11128,
      metal: 87366576,
      crystal: 21841644,
      deuterium: 0,
    });
  });
});
