import getFusionReactor from './fusion-reactor.js';
import BUILDINGS from '../models/buildings.js';

describe('Fusion reactor informations should be correctly return when', () => {
  it('Level 19 is given with ernergy tech 17', () => {
    const reactor = BUILDINGS[5];
    const fusionReact = getFusionReactor(reactor, 19, 17, 5);
    expect(fusionReact).toEqual({
      production: 24929,
      energyCost: 0,
      energyConsumption: 0,
      deuteriumConsumption: 5810,
      metal: 35411767,
      crystal: 14164706,
      deuterium: 7082353,
    });
  });
});
