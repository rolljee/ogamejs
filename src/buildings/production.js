import getMetalMine from './metal.js';
import getCrystalMine from './crystal.js';
import getDeutSynth from './deut.js';
import BUILDINGS from '../models/buildings.js';

/**
 * Plasma technology is worth more on metal than on crystal, and more on crystal
 * than on deuterium.
 */
const PLASMA_BONUS = Object.freeze({ metal: 0.01, crystal: 0.0066, deuterium: 0.0033 });

/** The geologist officer adds a flat 10% to the three mines. */
const GEOLOGIST_BONUS = 0.1;

/** The collector class adds 25% to mine production. */
const COLLECTOR_BONUS = 0.25;

/**
 * Every planet produces this much per hour on its own, mines or not. It is a
 * flat income: no bonus applies to it.
 */
const BASE_INCOME = Object.freeze({ metal: 30, crystal: 15, deuterium: 0 });

const RESOURCES = Object.freeze(['metal', 'crystal', 'deuterium']);

function clampRatio(value, name) {
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new Error(`${name} must be a number between 0 and 1, received ${value}`);
  }

  return value;
}

/**
 *
 * Return the production multiplier of each resource
 *
 * The multipliers add up, they are not compounded: plasma 15, a geologist and
 * the collector class give 1 + 0.15 + 0.1 + 0.25 on metal.
 * @param {object} [options] The bonuses that apply
 * @param {number} [options.plasmaTech] The Plasma Technology level
 * @param {boolean} [options.geologist] Whether the geologist officer is hired
 * @param {boolean} [options.collectorClass] Whether the player plays collector
 * @param {object} [options.items] Booster items in place, as fractions per
 *   resource — a 30% metal booster is `{ metal: 0.3 }`
 * @returns {import('../types.js').Resources} One multiplier per resource
 */
function getProductionBonus(options = {}) {
  const {
    plasmaTech = 0,
    geologist = false,
    collectorClass = false,
    items = {},
  } = options;

  if (!Number.isInteger(plasmaTech) || plasmaTech < 0) {
    throw new Error(`plasmaTech must be an integer >= 0, received ${plasmaTech}`);
  }

  const flat = (geologist ? GEOLOGIST_BONUS : 0) + (collectorClass ? COLLECTOR_BONUS : 0);

  return Object.fromEntries(RESOURCES.map((resource) => {
    /* eslint-disable security/detect-object-injection -- resource comes from RESOURCES */
    const item = clampRatio(items[resource] ?? 0, `items.${resource}`);

    return [resource, 1 + PLASMA_BONUS[resource] * plasmaTech + flat + item];
    /* eslint-enable security/detect-object-injection */
  }));
}

/**
 *
 * Return the hourly production of a whole planet, bonuses included
 *
 * Mine levels, planet position and temperature give the raw mine output; the
 * plasma, officer, class and item bonuses are then applied, and the flat planet
 * income is added on top.
 * @param {object} planet The planet description
 * @param {number} planet.metalMine The metal mine level
 * @param {number} planet.crystalMine The crystal mine level
 * @param {number} planet.deutSynth The deuterium synthesizer level
 * @param {number} planet.position The planet position, 1 to 3 produce more crystal
 * @param {number} planet.temperature The planet average temperature
 * @param {number} [planet.universeSpeed] The universe economy speed
 * @param {number} [planet.energyEfficiency] The share of the required energy that
 *   is actually available, between 0 and 1 — mines run at that rate when the
 *   planet is in an energy deficit
 * @param {object} [bonuses] Passed straight to `getProductionBonus`
 * @returns {import('../types.js').Resources & {energyConsumption: number, bonus: import('../types.js').Resources}}
 *   The hourly production, what it costs in energy, and the multipliers used
 */
function getPlanetProduction(planet, bonuses = {}) {
  const {
    metalMine,
    crystalMine,
    deutSynth,
    position,
    temperature,
    universeSpeed = 1,
    energyEfficiency = 1,
  } = planet;

  clampRatio(energyEfficiency, 'energyEfficiency');

  for (const [name, level] of Object.entries({ metalMine, crystalMine, deutSynth })) {
    if (!Number.isInteger(level) || level < 0) {
      throw new Error(`${name} must be an integer >= 0, received ${level}`);
    }
  }

  // A mine that is not built yet neither produces nor consumes anything, and
  // has no level 0 cost to speak of.
  const idle = { production: 0, energyConsumption: 0 };
  const mines = {
    metal: metalMine > 0 ? getMetalMine(BUILDINGS[1], metalMine, universeSpeed) : idle,
    crystal: crystalMine > 0
      ? getCrystalMine(BUILDINGS[2], crystalMine, position, universeSpeed)
      : idle,
    deuterium: deutSynth > 0
      ? getDeutSynth(BUILDINGS[3], deutSynth, temperature, universeSpeed)
      : idle,
  };

  const bonus = getProductionBonus(bonuses);

  const production = Object.fromEntries(RESOURCES.map((resource) => {
    /* eslint-disable security/detect-object-injection -- resource comes from RESOURCES */
    const mined = mines[resource].production * bonus[resource] * energyEfficiency;

    return [resource, Math.floor(mined) + BASE_INCOME[resource] * universeSpeed];
    /* eslint-enable security/detect-object-injection */
  }));

  return {
    ...production,
    energyConsumption: RESOURCES
      // eslint-disable-next-line security/detect-object-injection
      .reduce((total, resource) => total + mines[resource].energyConsumption, 0),
    bonus,
  };
}

export {
  getProductionBonus,
  PLASMA_BONUS,
  GEOLOGIST_BONUS,
  COLLECTOR_BONUS,
  BASE_INCOME,
};
export default getPlanetProduction;
