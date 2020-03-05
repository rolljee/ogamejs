import BUILDINGS from '../models/buildings';

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
 * @param {number} targetLevel
 * @param {number} energyTech The technology energy level
 * @param {number} universeSpeed production factor is increased for some universe
 * @returns {Object} informations about the fusion reactor at this specific level
 */
function getFusionReactor(targetLevel, energyTech, universeSpeed = 1) {
	const mine = BUILDINGS[5].base;

	return {
		crystal: getCrystalCost(mine.crystal, targetLevel),
		energy: 0,
		consumption: getConsumption(mine.consumption, targetLevel, universeSpeed),
		deuterium: getDeuteriumCost(mine.deutrium, targetLevel),
		metal: getMetalCost(mine.metal, targetLevel),
		production: getEnergyProduction(mine.production, targetLevel, energyTech)
	};
}

export default getFusionReactor;
