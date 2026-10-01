/**
 * The maximum metal an expedition can find, tiered by the score of the
 * universe's top player. `below` is an exclusive upper bound; above the last
 * tier every universe shares `EXPEDITION_TOP_TIER_BASE`.
 */
const EXPEDITION_FIND_TIERS = Object.freeze([
  Object.freeze({ below: 1e4, base: 40000 }),
  Object.freeze({ below: 1e5, base: 500000 }),
  Object.freeze({ below: 1e6, base: 1200000 }),
  Object.freeze({ below: 5e6, base: 1800000 }),
  Object.freeze({ below: 25e6, base: 2400000 }),
  Object.freeze({ below: 50e6, base: 3000000 }),
  Object.freeze({ below: 75e6, base: 3600000 }),
  Object.freeze({ below: 100e6, base: 4200000 }),
]);
const EXPEDITION_TOP_TIER_BASE = 5000000;

/** The Discoverer class bonus on expedition finds, `explorerBonusIncreasedExpeditionOutcome` in serverData. */
const DEFAULT_EXPLORER_BONUS = 0.5;

/** The share of base cargo each Hyperspace Technology level adds, `cargoHyperspaceTechMultiplier` in serverData. */
const DEFAULT_HYPERSPACE_MULTIPLIER = 5;

function assertBonus(name, value) {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${name} must be a number >= 0, received ${value}`);
  }
}

/**
 *
 * Return the expedition find base of a universe, before any multiplier
 * @param {number} topScore The points of the universe's top player
 * @return {number} The base, in metal
 */
function getExpeditionFindBase(topScore) {
  if (!Number.isFinite(topScore) || topScore < 0) {
    throw new Error(`topScore must be a number >= 0, received ${topScore}`);
  }

  const tier = EXPEDITION_FIND_TIERS.find(({ below }) => topScore < below);
  return tier ? tier.base : EXPEDITION_TOP_TIER_BASE;
}

/**
 *
 * Return the largest metal find a single expedition can bring back
 *
 * `base * classFactor * (pathfinder ? 2 : 1) * (1 + lifeformResourceBonus)`
 *
 * - a Discoverer gets `classFactor = (1 + explorerBonus * (1 + lifeformExplorerBonus)) * economySpeed`:
 *   the lifeform class enhancement amplifies the class bonus itself, and only
 *   the Discoverer's finds scale with the economy speed;
 * - any other class gets `classFactor = 1`.
 *
 * Crystal and deuterium finds are smaller than metal finds. Every bonus is a
 * fraction: 0.2 for the 20 % the in-game lifeform bonus page shows.
 * @param {object} options The universe and the player's bonuses
 * @param {number} options.topScore The points of the universe's top player
 * @param {number} options.economySpeed The universe economy speed
 * @param {boolean} [options.explorer] Whether the player is a Discoverer
 * @param {boolean} [options.pathfinder] Whether the fleet holds a Pathfinder
 * @param {number} [options.explorerBonus] The Discoverer class bonus, 0.5 by default
 * @param {number} [options.lifeformExplorerBonus] The lifeform Discoverer enhancement
 * @param {number} [options.lifeformResourceBonus] The lifeform expedition resource bonus
 * @return {number} The maximum find, in metal
 */
function getExpeditionMaxFind({
  topScore,
  economySpeed,
  explorer = false,
  pathfinder = false,
  explorerBonus = DEFAULT_EXPLORER_BONUS,
  lifeformExplorerBonus = 0,
  lifeformResourceBonus = 0,
}) {
  if (!(economySpeed > 0)) {
    throw new Error(`economySpeed must be greater than 0, received ${economySpeed}`);
  }
  assertBonus('explorerBonus', explorerBonus);
  assertBonus('lifeformExplorerBonus', lifeformExplorerBonus);
  assertBonus('lifeformResourceBonus', lifeformResourceBonus);

  const classFactor = explorer
    ? (1 + explorerBonus * (1 + lifeformExplorerBonus)) * economySpeed
    : 1;

  return getExpeditionFindBase(topScore) * classFactor * (pathfinder ? 2 : 1) * (1 + lifeformResourceBonus);
}

/**
 *
 * Return the cargo capacity of one ship, with its bonuses
 *
 * `ship.cargo * (1 + hyperspaceLevel * hyperspaceMultiplier / 100 + bonus)`:
 * every bonus is a share of the base cargo, so they add up.
 * @param {import('../types.js').DestroyableEntry} ship An entry of models/destroyable.js
 * @param {object} [options] The bonuses
 * @param {number} [options.hyperspaceLevel] The Hyperspace Technology level
 * @param {number} [options.hyperspaceMultiplier] The % of base cargo per level, 5 by default
 * @param {number} [options.bonus] Any other bonus as a fraction: class (Collector 0.25 on cargo ships), lifeform…
 * @return {number} The capacity
 */
function getCargoCapacity(ship, {
  hyperspaceLevel = 0,
  hyperspaceMultiplier = DEFAULT_HYPERSPACE_MULTIPLIER,
  bonus = 0,
} = {}) {
  if (!Number.isInteger(hyperspaceLevel) || hyperspaceLevel < 0) {
    throw new Error(`hyperspaceLevel must be an integer >= 0, received ${hyperspaceLevel}`);
  }
  assertBonus('hyperspaceMultiplier', hyperspaceMultiplier);
  assertBonus('bonus', bonus);

  return ship.cargo * (1 + (hyperspaceLevel * hyperspaceMultiplier) / 100 + bonus);
}

export {
  getExpeditionFindBase,
  getExpeditionMaxFind,
  getCargoCapacity,
  EXPEDITION_FIND_TIERS,
  EXPEDITION_TOP_TIER_BASE,
};
