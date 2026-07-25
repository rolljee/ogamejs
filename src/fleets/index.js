import getDebris from './getDebris.js';
import getDistance from './distance.js';
import getShipSpeed, { getActiveDrive, getFleetSpeed } from './speed.js';
import { getFlightTime, getFuelConsumption, getTrip } from './flight.js';
import simulateCombat from './combat.js';

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
};

export default Fleets;
