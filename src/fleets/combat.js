import DESTROYABLE, { ATTRIBUTES } from '../models/destroyable.js';
import getDebris from './getDebris.js';

const ROUNDS = 6;

/**
 * A unit with a rapid fire of 1250 legitimately chains hundreds of shots, but
 * the chain is unbounded in principle, so cap it rather than risk a hang.
 */
const MAX_SHOTS = 10000;

/** A shot weaker than this share of the target shield simply bounces off. */
const BOUNCE_RATIO = 0.01;

/** Below that share of its hull, a unit may explode at the end of the round. */
const EXPLOSION_THRESHOLD = 0.7;

/** Rapid-fire tables point at library ids, so we need the way back. */
const LIBRARY_ID = new Map(
  Object.entries(DESTROYABLE).map(([id, entry]) => [entry, Number(id)]),
);

/** Callers routinely spread a model entry, which loses object identity. */
const LIBRARY_ID_BY_OGAME_ID = new Map(
  Object.entries(DESTROYABLE).map(([id, entry]) => [entry.ogameId, Number(id)]),
);

function libraryIdOf(ship) {
  const id = LIBRARY_ID.get(ship) ?? LIBRARY_ID_BY_OGAME_ID.get(ship.ogameId);

  if (id === undefined) {
    // Without an id the rapid-fire tables, which point at ids, cannot resolve.
    throw new Error('every ship must come from models/destroyable.js, or at least carry its ogameId');
  }

  return id;
}

/**
 * A tiny deterministic PRNG (mulberry32), so a battle can be replayed.
 */
function createRandom(seed) {
  let state = seed >>> 0;

  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Two entries for the same ship would otherwise be counted twice. */
function mergeFleet(fleet, side) {
  if (!Array.isArray(fleet) || fleet.length === 0) {
    throw new Error(`${side} fleet must be a non empty array of { ship, count }`);
  }

  const merged = new Map();

  for (const { ship, count } of fleet) {
    if (!ship || !Array.isArray(ship.rapidFire)) {
      throw new Error(`${side} fleet must hold entries of models/destroyable.js`);
    }

    if (!Number.isInteger(count) || count < 0) {
      throw new Error(`${side} fleet counts must be integers >= 0, received ${count}`);
    }

    merged.set(ship, (merged.get(ship) ?? 0) + count);
  }

  return [...merged].map(([ship, count]) => ({ ship, count }));
}

/**
 * Turn a fleet into individual units with live hull and shield values. Hull
 * points are a tenth of the metal plus crystal cost.
 */
function deploy(fleet, techs) {
  const { weapons = 0, shielding = 0, armour = 0 } = techs;
  const units = [];

  for (const { ship, count } of fleet) {
    const maxHull = (ship.structure / 10) * (1 + 0.1 * armour);
    const maxShield = ship.shield * (1 + 0.1 * shielding);
    const attack = ship.attack * (1 + 0.1 * weapons);
    const libraryId = libraryIdOf(ship);

    for (let i = 0; i < count; i += 1) {
      units.push({
        ship, libraryId, maxHull, hull: maxHull, maxShield, shield: maxShield, attack,
      });
    }
  }

  return units;
}

function rapidFireAgainst(unit, target) {
  return unit.ship.rapidFire.find((entry) => entry.target === target.libraryId)?.fire ?? 1;
}

/**
 * One unit fires at a random enemy, then keeps firing while its rapid-fire
 * bonus rolls in its favour.
 */
function fire(unit, enemies, random) {
  for (let shots = 0; shots < MAX_SHOTS; shots += 1) {
    if (enemies.length === 0) {
      return;
    }

    const target = enemies[Math.floor(random() * enemies.length)];
    const damage = unit.attack;

    // A shot too weak to dent the shield bounces off without doing anything.
    if (damage >= target.shield * BOUNCE_RATIO) {
      if (damage <= target.shield) {
        target.shield -= damage;
      } else {
        target.hull -= damage - target.shield;
        target.shield = 0;
      }
    }

    const rapid = rapidFireAgainst(unit, target);

    // With a rapid fire of N, the unit shoots again with a (N - 1) / N chance.
    if (rapid <= 1 || random() >= (rapid - 1) / rapid) {
      return;
    }
  }
}

/**
 * Destroyed units are removed, damaged ones may explode, survivors get their
 * shield back for the next round.
 */
function endRound(units, random) {
  const survivors = [];

  for (const unit of units) {
    if (unit.hull <= 0) {
      continue;
    }

    const integrity = unit.hull / unit.maxHull;

    if (integrity < EXPLOSION_THRESHOLD && random() < 1 - integrity) {
      continue;
    }

    unit.shield = unit.maxShield;
    survivors.push(unit);
  }

  return survivors;
}

function summarise(units, initial) {
  const remaining = new Map();

  for (const unit of units) {
    remaining.set(unit.ship, (remaining.get(unit.ship) ?? 0) + 1);
  }

  const survivors = [];
  const losses = [];

  for (const { ship, count } of initial) {
    const left = remaining.get(ship) ?? 0;

    if (left > 0) {
      survivors.push({ ship, count: left });
    }

    if (count - left > 0) {
      losses.push({ ship, count: count - left });
    }
  }

  return { survivors, losses };
}

function debrisOf(losses, options) {
  const { debrisFactor, deuteriumDebrisFactor, defenseDebris } = options;

  return losses
    // On most universes only ships leave debris behind.
    .filter(({ ship }) => defenseDebris || ship.category === ATTRIBUTES.CATEGORIES.SHIPS)
    .map(({ ship, count }) => getDebris(ship, count, debrisFactor, deuteriumDebrisFactor))
    .reduce((total, debris) => ({
      metal: total.metal + debris.metal,
      crystal: total.crystal + debris.crystal,
      deuterium: total.deuterium + debris.deuterium,
    }), { metal: 0, crystal: 0, deuterium: 0 });
}

/**
 *
 * Simulate a battle between two fleets
 *
 * Follows the game rules: up to six rounds, every unit fires once per round at a
 * random enemy, rapid fire grants extra shots, shots below 1% of the target
 * shield bounce off, shields come back every round, and a unit under 70% hull
 * may explode at the end of the round.
 *
 * A battle is random, so one run is one possible outcome. The `seed` makes a run
 * reproducible; average several seeds to get a feel for the likely result.
 * @param {object} attacker The attacking side
 * @param {import('../types.js').FleetEntry[]} attacker.fleet Its ships
 * @param {import('../types.js').CombatTechs} [attacker.techs] Its combat technology levels
 * @param {object} defender The defending side, same shape, defenses included
 * @param {object} [options] Simulation options
 * @param {number} [options.seed] The PRNG seed, for a reproducible battle
 * @param {number} [options.debrisFactor] The universe debris factor
 * @param {number} [options.deuteriumDebrisFactor] The universe deuterium debris factor
 * @param {boolean} [options.defenseDebris] Whether destroyed defenses leave debris
 * @returns {{
 *   winner: 'attacker'|'defender'|'draw', rounds: number, seed: number,
 *   attacker: {survivors: import('../types.js').FleetEntry[], losses: import('../types.js').FleetEntry[]},
 *   defender: {survivors: import('../types.js').FleetEntry[], losses: import('../types.js').FleetEntry[]},
 *   debris: import('../types.js').Resources,
 * }} Who won, how long it took, what is left on each side, and the debris field
 */
function simulateCombat(attacker, defender, options = {}) {
  const {
    seed = Date.now(),
    debrisFactor = 0.3,
    deuteriumDebrisFactor = 0,
    defenseDebris = false,
  } = options;

  const random = createRandom(seed);
  const attackerFleet = mergeFleet(attacker.fleet, 'attacker');
  const defenderFleet = mergeFleet(defender.fleet, 'defender');

  let attackers = deploy(attackerFleet, attacker.techs ?? {});
  let defenders = deploy(defenderFleet, defender.techs ?? {});

  let rounds = 0;

  while (rounds < ROUNDS && attackers.length > 0 && defenders.length > 0) {
    rounds += 1;

    // Both sides shoot with the units they started the round with.
    const shootingAttackers = [...attackers];
    const shootingDefenders = [...defenders];

    for (const unit of shootingAttackers) {
      fire(unit, defenders, random);
    }

    for (const unit of shootingDefenders) {
      fire(unit, attackers, random);
    }

    attackers = endRound(attackers, random);
    defenders = endRound(defenders, random);
  }

  const attackerResult = summarise(attackers, attackerFleet);
  const defenderResult = summarise(defenders, defenderFleet);

  let winner = 'draw';

  if (attackers.length > 0 && defenders.length === 0) {
    winner = 'attacker';
  } else if (defenders.length > 0 && attackers.length === 0) {
    winner = 'defender';
  }

  return {
    winner,
    rounds,
    seed,
    attacker: attackerResult,
    defender: defenderResult,
    debris: debrisOf([...attackerResult.losses, ...defenderResult.losses], {
      debrisFactor,
      deuteriumDebrisFactor,
      defenseDebris,
    }),
  };
}

export { createRandom, ROUNDS };
export default simulateCombat;
