import BUILDINGS from '../models/buildings';

function getPositionFactor(avg) {
	return 0.68 - 0.002 * avg;
}

function getMineProduction(energyCost, avg, universeSpeed) {
	const factor = getPositionFactor(avg);
	return Math.floor(universeSpeed * energyCost * factor);
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
 * Return information about the deuterium synth given a specific level
 * @param {number} targetLevel the deuterieum synth target level
 * @param {number} avg planet average temperature - The lower the higher the prod is
 * @param {number} universeSpeed production factor is increased for some universe
 * @returns {Object} informations about the deut synth at this specific level
 */
function getDeutSynth(targetLevel, avg, universeSpeed = 1) {
	const mine = BUILDINGS[3].base;
	const energyCost = getEnergyCost(mine.energy, targetLevel);
	return {
		crystal: getCrystalCost(mine.crystal, targetLevel),
		energy: energyCost,
		deuterium: 0,
		metal: getMetalCost(mine.metal, targetLevel),
		production: getMineProduction(energyCost, avg, universeSpeed)
	};
}

export default getDeutSynth;
