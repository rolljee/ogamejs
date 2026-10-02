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

describe('Explosions should', () => {
  it('Be rolled on every hit, not once at the end of the round', () => {
    // Two battleships fire 1000 at a cruiser (2700 hull, 50 shield). The first
    // hit leaves it at 65% (35% to explode), the second at 28% (72%). Rolled on
    // each hit it blows up in round one 82% of the time, rolled once at the
    // end of the round only 72% of the time.
    const runs = 2000;
    let exploded = 0;

    for (let seed = 1; seed <= runs; seed += 1) {
      const result = simulateCombat(
        { fleet: [{ ship: DESTROYABLE[4], count: 2 }] },
        { fleet: [{ ship: DESTROYABLE[3], count: 1 }] },
        { seed },
      );

      if (result.rounds === 1 && result.winner === 'attacker') {
        exploded += 1;
      }
    }

    expect(exploded / runs).toBeGreaterThan(0.78);
    expect(exploded / runs).toBeLessThan(0.86);
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

describe('After the battle', () => {
  const crushing = { fleet: [{ ship: DESTROYABLE[8], count: 20 }] };
  const launchers = { fleet: [{ ship: DESTROYABLE[201], count: 1000 }] };

  it('About 70% of the destroyed defenses come back', () => {
    const result = simulateCombat(crushing, launchers, { seed: 4 });

    expect(result.defender.losses).toEqual([{ ship: DESTROYABLE[201], count: 1000 }]);
    expect(result.defender.rebuilt[0].count).toBeGreaterThan(650);
    expect(result.defender.rebuilt[0].count).toBeLessThan(750);
  });

  it('Destroyed ships never come back', () => {
    const result = simulateCombat(crushing, { fleet: fighters(100) }, { seed: 4 });

    expect(result.defender.rebuilt).toEqual([]);
  });

  it('The universe repair factor is honoured', () => {
    expect(simulateCombat(crushing, launchers, { seed: 4, repairFactor: 0 }).defender.rebuilt).toEqual([]);
    expect(simulateCombat(crushing, launchers, { seed: 4, repairFactor: 1 }).defender.rebuilt)
      .toEqual([{ ship: DESTROYABLE[201], count: 1000 }]);
  });

  it('Defenses leave debris at the defense debris factor', () => {
    const result = simulateCombat(crushing, launchers, { seed: 4, defenseDebrisFactor: 0.1 });

    expect(result.debris.metal).toBeCloseTo(1000 * 2000 * 0.1);
  });

  it('The moon chance grows by 1% per 100 000 debris, up to 20%', () => {
    // 100 light fighters leave 120 000 debris at 30%, 1 000 leave 1 200 000.
    const chance = (count) => simulateCombat(
      crushing,
      { fleet: fighters(count) },
      { seed: 4, debrisFactor: 0.3 },
    ).moonChance;

    expect(chance(100)).toBe(1);
    expect(chance(1000)).toBe(12);
    expect(chance(5000)).toBe(20);
  });

  it('A winning attacker loads half the resources if it has the room', () => {
    const result = simulateCombat(crushing, { fleet: fighters(10) }, {
      seed: 4,
      plunder: { resources: { metal: 200000, crystal: 100000, deuterium: 50000 } },
    });

    expect(result.plunder).toEqual({ metal: 100000, crystal: 50000, deuterium: 25000 });
  });

  it('The loot is capped by the cargo of the surviving ships, hyperspace included', () => {
    // A deathstar holds 1 000 000, plus 5% per Hyperspace level: 1 500 000 at level 10.
    const result = simulateCombat(
      { fleet: [{ ship: DESTROYABLE[8], count: 1 }] },
      { fleet: fighters(1) },
      { seed: 4, plunder: { resources: { metal: 3000000, crystal: 3000000, deuterium: 0 }, hyperspaceLevel: 10 } },
    );

    // Out of 3 000 000 up for grabs, spread like the resources on the planet.
    expect(result.plunder).toEqual({ metal: 750000, crystal: 750000, deuterium: 0 });
  });

  it('Nothing is plundered unless the attacker wins', () => {
    const result = simulateCombat({ fleet: fighters(1) }, crushing, {
      seed: 4,
      plunder: { resources: { metal: 1000, crystal: 1000, deuterium: 1000 } },
    });

    expect(result.plunder).toEqual({ metal: 0, crystal: 0, deuterium: 0 });
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
