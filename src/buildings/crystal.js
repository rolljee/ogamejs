import BUILDINGS from '../models/buildings';

function getPositionFactor(pos) {
	const factor = {
		1: 1.3,
		2: 1.225,
		3: 1.15
	};

	return factor[pos] ? factor[pos] : 1;
}

function getMineProduction(baseProduction, targetLevel, pos, universeSpeed) {
	const positionFactor = getPositionFactor(pos);
	const levelFactor = 1.1 ** targetLevel;

	return Math.floor(baseProduction * targetLevel * levelFactor * universeSpeed * positionFactor);
}

function getEnergyCost(baseEnergyCost, targetLevel) {
	const level = targetLevel;
	const levelFactor = 1.1 ** level;
	return Math.floor(baseEnergyCost * level * levelFactor);
}

function getMetalCost(baseMetalCost, targetLevel) {
	const level = targetLevel - 1;
	return Math.floor(baseMetalCost * 1.6 ** level);
}

function getCrystalCost(baseCrystalCost, targetLevel) {
	const level = targetLevel - 1;
	return Math.floor(baseCrystalCost * 1.6 ** level);
}

/**
 *
 * Return information about the crystal mine given a specific level
 * @param {number} targetLevel the crystal mine target level
 * @param {number} pos pos 1/2/3 have a 15/10/5%
 * @param {number} universeSpeed production factor is increased for some universe
 * @returns {Object} informations about the crystal mine at this specific level
 */
function getCrystalMine(targetLevel, pos, universeSpeed = 1) {
	const mine = BUILDINGS[2].base;
	return {
		crystal: getCrystalCost(mine.crystal, targetLevel),
		deuterium: 0,
		energy: getEnergyCost(mine.energy, targetLevel),
		metal: getMetalCost(mine.metal, targetLevel),
		production: getMineProduction(mine.production, targetLevel, pos, universeSpeed)
	};
}

export default getCrystalMine;
