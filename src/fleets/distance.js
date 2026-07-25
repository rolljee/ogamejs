function assertCoordinates(coordinates, name) {
  const { galaxy, system, position } = coordinates ?? {};

  if (![galaxy, system, position].every((value) => Number.isInteger(value) && value > 0)) {
    throw new Error(`${name} must be a { galaxy, system, position } of positive integers`);
  }
}

/**
 *
 * Return the distance between two coordinates, in OGame distance units
 *
 * The scale is not linear: crossing a galaxy costs far more than crossing a
 * system, which costs far more than moving inside one.
 * @param {import('../types.js').Coordinates} origin Where the fleet leaves from
 * @param {import('../types.js').Coordinates} target Where it goes
 * @returns {number} The distance
 */
function getDistance(origin, target) {
  assertCoordinates(origin, 'origin');
  assertCoordinates(target, 'target');

  if (origin.galaxy !== target.galaxy) {
    return 20000 * Math.abs(origin.galaxy - target.galaxy);
  }

  if (origin.system !== target.system) {
    return 2700 + 95 * Math.abs(origin.system - target.system);
  }

  if (origin.position !== target.position) {
    return 1000 + 5 * Math.abs(origin.position - target.position);
  }

  // Same planet: a moon to planet hop, or a planet to its own debris field.
  return 5;
}

export default getDistance;
