import simulateCombat from './combat.js';
import { getCombatStatistics, simulateCombats } from './combatStatistics.js';
import DESTROYABLE from '../models/destroyable.js';

const fighters = (count) => [{ ship: DESTROYABLE[1], count }];
const launchers = (count) => [{ ship: DESTROYABLE[201], count }];

describe('Combat statistics should', () => {
  it('Give the share of battles each side won', () => {
    const run = (winner) => ({
      ...simulateCombat({ fleet: fighters(1) }, { fleet: fighters(1) }, { seed: 1 }),
      winner,
    });
    const stats = getCombatStatistics([run('attacker'), run('attacker'), run('defender'), run('draw')]);

    expect(stats.runs).toBe(4);
    expect(stats.outcomes).toEqual({ attacker: 0.5, defender: 0.25, draw: 0.25 });
  });

  it('Average the losses, which need not be whole numbers', () => {
    const results = [1, 2, 3, 4].map((seed) => simulateCombat(
      { fleet: fighters(60) },
      { fleet: launchers(40) },
      { seed },
    ));
    const lost = results.map((result) => result.attacker.losses[0]?.count ?? 0);
    const stats = getCombatStatistics(results);

    expect(stats.attacker.losses[0].count).toBeCloseTo(lost.reduce((a, b) => a + b, 0) / 4);
  });

  it('Price what is lost for good, rebuilt defenses excluded', () => {
    const stats = simulateCombats(
      { fleet: [{ ship: DESTROYABLE[8], count: 20 }] },
      { fleet: launchers(1000) },
      { runs: 5, seed: 9 },
    );
    const gone = 1000 - stats.defender.rebuilt[0].count;

    expect(stats.outcomes.attacker).toBe(1);
    expect(stats.attacker.lostResources).toEqual({ metal: 0, crystal: 0, deuterium: 0 });
    expect(stats.defender.lostResources.metal).toBeCloseTo(gone * 2000);
    expect(stats.defender.lostResources.crystal).toBe(0);
  });

  it('Average the debris, the moon chance and the plunder', () => {
    const stats = simulateCombats(
      { fleet: [{ ship: DESTROYABLE[8], count: 1 }] },
      { fleet: fighters(100) },
      { runs: 3, seed: 2, plunder: { resources: { metal: 1000, crystal: 0, deuterium: 0 } } },
    );

    expect(stats.debris).toEqual({ metal: 90000, crystal: 30000, deuterium: 0 });
    expect(stats.moonChance).toBe(1);
    expect(stats.plunder).toEqual({ metal: 500, crystal: 0, deuterium: 0 });
  });

  it('Be reproducible for a given seed', () => {
    const run = () => simulateCombats(
      { fleet: fighters(100) },
      { fleet: launchers(80) },
      { runs: 10, seed: 5 },
    );

    expect(run()).toEqual(run());
  });

  it('Merge copies of the same model entry', () => {
    const copy = { ...DESTROYABLE[1] };
    const results = [
      simulateCombat({ fleet: [{ ship: DESTROYABLE[1], count: 5 }] }, { fleet: launchers(500) }, { seed: 1 }),
      simulateCombat({ fleet: [{ ship: copy, count: 5 }] }, { fleet: launchers(500) }, { seed: 1 }),
    ];

    expect(getCombatStatistics(results).attacker.losses).toHaveLength(1);
  });
});

describe('Combat statistics should throw when', () => {
  it('There is nothing to average', () => {
    expect(() => getCombatStatistics([])).toThrow('results must be a non empty array');
  });

  it('The number of runs is not a positive integer', () => {
    expect(() => simulateCombats({ fleet: fighters(1) }, { fleet: fighters(1) }, { runs: 0 }))
      .toThrow('runs must be an integer >= 1');
  });
});
