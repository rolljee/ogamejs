import simulateCombat from './combat.js';
import DESTROYABLE from '../models/destroyable.js';

const fighters = (count) => [{ ship: DESTROYABLE[1], count }];

describe('A battle should', () => {
  it('Be reproducible for a given seed', () => {
    const battle = () => simulateCombat(
      { fleet: fighters(500), techs: { weapons: 10, shielding: 10, armour: 10 } },
      { fleet: [{ ship: DESTROYABLE[201], count: 100 }], techs: { weapons: 8 } },
      { seed: 42 },
    );

    expect(battle()).toEqual(battle());
  });

  it('Give different outcomes for different seeds', () => {
    const run = (seed) => simulateCombat(
      { fleet: fighters(60) },
      { fleet: [{ ship: DESTROYABLE[201], count: 40 }] },
      { seed },
    );

    const losses = [1, 2, 3, 4, 5].map((seed) => run(seed).attacker.losses[0]?.count ?? 0);

    expect(new Set(losses).size).toBeGreaterThan(1);
  });

  it('Be won by an overwhelming attacker', () => {
    const result = simulateCombat(
      { fleet: [{ ship: DESTROYABLE[8], count: 10 }] },
      { fleet: fighters(50) },
      { seed: 7 },
    );

    expect(result.winner).toBe('attacker');
    expect(result.defender.survivors).toEqual([]);
    expect(result.attacker.losses).toEqual([]);
  });

  it('Be won by an overwhelming defender', () => {
    const result = simulateCombat(
      { fleet: fighters(1) },
      { fleet: [{ ship: DESTROYABLE[8], count: 5 }] },
      { seed: 7 },
    );

    expect(result.winner).toBe('defender');
  });

  it('Never run for more than six rounds', () => {
    const result = simulateCombat(
      { fleet: [{ ship: DESTROYABLE[8], count: 20 }] },
      { fleet: [{ ship: DESTROYABLE[8], count: 20 }] },
      { seed: 3 },
    );

    expect(result.rounds).toBeLessThanOrEqual(6);
  });

  it('Bounce shots that are too weak to dent the shield', () => {
    // A light fighter hits for 50, which is under 1% of the 10.000 shield of a
    // large shield dome; the dome hits back for 1, which the fighter shield
    // soaks up. Neither side can hurt the other.
    const result = simulateCombat(
      { fleet: fighters(100) },
      { fleet: [{ ship: DESTROYABLE[208], count: 1 }] },
      { seed: 3 },
    );

    expect(result.rounds).toBe(6);
    expect(result.winner).toBe('draw');
    expect(result.attacker.losses).toEqual([]);
    expect(result.defender.losses).toEqual([]);
  });

  it('Report the seed it ran with', () => {
    expect(simulateCombat(
      { fleet: fighters(10) },
      { fleet: fighters(10) },
      { seed: 99 },
    ).seed).toBe(99);
  });
});

describe('Technologies should matter, so that', () => {
  const run = (techs, seed) => simulateCombat(
    { fleet: fighters(100), techs },
    { fleet: [{ ship: DESTROYABLE[204], count: 5 }] },
    { seed },
  );

  it('A better armed attacker loses fewer ships on average', () => {
    const average = (techs) => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      .map((seed) => run(techs, seed).attacker.losses[0]?.count ?? 0)
      .reduce((total, value) => total + value, 0) / 10;

    expect(average({ weapons: 16, shielding: 16, armour: 16 }))
      .toBeLessThan(average({ weapons: 0, shielding: 0, armour: 0 }));
  });
});

describe('A spread model entry should still work, because', () => {
  it('The ship is matched back by its ogameId', () => {
    const copy = { ...DESTROYABLE[1] };
    const options = { seed: 21 };
    const defender = { fleet: [{ ship: DESTROYABLE[201], count: 30 }] };

    expect(simulateCombat({ fleet: [{ ship: copy, count: 80 }] }, defender, options).winner)
      .toBe(simulateCombat({ fleet: fighters(80) }, defender, options).winner);
  });
});

describe('Battle debris should', () => {
  it('Come from the destroyed ships of both sides', () => {
    const result = simulateCombat(
      { fleet: fighters(200) },
      { fleet: fighters(200) },
      { seed: 11, debrisFactor: 0.3 },
    );

    const lost = (side) => side.losses[0]?.count ?? 0;
    const total = lost(result.attacker) + lost(result.defender);

    expect(result.debris.metal).toBe(total * 3000 * 0.3);
    expect(result.debris.crystal).toBe(total * 1000 * 0.3);
    expect(result.debris.deuterium).toBe(0);
  });

  it('Leave defenses out unless the universe says otherwise', () => {
    const options = { seed: 5, debrisFactor: 0.3 };
    const attacker = { fleet: [{ ship: DESTROYABLE[8], count: 5 }] };
    const defender = { fleet: [{ ship: DESTROYABLE[201], count: 50 }] };

    const without = simulateCombat(attacker, defender, options);
    const with_ = simulateCombat(attacker, defender, { ...options, defenseDebris: true });

    expect(without.debris.metal).toBe(0);
    expect(with_.debris.metal).toBeGreaterThan(0);
  });

  it('Include deuterium when the universe has a deuterium debris factor', () => {
    const result = simulateCombat(
      { fleet: [{ ship: DESTROYABLE[3], count: 50 }] },
      { fleet: [{ ship: DESTROYABLE[3], count: 50 }] },
      { seed: 13, debrisFactor: 0.3, deuteriumDebrisFactor: 0.3 },
    );

    expect(result.debris.deuterium).toBeGreaterThan(0);
  });
});

describe('Combat simulation should throw when', () => {
  it('A fleet is empty', () => {
    expect(() => simulateCombat({ fleet: [] }, { fleet: fighters(1) }))
      .toThrow('attacker fleet must be a non empty array');
  });

  it('A fleet holds something that is not a model entry', () => {
    expect(() => simulateCombat({ fleet: fighters(1) }, { fleet: [{ ship: {}, count: 1 }] }))
      .toThrow('defender fleet must hold entries of models/destroyable.js');
  });

  it('A ship carries no id the rapid-fire tables can resolve', () => {
    const anonymous = { ...DESTROYABLE[1], ogameId: undefined };

    expect(() => simulateCombat({ fleet: [{ ship: anonymous, count: 1 }] }, { fleet: fighters(1) }))
      .toThrow('or at least carry its ogameId');
  });

  it('A count is not an integer', () => {
    expect(() => simulateCombat({ fleet: [{ ship: DESTROYABLE[1], count: 1.5 }] }, { fleet: fighters(1) }))
      .toThrow('attacker fleet counts must be integers >= 0');
  });
});
