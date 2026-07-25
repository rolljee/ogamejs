import getCost, { assertEntry } from '../cost.js';

/**
 * Energy and deuterium flows both grow the same way: base * level * 1.1 ** level.
 */
function flow(baseValue, targetLevel, universeSpeed = 1) {
  return Math.floor(baseValue * targetLevel * 1.1 ** targetLevel * universeSpeed);
}

/**
 *
 * Assemble the information every building calculator returns
 *
 * Keeping a single shape means a caller can read `production` or
 * `energyConsumption` without knowing which building it is looking at; the
 * fields that do not apply are simply `0`.
 * @param {import('../types.js').BuildingEntry} entry A models/buildings.js entry
 * @param {number} targetLevel The level to reach, >= 1
 * @param {number} universeSpeed The universe economy speed
 * @param {(base: object, flows: object) => number} computeProduction Production of
 *   that building, given its base stats and its already computed consumptions
 * @returns {import('../types.js').BuildingInfo} The full picture of that building at that level
 */
function buildingInfo(entry, targetLevel, universeSpeed, computeProduction) {
  assertEntry(entry, targetLevel);

  const { base } = entry;
  const flows = {
    // The energy a building consumes does not depend on the universe speed,
    // the deuterium a fusion reactor burns does.
    energyConsumption: flow(base.energyConsumption, targetLevel),
    deuteriumConsumption: flow(base.deuteriumConsumption, targetLevel, universeSpeed),
  };

  return {
    ...getCost(entry, targetLevel),
    ...flows,
    production: computeProduction(base, flows),
  };
}

export default buildingInfo;
