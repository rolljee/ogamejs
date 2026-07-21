import Trader from './trades/index.js';
import Building from './buildings/index.js';
import Fleets from './fleets/index.js';
import Buildings from './models/buildings.js';
import Destroyable from './models/destroyable.js';

const Ogame = {
  Trader,
  Building,
  Fleets,
  models: {
    Buildings,
    Destroyable,
  },
};

export default Ogame;
