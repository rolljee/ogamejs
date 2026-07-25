import getDebris from './getDebris.js';
import DESTROYABLE from '../models/destroyable.js';

describe('Debris should be correctly return when', () => {
  it('A 10 light fighter crash with 60% in harvest fields', () => {
    const ship = DESTROYABLE[1];
    const debris = getDebris(ship, 10, 0.6);
    expect(debris).toEqual({ metal: 18000, crystal: 6000, deuterium: 0 });
  });

  it('A 10 light fighter crash with 30% in harvest fields', () => {
    const ship = DESTROYABLE[1];
    const debris = getDebris(ship, 10, 0.3);
    expect(debris).toEqual({ metal: 9000, crystal: 3000, deuterium: 0 });
  });

  it('The universe also puts deuterium in the debris field', () => {
    const cruiser = DESTROYABLE[3];
    const debris = getDebris(cruiser, 10, 0.3, 0.3);
    expect(debris).toEqual({ metal: 60000, crystal: 21000, deuterium: 6000 });
  });

  it('A defense is destroyed', () => {
    const plasmaTurret = DESTROYABLE[206];
    const debris = getDebris(plasmaTurret, 2, 0.5);
    expect(debris).toEqual({ metal: 50000, crystal: 50000, deuterium: 0 });
  });
});
