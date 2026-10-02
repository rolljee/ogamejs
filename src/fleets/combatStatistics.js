import simulateCombat from './combat.js';

/** Enough runs for the averages to settle, without making a big battle wait. */
const DEFAULT_RUNS = 100;

const NO_RESOURCES = Object.freeze({ metal: 0, crystal: 0, deuterium: 0 });

function addResources(total, resources) {
  return {
    metal: total.metal + resources.metal,
    crystal: total.crystal + resources.crystal,
    deuterium: total.deuterium + resources.deuterium,
  };
}

function scaleResources(resources, factor) {
  return {
    metal: resources.metal * factor,
    crystal: resources.crystal * factor,
    deuterium: resources.deuterium * factor,
  };
}

function costOf(fleet) {
  return fleet
    .map(({ ship, count }) => ({
      metal: (ship.cost.metal ?? 0) * count,
      crystal: (ship.cost.crystal ?? 0) * count,
      deuterium: (ship.cost.deuterium ?? ship.cost.deut ?? 0) * count,
    }))
    .reduce(addResources, NO_RESOURCES);
}

/** Two copies of the same model entry are the same ship. */
function keyOf(ship) {
  return ship.ogameId ?? ship;
}

/** Sum the counts of every run, keeping the order ships first appear in. */
function addFleets(totals, fleet) {
  for (const { ship, count } of fleet) {
    const key = keyOf(ship);
    const entry = totals.get(key);

    if (entry) {
      entry.count += count;
    } else {
      totals.set(key, { ship, count });
    }
  }
}

function averageFleet(totals, runs) {
  return [...totals.values()].map(({ ship, count }) => ({ ship, count: count / runs }));
}

/**
 * Take back what was rebuilt from what was lost, ship by ship.
 * @param {import('../types.js').FleetEntry[]} losses What was destroyed
 * @param {import('../types.js').FleetEntry[]} rebuilt What came back
 * @returns {import('../types.js').FleetEntry[]} What is gone for good
 */
function subtractFleet(losses, rebuilt) {
  return losses
    .map(({ ship, count }) => ({
      ship,
      count: count - (rebuilt.find((entry) => keyOf(entry.ship) === keyOf(ship))?.count ?? 0),
    }))
    .filter(({ count }) => count > 0);
}

/**
 *
 * Average a set of simulated battles
 *
 * Counts are averages, so they are not whole numbers. `lostResources` is what
 * the units lost for good would cost to build again: every loss for the
 * attacker, the defender's losses minus its rebuilt defenses.
 * @param {import('./combat.js').CombatResult[]} results Battles from `simulateCombat`
 * @returns {{
 *   runs: number,
 *   outcomes: {attacker: number, defender: number, draw: number},
 *   rounds: number,
 *   attacker: {
 *     survivors: import('../types.js').FleetEntry[], losses: import('../types.js').FleetEntry[],
 *     lostResources: import('../types.js').Resources,
 *   },
 *   defender: {
 *     survivors: import('../types.js').FleetEntry[], losses: import('../types.js').FleetEntry[],
 *     rebuilt: import('../types.js').FleetEntry[], lostResources: import('../types.js').Resources,
 *   },
 *   debris: import('../types.js').Resources,
 *   moonChance: number,
 *   plunder: import('../types.js').Resources,
 * }} The share of battles each side won (from 0 to 1), and the average of everything else
 */
function getCombatStatistics(results) {
  if (!Array.isArray(results) || results.length === 0) {
    throw new Error('results must be a non empty array of simulateCombat results');
  }

  const runs = results.length;
  const outcomes = { attacker: 0, defender: 0, draw: 0 };
  const fleets = {
    attackerSurvivors: new Map(),
    attackerLosses: new Map(),
    defenderSurvivors: new Map(),
    defenderLosses: new Map(),
    defenderRebuilt: new Map(),
  };
  let rounds = 0;
  let moonChance = 0;
  let debris = NO_RESOURCES;
  let plunder = NO_RESOURCES;
  let attackerLost = NO_RESOURCES;
  let defenderLost = NO_RESOURCES;

  for (const result of results) {
    outcomes[result.winner] += 1;
    rounds += result.rounds;
    moonChance += result.moonChance;
    debris = addResources(debris, result.debris);
    plunder = addResources(plunder, result.plunder);
    attackerLost = addResources(attackerLost, costOf(result.attacker.losses));
    defenderLost = addResources(
      defenderLost,
      costOf(subtractFleet(result.defender.losses, result.defender.rebuilt)),
    );

    addFleets(fleets.attackerSurvivors, result.attacker.survivors);
    addFleets(fleets.attackerLosses, result.attacker.losses);
    addFleets(fleets.defenderSurvivors, result.defender.survivors);
    addFleets(fleets.defenderLosses, result.defender.losses);
    addFleets(fleets.defenderRebuilt, result.defender.rebuilt);
  }

  return {
    runs,
    outcomes: {
      attacker: outcomes.attacker / runs,
      defender: outcomes.defender / runs,
      draw: outcomes.draw / runs,
    },
    rounds: rounds / runs,
    attacker: {
      survivors: averageFleet(fleets.attackerSurvivors, runs),
      losses: averageFleet(fleets.attackerLosses, runs),
      lostResources: scaleResources(attackerLost, 1 / runs),
    },
    defender: {
      survivors: averageFleet(fleets.defenderSurvivors, runs),
      losses: averageFleet(fleets.defenderLosses, runs),
      rebuilt: averageFleet(fleets.defenderRebuilt, runs),
      lostResources: scaleResources(defenderLost, 1 / runs),
    },
    debris: scaleResources(debris, 1 / runs),
    moonChance: moonChance / runs,
    plunder: scaleResources(plunder, 1 / runs),
  };
}

/**
 *
 * Simulate the same battle many times and average the outcomes
 *
 * Run `i` uses the seed `seed + i`, so the whole set is reproducible.
 * @param {Parameters<typeof simulateCombat>[0]} attacker The attacking side, as for `simulateCombat`
 * @param {Parameters<typeof simulateCombat>[1]} defender The defending side, as for `simulateCombat`
 * @param {Parameters<typeof simulateCombat>[2] & {runs?: number}} [options] The `simulateCombat`
 *   options, plus `runs`, how many battles to simulate (100 by default)
 * @returns {ReturnType<typeof getCombatStatistics>} The averaged outcome, see `getCombatStatistics`
 */
function simulateCombats(attacker, defender, options = {}) {
  const { runs = DEFAULT_RUNS, seed = Date.now(), ...rest } = options;

  if (!Number.isInteger(runs) || runs < 1) {
    throw new Error(`runs must be an integer >= 1, received ${runs}`);
  }

  const results = [];

  for (let i = 0; i < runs; i += 1) {
    results.push(simulateCombat(attacker, defender, { ...rest, seed: seed + i }));
  }

  return getCombatStatistics(results);
}

export { getCombatStatistics, simulateCombats, DEFAULT_RUNS };
