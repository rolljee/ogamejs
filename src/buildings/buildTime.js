import getCost, { assertLevel } from '../cost.js';

/**
 *
 * Return the time needed to build a building at a given level
 *
 * time = (metal + crystal) / (2500 * (1 + robotics) * 2 ** nanites) hours,
 * divided by the universe economy speed.
 * @param {import('../types.js').BuildingEntry} building A models/buildings.js entry
 * @param {number} targetLevel The level to reach, >= 1
 * @param {number} [roboticsLevel] The robotics factory level on that planet
 * @param {number} [naniteLevel] The nanite factory level on that planet
 * @param {number} [universeSpeed] The universe economy speed
 * @returns {number} The build time, in seconds
 */
function getBuildTime(building, targetLevel, roboticsLevel = 0, naniteLevel = 0, universeSpeed = 1) {
  assertLevel(targetLevel);

  const { metal, crystal } = getCost(building, targetLevel);
  const divider = 2500 * (1 + roboticsLevel) * 2 ** naniteLevel * universeSpeed;

  return Math.round(((metal + crystal) / divider) * 3600);
}

export default getBuildTime;
