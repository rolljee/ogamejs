import buildingInfo from './info.js';

// Energy technology makes each reactor level a little more efficient.
function getEnergyFactor(energyTech) {
  return 1.05 + 0.01 * energyTech;
}

function getEnergyProduction(baseProduction, targetLevel, energyTech) {
  const factor = getEnergyFactor(energyTech) ** targetLevel;

  return Math.floor(baseProduction * targetLevel * factor);
}

/**
 *
 * Return information about the fusion reactor at a given level
 *
 * `deuteriumConsumption` is the deuterium the reactor burns per hour, and
 * `production` the energy it delivers.
 * @param {import('../types.js').BuildingEntry} reactor The fusion reactor entry, `Buildings[5]`
 * @param {number} targetLevel The level to reach, >= 1
 * @param {number} energyTech The Energy Technology level
 * @param {number} [universeSpeed] Consumption is increased on faster universes
 * @returns {import('../types.js').BuildingInfo} Cost, deuterium consumption and energy production
 */
function getFusionReactor(reactor, targetLevel, energyTech, universeSpeed = 1) {
  return buildingInfo(
    reactor,
    targetLevel,
    universeSpeed,
    (base) => getEnergyProduction(base.production, targetLevel, energyTech),
  );
}

export default getFusionReactor;
