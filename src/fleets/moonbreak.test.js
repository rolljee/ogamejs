import {
  getWaveChance,
  getMoonbreakWaves,
  getMoonbreakChance,
  getMoonbreakLosses,
} from './moonbreak.js';

const round2 = (n) => Math.round(n * 100) / 100;

describe('getMoonbreakWaves', () => {
  it('spreads a multiple of 6 evenly', () => {
    expect(getMoonbreakWaves(60)).toEqual([10, 10, 10, 10, 10, 10]);
  });

  it('puts the extra ships in the first waves', () => {
    expect(getMoonbreakWaves(100)).toEqual([17, 17, 17, 17, 16, 16]);
  });

  it('sends empty waves under 6 Deathstars', () => {
    expect(getMoonbreakWaves(4)).toEqual([1, 1, 1, 1, 0, 0]);
  });
});

describe('getWaveChance', () => {
  it('follows the official formula', () => {
    expect(getWaveChance(8944, 100)).toBeCloseTo(0.5427, 4);
  });

  it('never goes past certain destruction', () => {
    expect(getWaveChance(3464, 200)).toBe(1);
  });

  it('cannot break a moon without a ship', () => {
    expect(getWaveChance(8944, 0)).toBe(0);
  });
});

// Reference values shared with og-bot-discord (`!mb`) and ogame-ui, rounded
// to 2 decimals the way both display them.
describe.each([
  [8944, [100], 77.75, 27.78, [23.45, 32.11]],
  [8944, [100, 80], 94.09, 33.01, [28.15, 37.86]],
  [3464, [200], 100, 10.01, [7.35, 12.66]],
  [5000, [5], 82.32, 0.99, [0.13, 1.86]],
  [8944, [1, 100], 78.96, 26.74, [22.45, 31.04]],
  [8944, [600], 99.09, 86.33, [78.71, 93.95]],
])('a %i km moon against %j', (moonSize, fleets, chance, mean, band68) => {
  it('gives the reference chance', () => {
    expect(round2(getMoonbreakChance(moonSize, fleets) * 100)).toBe(chance);
  });

  it('gives the reference losses', () => {
    const losses = getMoonbreakLosses(moonSize, fleets);
    expect(round2(losses.mean)).toBe(mean);
    expect([round2(losses.bands[0].min), round2(losses.bands[0].max)]).toEqual(band68);
  });
});

describe('getMoonbreakChance', () => {
  it('rises with a second attacker', () => {
    expect(getMoonbreakChance(8944, [100, 80])).toBeGreaterThan(getMoonbreakChance(8944, [100]));
  });

  it('is lower on a bigger moon', () => {
    expect(getMoonbreakChance(8944, [50])).toBeLessThan(getMoonbreakChance(5000, [50]));
  });

  it('rejects a moon outside the game range', () => {
    expect(() => getMoonbreakChance(3000, [10])).toThrow(/moonSize/);
    expect(() => getMoonbreakChance(9000, [10])).toThrow(/moonSize/);
  });

  it('rejects a missing or invalid fleet', () => {
    expect(() => getMoonbreakChance(8944, [])).toThrow(/fleets/);
    expect(() => getMoonbreakChance(8944, [1.5])).toThrow(/fleet/);
    expect(() => getMoonbreakChance(8944, [-1])).toThrow(/fleet/);
  });
});

describe('getMoonbreakLosses', () => {
  it('keeps every band inside the fleet', () => {
    for (const { min, max } of getMoonbreakLosses(3464, [6]).bands) {
      expect(min).toBeGreaterThanOrEqual(0);
      expect(max).toBeLessThanOrEqual(6);
    }
  });

  it('widens the band as the confidence grows', () => {
    const [b68, b95, b99] = getMoonbreakLosses(8944, [100]).bands;
    expect(b95.max - b95.min).toBeGreaterThan(b68.max - b68.min);
    expect(b99.max - b99.min).toBeGreaterThan(b95.max - b95.min);
  });

  it('tells a lopsided attack from an even one', () => {
    const lopsided = getMoonbreakLosses(8944, [1, 100]).mean;
    const even = getMoonbreakLosses(8944, [50, 51]).mean;
    expect(lopsided).not.toBeCloseTo(even, 2);
  });
});
