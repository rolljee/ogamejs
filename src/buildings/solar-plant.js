import buildingInfo from './info.js';

function getEnergyProduction(baseProduction, targetLevel) {
  const levelFactor = 1.1 ** targetLevel;

  return Math.floor(baseProduction * targetLevel * levelFactor);
}

/**
 *
 * Return information about the solar plant at a given level
 * @param {import('../types.js').BuildingEntry} solarPlant The solar plant entry, `Buildings[4]`
 * @param {number} targetLevel The level to reach, >= 1
 * @returns {import('../types.js').BuildingInfo} Cost of the plant, and the energy it produces
 */
function getSolarPlant(solarPlant, targetLevel) {
  return buildingInfo(
    solarPlant,
    targetLevel,
    1,
    (base) => getEnergyProduction(base.production, targetLevel),
  );
}

export default getSolarPlant;
