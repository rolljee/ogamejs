function assertCoordinates(coordinates, name) {
  const { galaxy, system, position } = coordinates ?? {};

  if (![galaxy, system, position].every((value) => Number.isInteger(value) && value > 0)) {
    throw new Error(`${name} must be a { galaxy, system, position } of positive integers`);
  }
}

// In a donut universe the fleet takes the shorter way round.
function gap(from, to, size, donut) {
  const direct = Math.abs(from - to);

  if (!donut) {
    return direct;
  }

  if (!Number.isInteger(size) || size <= 0) {
    throw new Error(`a donut universe needs its size, received ${size}`);
  }

  return Math.min(direct, size - direct);
}

/**
 *
 * Return the distance between two coordinates, in OGame distance units
 *
 * The scale is not linear: crossing a galaxy costs far more than crossing a
 * system, which costs far more than moving inside one. Most universes are
 * donuts: the last galaxy (or system) touches the first, and the fleet takes the
 * shorter way round.
 * @param {import('../types.js').Coordinates} origin Where the fleet leaves from
 * @param {import('../types.js').Coordinates} target Where it goes
 * @param {import('../types.js').UniverseShape} [universe] How the universe wraps,
 *   flat when left out
 * @returns {number} The distance
 */
function getDistance(origin, target, universe = {}) {
  assertCoordinates(origin, 'origin');
  assertCoordinates(target, 'target');

  const {
    galaxies, systems, donutGalaxy = false, donutSystem = false,
  } = universe;

  if (origin.galaxy !== target.galaxy) {
    return 20000 * gap(origin.galaxy, target.galaxy, galaxies, donutGalaxy);
  }

  if (origin.system !== target.system) {
    return 2700 + 95 * gap(origin.system, target.system, systems, donutSystem);
  }

  if (origin.position !== target.position) {
    return 1000 + 5 * Math.abs(origin.position - target.position);
  }

  // Same planet: a moon to planet hop, or a planet to its own debris field.
  return 5;
}

export default getDistance;
