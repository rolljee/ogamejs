import getDebris from './getDebris.js';
import getDistance from './distance.js';
import getShipSpeed, { getActiveDrive, getFleetSpeed } from './speed.js';
import { getFlightTime, getFuelConsumption, getTrip } from './flight.js';
import simulateCombat, { DEFAULT_REPAIR_FACTOR, DEFAULT_PLUNDER_RATIO } from './combat.js';
import { getCombatStatistics, simulateCombats, DEFAULT_RUNS } from './combatStatistics.js';
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
  simulateCombats,
  getCombatStatistics,
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
  DEFAULT_REPAIR_FACTOR,
  DEFAULT_PLUNDER_RATIO,
  DEFAULT_RUNS,
};

export default Fleets;
