import getDistance from './distance.js';
import { getFleetSpeed, getActiveDrive } from './speed.js';

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
 * @param {import('../types.js').FleetEntry[]} fleet The ships taking off
 * @param {number} distance The distance to cross, from `getDistance`
 * @param {number} [speedPercent] The fleet speed slider, 10 to 100 in game
 * @param {import('../types.js').Drives} [drives] Drive levels, needed because a
 *   ship that switched drive also changed its consumption
 * @returns {number} The fuel needed, in deuterium
 */
function getFuelConsumption(fleet, distance, speedPercent = 100, drives = {}) {
  assertSpeedPercent(speedPercent);

  const fleetSpeed = getFleetSpeed(fleet, drives);

  const total = fleet
    .filter(({ count }) => count > 0)
    .reduce((sum, { ship, count }) => {
      // A ship that switched drive also changed how much it burns.
      const { speed, fuelConsumption } = getActiveDrive(ship, drives);
      const speedValue = (speedPercent / 10) * Math.sqrt(fleetSpeed / speed);
      const base = Math.max(1, Math.round(fuelConsumption * count));

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
    drives = {},
    roundTrip = false,
  } = options;

  const distance = getDistance(origin, target);
  const fleetSpeed = getFleetSpeed(fleet, drives);
  const oneWay = getFlightTime(distance, fleetSpeed, speedPercent, universeFleetSpeed);
  const fuel = getFuelConsumption(fleet, distance, speedPercent, drives) * (roundTrip ? 2 : 1);
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

export { getFlightTime, getFuelConsumption, getTrip };
