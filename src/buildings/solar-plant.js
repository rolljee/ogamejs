import BUILDINGS from '../models/buildings';

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
 * @param {number} targetLevel
 * @returns {Object} informations about the solar plant at this specific level
 */
function getSolarPlant(targetLevel) {
	const mine = BUILDINGS[4].base;

	return {
		crystal: getCrystalCost(mine.crystal, targetLevel),
		energy: 0,
		deuterium: 0,
		metal: getMetalCost(mine.metal, targetLevel),
		production: getEnergyProduction(mine.production, targetLevel)
	};
}

export default getSolarPlant;
