import getDebris from './getDebris.js';
import getDistance from './distance.js';
import getShipSpeed, { getActiveDrive, getFleetSpeed } from './speed.js';
import { getFlightTime, getFuelConsumption, getTrip } from './flight.js';
import simulateCombat from './combat.js';
import {
  getWaveChance,
  getMoonbreakWaves,
  getMoonbreakChance,
  getMoonbreakLosses,
  MIN_MOON_SIZE,
  MAX_MOON_SIZE,
  WAVES_PER_ATTACKER,
} from './moonbreak.js';
import {
  getExpeditionFindBase,
  getExpeditionMaxFind,
  getCargoCapacity,
  EXPEDITION_FIND_TIERS,
  EXPEDITION_TOP_TIER_BASE,
} from './expedition.js';
import { getMoonLockShips, MOON_DEBRIS_THRESHOLD, MAX_MOON_CHANCE } from './moonLock.js';

const Fleets = {
  getDebris,
  getDistance,
  getShipSpeed,
  getActiveDrive,
  getFleetSpeed,
  getFlightTime,
  getFuelConsumption,
  getTrip,
  simulateCombat,
  getWaveChance,
  getMoonbreakWaves,
  getMoonbreakChance,
  getMoonbreakLosses,
  getExpeditionFindBase,
  getExpeditionMaxFind,
  getCargoCapacity,
  getMoonLockShips,
};

export {
  MIN_MOON_SIZE,
  MAX_MOON_SIZE,
  WAVES_PER_ATTACKER,
  EXPEDITION_FIND_TIERS,
  EXPEDITION_TOP_TIER_BASE,
  MOON_DEBRIS_THRESHOLD,
  MAX_MOON_CHANCE,
};

export default Fleets;
