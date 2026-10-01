import { getMoonLockShips } from './moonLock.js';
import DESTROYABLE from '../models/destroyable.js';

const LIGHT_FIGHTER = DESTROYABLE[1];
const PROBE = DESTROYABLE[15];

describe('getMoonLockShips', () => {
  // Reference values shared with og-bot-discord (`!ogl`) and ogame-ui.
  it.each([
    [0.3, 1667, 6667],
    [0.5, 1000, 4000],
    [0.7, 715, 2858],
    [1, 500, 2000],
  ])('a %f debris factor needs %i light fighters or %i probes', (factor, fighters, probes) => {
    expect(getMoonLockShips(LIGHT_FIGHTER, factor)).toBe(fighters);
    expect(getMoonLockShips(PROBE, factor)).toBe(probes);
  });

  it('takes another threshold', () => {
    expect(getMoonLockShips(LIGHT_FIGHTER, 1, 4000)).toBe(1);
  });

  it('rejects a universe without debris', () => {
    expect(() => getMoonLockShips(LIGHT_FIGHTER, 0)).toThrow(/debrisFactor/);
  });

  it('rejects a unit that leaves no debris', () => {
    expect(() => getMoonLockShips({ cost: { metal: 0, crystal: 0 } }, 0.5)).toThrow(/debris/);
  });
});
