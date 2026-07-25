import getCrystalMine from './crystal.js';
import getDeutSynth from './deut.js';
import getMetalMine from './metal.js';
import getSolarPlant from './solar-plant.js';
import getFusionReactor from './fusion-reactor.js';
import parseInfoCompteData from './infocompte.js';
import getCost from '../cost.js';
import getStorage, { getStorageCapacity, getStorageLevelFor } from './storage.js';
import getBuildTime from './buildTime.js';
import getPlanetProduction, { getProductionBonus } from './production.js';

const Buildings = {
  getCrystalMine,
  getDeutSynth,
  getMetalMine,
  getSolarPlant,
  getFusionReactor,
  parseInfoCompteData,
  getBuildingCost: getCost,
  getBuildTime,
  getStorage,
  getStorageCapacity,
  getStorageLevelFor,
  getPlanetProduction,
  getProductionBonus,
};

export default Buildings;
