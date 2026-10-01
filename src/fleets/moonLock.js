/** The debris that gives a moon its maximum chance to appear. */
const MOON_DEBRIS_THRESHOLD = 2000000;

/** The maximum moon chance, in %, reached at `MOON_DEBRIS_THRESHOLD`. */
const MAX_MOON_CHANCE = 20;

/**
 *
 * Return how many ships must be destroyed on a position to reach the maximum moon chance
 *
 * Only metal and crystal land in the debris field here, and the universe keeps
 * `debrisFactor` of them.
 * @param {import('../types.js').DestroyableEntry} ship An entry of models/destroyable.js
 * @param {number} debrisFactor The universe debris factor, e.g. 0.3 for 30%
 * @param {number} [threshold] The debris to reach, 2 000 000 by default
 * @return {number} The number of ships
 */
function getMoonLockShips(ship, debrisFactor, threshold = MOON_DEBRIS_THRESHOLD) {
  if (!(debrisFactor > 0)) {
    throw new Error(`debrisFactor must be greater than 0, received ${debrisFactor}`);
  }

  const debris = (ship.cost.metal ?? 0) + (ship.cost.crystal ?? 0);
  if (!(debris > 0)) {
    throw new Error('the ship leaves no metal or crystal debris');
  }

  return Math.ceil(threshold / (debrisFactor * debris));
}

export { getMoonLockShips, MOON_DEBRIS_THRESHOLD, MAX_MOON_CHANCE };
