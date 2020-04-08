
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

function getPositionFactor(pos) {
  const factor = {
    1: 1.3,
    2: 1.225,
    3: 1.15,
  };
  return factor[Number.parseInt(pos, 10)] ? factor[Number.parseInt(pos, 10)] : 1;
}

function getMineProduction(baseProduction, targetLevel, pos, universeSpeed) {
  const positionFactor = getPositionFactor(pos);
  const levelFactor = Math.pow(1.1, targetLevel);
  return Math.floor(baseProduction * targetLevel * levelFactor * universeSpeed * positionFactor);
}

function getEnergyCost(baseEnergyCost, targetLevel) {
  const level = targetLevel;
  const levelFactor = Math.pow(1.1, level);
  return Math.floor(baseEnergyCost * level * levelFactor);
}

function getMetalCost(baseMetalCost, targetLevel) {
  const level = targetLevel - 1;
  return Math.floor(baseMetalCost * Math.pow(1.6, level));
}

function getCrystalCost(baseCrystalCost, targetLevel) {
  const level = targetLevel - 1;
  return Math.floor(baseCrystalCost * Math.pow(1.6, level));
}
/**
 *
 * Return information about the crystal mine given a specific level
 * @param {object} mine The crystal mine base information
 * @param {number} targetLevel the crystal mine target level
 * @param {number} pos pos 1/2/3 have a 15/10/5%
 * @param {number} universeSpeed production factor is increased for some universe
 * @returns {Object} informations about the crystal mine at this specific level
 */


function getCrystalMine(mine, targetLevel, pos) {
  const universeSpeed = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  return {
    crystal: getCrystalCost(mine.crystal, targetLevel),
    deuterium: 0,
    energy: getEnergyCost(mine.energy, targetLevel),
    metal: getMetalCost(mine.metal, targetLevel),
    production: getMineProduction(mine.production, targetLevel, pos, universeSpeed),
  };
}

const _default = getCrystalMine;
exports.default = _default;
