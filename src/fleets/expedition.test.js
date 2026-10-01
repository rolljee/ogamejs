import {
  getExpeditionFindBase,
  getExpeditionMaxFind,
  getCargoCapacity,
} from './expedition.js';
import DESTROYABLE from '../models/destroyable.js';

const LARGE_CARGO = DESTROYABLE[12];
const SMALL_CARGO = DESTROYABLE[11];

describe('getExpeditionFindBase', () => {
  it.each([
    [0, 40000],
    [9999, 40000],
    [10000, 500000],
    [999999, 1200000],
    [4999999, 1800000],
    [24999999, 2400000],
    [49999999, 3000000],
    [74999999, 3600000],
    [99999999, 4200000],
    [100000000, 5000000],
    [1992728145379.1, 5000000],
  ])('a top score of %d gives %d', (topScore, base) => {
    expect(getExpeditionFindBase(topScore)).toBe(base);
  });

  it('rejects an unusable score', () => {
    expect(() => getExpeditionFindBase(Number.NaN)).toThrow(/topScore/);
  });
});

describe('getExpeditionMaxFind', () => {
  const universe = { topScore: 2e9, economySpeed: 10 };

  // The value og-bot-discord (`!oge`) and ogame-ui have always shown: a
  // Discoverer with a Pathfinder, no lifeform bonus.
  it('matches the historic Discoverer + Pathfinder figure', () => {
    expect(getExpeditionMaxFind({ ...universe, explorer: true, pathfinder: true })).toBe(150000000);
    expect(getExpeditionMaxFind({ topScore: 5e5, economySpeed: 8, explorer: true, pathfinder: true })).toBe(28800000);
  });

  it('does not scale with the economy speed for other classes', () => {
    expect(getExpeditionMaxFind({ ...universe, pathfinder: true })).toBe(10000000);
    expect(getExpeditionMaxFind({ ...universe })).toBe(5000000);
  });

  it('doubles with a Pathfinder', () => {
    const without = getExpeditionMaxFind({ ...universe, explorer: true });
    expect(getExpeditionMaxFind({ ...universe, explorer: true, pathfinder: true })).toBe(without * 2);
  });

  it('reads the class bonus from the universe', () => {
    expect(getExpeditionMaxFind({ ...universe, explorer: true, explorerBonus: 1 })).toBe(5000000 * 2 * 10);
  });

  it('amplifies the Discoverer class bonus with the lifeform enhancement', () => {
    // 1 + 0.5 * 1.2 = 1.6
    expect(getExpeditionMaxFind({ ...universe, explorer: true, lifeformExplorerBonus: 0.2 }))
      .toBeCloseTo(5000000 * 1.6 * 10, 6);
  });

  it('ignores the Discoverer enhancement for another class', () => {
    expect(getExpeditionMaxFind({ ...universe, lifeformExplorerBonus: 0.2 })).toBe(5000000);
  });

  it('applies the lifeform resource bonus to every class', () => {
    expect(getExpeditionMaxFind({ ...universe, lifeformResourceBonus: 0.1 })).toBeCloseTo(5500000, 6);
    expect(getExpeditionMaxFind({ ...universe, explorer: true, pathfinder: true, lifeformResourceBonus: 0.1 }))
      .toBeCloseTo(165000000, 6);
  });

  it('rejects unusable inputs', () => {
    expect(() => getExpeditionMaxFind({ topScore: 1, economySpeed: 0 })).toThrow(/economySpeed/);
    expect(() => getExpeditionMaxFind({ ...universe, lifeformResourceBonus: -0.1 })).toThrow(/lifeformResourceBonus/);
  });
});

describe('getCargoCapacity', () => {
  it('is the base cargo without any bonus', () => {
    expect(getCargoCapacity(LARGE_CARGO)).toBe(25000);
  });

  it('adds 5 % of the base per Hyperspace level by default', () => {
    expect(getCargoCapacity(LARGE_CARGO, { hyperspaceLevel: 20 })).toBe(50000);
  });

  it('follows the universe hyperspace multiplier', () => {
    expect(getCargoCapacity(SMALL_CARGO, { hyperspaceLevel: 10, hyperspaceMultiplier: 2 })).toBe(6000);
  });

  it('adds the other bonuses to the hyperspace one', () => {
    // Collector 25 % + lifeform 10 % + Hyperspace 20 x 5 %
    expect(getCargoCapacity(LARGE_CARGO, { hyperspaceLevel: 20, bonus: 0.35 })).toBeCloseTo(58750, 6);
  });

  it('rejects an invalid level', () => {
    expect(() => getCargoCapacity(LARGE_CARGO, { hyperspaceLevel: -1 })).toThrow(/hyperspaceLevel/);
  });
});
