import getFusionReactor from './fusion-reactor';
import BUILDINGS from '../models/buildings';

describe('Fusion reactor informations should be correctly return when', () => {
  it('Level 19 is given with ernergy tech 17', () => {
    const reactor = BUILDINGS[5].base;
    const fusionReact = getFusionReactor(reactor, 19, 17, 5);
    expect(fusionReact).toEqual({
      production: 24929,
      energy: 0,
      metal: 35411767,
      crystal: 14164706,
      deuterium: 7082353,
      consumption: 5810,
    });
  });
});
