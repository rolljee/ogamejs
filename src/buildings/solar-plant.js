function getEnergyProduction(baseProduction, targetLevel) {
	const levelFactor = 1.1 ** targetLevel;
	return Math.floor(baseProduction * targetLevel * levelFactor);
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
 * Return information about the solar plant given a specific level
 * @param {object} solarPlant The solarPlant base information
 * @param {number} targetLevel
 * @returns {Object} informations about the solar plant at this specific level
 */
function getSolarPlant(solarPlant, targetLevel) {
	return {
		crystal: getCrystalCost(solarPlant.crystal, targetLevel),
		energy: 0,
		deuterium: 0,
		metal: getMetalCost(solarPlant.metal, targetLevel),
		production: getEnergyProduction(solarPlant.production, targetLevel)
	};
}

export default getSolarPlant;
