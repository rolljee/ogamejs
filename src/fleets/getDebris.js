/**
 *
 * Returns the number of debris generated
 * @param {number} shipId The ship identifier
 * @param {number} number The number of ship
 * @param {number} factor The universe debris factor
 * @return {Object} The debris generated
 */
function getDebris(ship, number, factor) {
	const { cost } = ship;
	const metalDebris = cost.metal ? cost.metal * factor : 0;
	const crystalDebris = cost.crystal ? cost.crystal * factor : 0;

	return {
		metal: metalDebris * number,
		crystal: crystalDebris * number
	};
}

export default getDebris;
