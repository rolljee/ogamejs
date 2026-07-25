import { ATTRIBUTES } from '../models/destroyable.js';

const { DRIVES } = ATTRIBUTES;

/** Each drive level adds that share of the ship base speed. */
const DRIVE_BONUS = Object.freeze({
  [DRIVES.COMBUSTION]: 0.1,
  [DRIVES.IMPULSE]: 0.2,
  [DRIVES.HYPERSPACE]: 0.3,
  [DRIVES.NONE]: 0,
});

/** The research id backing each drive, handy to look the level up. */
const DRIVE_RESEARCH = Object.freeze({
  [DRIVES.COMBUSTION]: 115,
  [DRIVES.IMPULSE]: 117,
  [DRIVES.HYPERSPACE]: 118,
});

function driveLevel(drives, drive) {
  if (!Object.hasOwn(DRIVE_BONUS, drive)) {
    throw new Error(`unknown drive ${drive}`);
  }

  // eslint-disable-next-line security/detect-object-injection -- drive is a known key
  const level = drives?.[drive] ?? 0;

  if (!Number.isInteger(level) || level < 0) {
    throw new Error(`drives.${drive} must be an integer >= 0, received ${level}`);
  }

  return level;
}

function speedWith(baseSpeed, drive, drives) {
  // eslint-disable-next-line security/detect-object-injection -- drive is a known key
  return Math.floor(baseSpeed * (1 + DRIVE_BONUS[drive] * driveLevel(drives, drive)));
}

/**
 *
 * Return the drive a ship actually flies on, and the speed it reaches
 *
 * A few ships switch to a better drive once the matching technology is high
 * enough — a small cargo moves to the impulse drive at Impulse 5. When several
 * drives are available the ship uses whichever ends up fastest.
 * @param {import('../types.js').DestroyableEntry} ship An entry of models/destroyable.js
 * @param {import('../types.js').Drives} [drives] Drive levels
 * @returns {{drive: string, speed: number, fuelConsumption: number}} The active drive
 */
function getActiveDrive(ship, drives = {}) {
  if (!ship || !ship.drive) {
    throw new Error('expected an entry of models/destroyable.js');
  }

  const candidates = [
    { drive: ship.drive, speed: ship.speed, fuelConsumption: ship.fuelConsumption },
    ...(ship.driveUpgrades ?? [])
      .filter((upgrade) => driveLevel(drives, upgrade.drive) >= upgrade.minLevel),
  ];

  return candidates
    .map(({ drive, speed, fuelConsumption }) => ({
      drive,
      speed: speedWith(speed, drive, drives),
      fuelConsumption,
    }))
    .reduce((best, candidate) => (candidate.speed > best.speed ? candidate : best));
}

/**
 *
 * Return the speed of a ship, drive technologies included
 * @param {import('../types.js').DestroyableEntry} ship An entry of models/destroyable.js
 * @param {import('../types.js').Drives} [drives] Drive levels
 * @returns {number} The speed the ship flies at
 */
function getShipSpeed(ship, drives = {}) {
  return getActiveDrive(ship, drives).speed;
}

/**
 *
 * Return the speed of a whole fleet, which is the speed of its slowest ship
 * @param {import('../types.js').FleetEntry[]} fleet The ships taking off
 * @param {import('../types.js').Drives} [drives] Drive levels
 * @returns {number} The fleet speed
 */
function getFleetSpeed(fleet, drives = {}) {
  if (!Array.isArray(fleet) || fleet.length === 0) {
    throw new Error('fleet must be a non empty array of { ship, count }');
  }

  const speeds = fleet
    .filter(({ count }) => count > 0)
    .map(({ ship }) => getShipSpeed(ship, drives));

  if (speeds.length === 0) {
    throw new Error('fleet must hold at least one ship with a count above 0');
  }

  return Math.min(...speeds);
}

export {
  getActiveDrive, getFleetSpeed, DRIVE_BONUS, DRIVE_RESEARCH,
};
export default getShipSpeed;
