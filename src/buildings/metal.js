function getMineProduction(baseProduction, targetLevel, universeSpeed) {
  const levelFactor = 1.1 ** targetLevel;

  return Math.floor(baseProduction * targetLevel * levelFactor * universeSpeed);
}

function getEnergyCost(baseEnergyCost, targetLevel) {
  const level = targetLevel;
  const levelFactor = 1.1 ** level;
  return Math.floor(baseEnergyCost * level * levelFactor);
}

function getMetalCost(baseMetalCost, targetLevel) {
  const level = targetLevel - 1;
  return Math.floor(baseMetalCost * 1.5 ** level);
}

function getCrystalCost(baseCrystalCost, targetLevel) {
  const level = targetLevel - 1;
  return Math.floor(baseCrystalCost * 1.5 ** level);
}

/**
 *
 * Return information about the metal mine given a specific level
 * @param {object} mine The metal mine base information
 * @param {number} targetLevel
 * @param {number} universeSpeed production factor is increased for some universe
 * @returns {Object} informations about the metal mine at this specific level
 */
function getMetalMine(mine, targetLevel, universeSpeed = 1) {
  return {
    crystal: getCrystalCost(mine.crystal, targetLevel),
    deuterium: 0,
    energy: getEnergyCost(mine.energy, targetLevel),
    metal: getMetalCost(mine.metal, targetLevel),
    production: getMineProduction(mine.production, targetLevel, universeSpeed),
  };
}

export default getMetalMine;
