import getDistance from './distance.js';
import { getFleetSpeed, getActiveDrive } from './speed.js';

/** The game stops the fuel discounts here, however many add up. */
const MAX_FUEL_REDUCTION = 0.9;

function assertSpeedPercent(speedPercent) {
  if (!Number.isFinite(speedPercent) || speedPercent <= 0 || speedPercent > 100) {
    throw new Error(`speedPercent must be between 1 and 100, received ${speedPercent}`);
  }
}

/**
 *
 * Return the one way flight time of a fleet
 *
 * `(10 + 350000 / speedPercent * sqrt(distance * 10 / fleetSpeed)) / universeFleetSpeed`
 *
 * At 100% that is the well known `10 + 3500 * sqrt(distance * 10 / fleetSpeed)`.
 * @param {number} distance The distance to cross, from `getDistance`
 * @param {number} fleetSpeed The speed of the slowest ship, from `getFleetSpeed`
 * @param {number} [speedPercent] The fleet speed slider, 10 to 100 in game
 * @param {number} [universeFleetSpeed] The universe fleet speed
 * @returns {number} The flight time, in seconds
 */
function getFlightTime(distance, fleetSpeed, speedPercent = 100, universeFleetSpeed = 1) {
  assertSpeedPercent(speedPercent);

  if (!(fleetSpeed > 0)) {
    throw new Error(`fleetSpeed must be greater than 0, received ${fleetSpeed}`);
  }

  const seconds = 10 + (350000 / speedPercent) * Math.sqrt((distance * 10) / fleetSpeed);

  return Math.round(seconds / universeFleetSpeed);
}

/**
 *
 * Return the deuterium a fleet burns for a one way trip
 *
 * Each ship type is billed on its own, then the bills add up:
 * `max(1, round(consumption * count * distance / 35000 * (shipSpeedValue / 10 + 1) ** 2))`
 *
 * `shipSpeedValue` is the speed the ship really flies at, on the game's 1 to 10
 * scale: `speedPercent / 10` for the slowest ship, less for the faster ones held
 * back by it, `speedPercent / 10 * sqrt(fleetSpeed / shipSpeed)`. A faster ship
 * flying slower than it could burns less than at full throttle.
 *
 * `consumption` is the ship's own, after the universe deuterium factor and the
 * entry's `fuelReduction` (General, life forms), each rounded down and never
 * below one unit.
 * @param {import('../types.js').FleetEntry[]} fleet The ships taking off
 * @param {number} distance The distance to cross, from `getDistance`
 * @param {number} [speedPercent] The fleet speed slider, 10 to 100 in game
 * @param {import('../types.js').Drives} [drives] Drive levels, needed because a
 *   ship that switched drive also changed its consumption
 * @param {object} [options] Universe settings
 * @param {number} [options.deuteriumFactor] The universe deuterium consumption
 *   factor (`globalDeuteriumSaveFactor` in the API), 1 when left out
 * @returns {number} The fuel needed, in deuterium
 */
function getFuelConsumption(fleet, distance, speedPercent = 100, drives = {}, options = {}) {
  assertSpeedPercent(speedPercent);

  const { deuteriumFactor = 1 } = options;

  if (!Number.isFinite(deuteriumFactor) || deuteriumFactor <= 0) {
    throw new Error(`deuteriumFactor must be greater than 0, received ${deuteriumFactor}`);
  }

  const fleetSpeed = getFleetSpeed(fleet, drives);

  const total = fleet
    .filter(({ count }) => count > 0)
    .reduce((sum, {
      ship, count, speedBonus = 0, fuelReduction = 0,
    }) => {
      // A ship that switched drive also changed how much it burns.
      const { speed, fuelConsumption } = getActiveDrive(ship, drives, speedBonus);
      const speedValue = (speedPercent / 10) * Math.sqrt(fleetSpeed / speed);
      // Kept in percent until the end: 1 - 0.9 lands just under 0.1 in binary.
      const saved = Math.round(Math.min(Math.max(fuelReduction, 0), MAX_FUEL_REDUCTION) * 10000);
      const perShip = Math.max(1, Math.floor(
        (Math.floor(fuelConsumption * deuteriumFactor) * (10000 - saved)) / 10000,
      ));
      const base = Math.max(1, Math.round(perShip * count));

      return sum + Math.max(1, Math.round((base * distance) / 35000 * (speedValue / 10 + 1) ** 2));
    }, 0);

  return Math.max(1, total);
}

/**
 *
 * Return everything about a trip: distance, duration, fuel and cargo left
 * @param {import('../types.js').FleetEntry[]} fleet The ships taking off
 * @param {import('../types.js').Coordinates} origin Where the fleet leaves from
 * @param {import('../types.js').Coordinates} target Where it goes
 * @param {object} [options] Trip options
 * @param {number} [options.speedPercent] The fleet speed slider, 10 to 100 in game
 * @param {number} [options.universeFleetSpeed] The universe fleet speed
 * @param {number} [options.deuteriumFactor] The universe deuterium consumption factor
 * @param {import('../types.js').UniverseShape} [options.universe] How the universe
 *   wraps, for the distance
 * @param {import('../types.js').Drives} [options.drives] The drive technology levels
 * @param {boolean} [options.roundTrip] Whether to account for the way back too
 * @returns {{
 *   distance: number, fleetSpeed: number, duration: number, fuel: number,
 *   cargo: number, cargoAfterFuel: number,
 * }} The trip, with durations in seconds and `cargoAfterFuel` the room left once
 *   the fuel is loaded
 */
function getTrip(fleet, origin, target, options = {}) {
  const {
    speedPercent = 100,
    universeFleetSpeed = 1,
    deuteriumFactor = 1,
    universe = {},
    drives = {},
    roundTrip = false,
  } = options;

  const distance = getDistance(origin, target, universe);
  const fleetSpeed = getFleetSpeed(fleet, drives);
  const oneWay = getFlightTime(distance, fleetSpeed, speedPercent, universeFleetSpeed);
  const fuel = getFuelConsumption(fleet, distance, speedPercent, drives, { deuteriumFactor })
    * (roundTrip ? 2 : 1);
  const cargo = fleet.reduce((total, { ship, count }) => total + ship.cargo * count, 0);

  return {
    distance,
    fleetSpeed,
    duration: roundTrip ? oneWay * 2 : oneWay,
    fuel,
    cargo,
    cargoAfterFuel: Math.max(0, cargo - fuel),
  };
}

export {
  getFlightTime, getFuelConsumption, getTrip, MAX_FUEL_REDUCTION,
};
