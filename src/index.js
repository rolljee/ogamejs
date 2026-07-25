import Trader from './trades/index.js';
import Building from './buildings/index.js';
import Fleets from './fleets/index.js';
import Research from './research/index.js';
import Buildings from './models/buildings.js';
import Destroyable, { ATTRIBUTES } from './models/destroyable.js';
import ResearchModel from './models/research.js';
import { getName, findByName, LANGS } from './i18n.js';

const Ogame = {
  Trader,
  Building,
  Fleets,
  Research,
  i18n: {
    getName,
    findByName,
    LANGS,
  },
  models: {
    Buildings,
    Destroyable,
    Research: ResearchModel,
    ATTRIBUTES,
  },
};

export default Ogame;
