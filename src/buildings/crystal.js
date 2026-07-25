import buildingInfo from './info.js';

// Positions 1, 2 and 3 give a 30%, 22.5% and 15% crystal production bonus.
const POSITION_FACTOR = { 1: 1.3, 2: 1.225, 3: 1.15 };

function getPositionFactor(pos) {
  return POSITION_FACTOR[Number.parseInt(pos, 10)] ?? 1;
}

function getMineProduction(baseProduction, targetLevel, pos, universeSpeed) {
  const positionFactor = getPositionFactor(pos);
  const levelFactor = 1.1 ** targetLevel;

  return Math.floor(baseProduction * targetLevel * levelFactor * universeSpeed * positionFactor);
}

/**
 *
 * Return information about the crystal mine at a given level
 * @param {import('../types.js').BuildingEntry} mine The crystal mine entry, `Buildings[2]`
 * @param {number} targetLevel The level to reach, >= 1
 * @param {number} pos The planet position, 1, 2 and 3 produce more crystal
 * @param {number} [universeSpeed] Production is increased on faster universes
 * @returns {import('../types.js').BuildingInfo} Cost, consumption and production at that level
 */
function getCrystalMine(mine, targetLevel, pos, universeSpeed = 1) {
  return buildingInfo(
    mine,
    targetLevel,
    universeSpeed,
    (base) => getMineProduction(base.production, targetLevel, pos, universeSpeed),
  );
}

export default getCrystalMine;
