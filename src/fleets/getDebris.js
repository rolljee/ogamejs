/**
 *
 * Return the debris field left behind by destroyed ships or defenses
 * @param {import('../types.js').DestroyableEntry} ship An entry of models/destroyable.js
 * @param {number} number The number of destroyed units
 * @param {number} factor The universe debris factor, e.g. 0.3 for 30%
 * @param {number} [deuteriumFactor] The universe deuterium debris factor, 0 on most universes
 * @return {import('../types.js').Resources} The debris generated
 */
function getDebris(ship, number, factor, deuteriumFactor = 0) {
  const { cost } = ship;
  const deuteriumCost = cost.deuterium ?? cost.deut ?? 0;

  return {
    metal: (cost.metal ?? 0) * factor * number,
    crystal: (cost.crystal ?? 0) * factor * number,
    deuterium: deuteriumCost * deuteriumFactor * number,
  };
}

export default getDebris;
