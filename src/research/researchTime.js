import getCost, { assertLevel } from '../cost.js';

/**
 *
 * Return the time needed to research a technology at a given level
 *
 * time = (metal + crystal) / (1000 * (1 + labs)) hours, divided by the
 * universe research speed. `labs` is the research lab level, or the sum of
 * every connected lab when the Intergalactic Research Network is up.
 * @param {import('../types.js').ResearchEntry} research A models/research.js entry
 * @param {number} targetLevel The level to reach, >= 1
 * @param {number} [labLevel] The research lab level, or the sum of connected labs
 * @param {number} [researchSpeed] The universe research speed
 * @returns {number} The research time, in seconds
 */
function getResearchTime(research, targetLevel, labLevel = 0, researchSpeed = 1) {
  assertLevel(targetLevel);

  const { metal, crystal } = getCost(research, targetLevel);
  const divider = 1000 * (1 + labLevel) * researchSpeed;

  return Math.round(((metal + crystal) / divider) * 3600);
}

export default getResearchTime;
