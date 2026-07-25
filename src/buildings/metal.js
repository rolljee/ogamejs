import buildingInfo from './info.js';

function getMineProduction(baseProduction, targetLevel, universeSpeed) {
  const levelFactor = 1.1 ** targetLevel;

  return Math.floor(baseProduction * targetLevel * levelFactor * universeSpeed);
}

/**
 *
 * Return information about the metal mine at a given level
 * @param {import('../types.js').BuildingEntry} mine The metal mine entry, `Buildings[1]`
 * @param {number} targetLevel The level to reach, >= 1
 * @param {number} [universeSpeed] Production is increased on faster universes
 * @returns {import('../types.js').BuildingInfo} Cost, consumption and production at that level
 */
function getMetalMine(mine, targetLevel, universeSpeed = 1) {
  return buildingInfo(
    mine,
    targetLevel,
    universeSpeed,
    (base) => getMineProduction(base.production, targetLevel, universeSpeed),
  );
}

export default getMetalMine;
