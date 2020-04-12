import Trader from './trades';
import Building from './buildings';
import Fleets from './fleets';
import Buildings from './models/buildings';
import Destroyable from './models/destroyable';

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
