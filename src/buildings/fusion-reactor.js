function getEnergyFactor(energyTech) {
  return 1.05 + 0.01 * energyTech;
}

function getEnergyProduction(baseProduction, targetLevel, energyTech) {
  const factor = getEnergyFactor(energyTech) ** targetLevel;
  return Math.floor(baseProduction * targetLevel * factor);
}

function getMetalCost(baseMetalCost, targetLevel) {
  const level = targetLevel - 1;
  return Math.floor(baseMetalCost * 1.8 ** level);
}

function getCrystalCost(baseCrystalCost, targetLevel) {
  const level = targetLevel - 1;
  return Math.floor(baseCrystalCost * 1.8 ** level);
}

function getDeuteriumCost(baseDeuteriumCost, targetLevel) {
  const level = targetLevel - 1;
  return Math.floor(baseDeuteriumCost * 1.8 ** level);
}

function getConsumption(baseConsumption, targetLevel, universeSpeed) {
  const levelFactor = 1.1 ** targetLevel;
  return Math.floor(baseConsumption * targetLevel * levelFactor * universeSpeed);
}

/**
 *
 * Return information about the fusion reactor given a specific level
 * @param {object} reactor The fusion react base information
 * @param {number} targetLevel
 * @param {number} energyTech The technology energy level
 * @param {number} universeSpeed production factor is increased for some universe
 * @returns {Object} informations about the fusion reactor at this specific level
 */
function getFusionReactor(reactor, targetLevel, energyTech, universeSpeed = 1) {
  return {
    crystal: getCrystalCost(reactor.crystal, targetLevel),
    energy: 0,
    consumption: getConsumption(reactor.consumption, targetLevel, universeSpeed),
    deuterium: getDeuteriumCost(reactor.deutrium, targetLevel),
    metal: getMetalCost(reactor.metal, targetLevel),
    production: getEnergyProduction(reactor.production, targetLevel, energyTech),
  };
}

export default getFusionReactor;
