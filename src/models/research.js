const CATEGORIES = Object.freeze({
  BASIC: 'basic',
  DRIVE: 'drive',
  ADVANCED: 'advanced',
  COMBAT: 'combat',
});

/**
 * Every technology of the game, keyed by its official OGame id.
 *
 * Same shape as `models/buildings.js`: `names` for the localised labels,
 * `base` for the level 1 cost and `factor` for the per-level multiplier —
 * cost(level) = base * factor ** (level - 1).
 *
 * `base.energyCost` is only non zero for Graviton technology, which is paid
 * entirely in energy.
 */
const RESEARCH = Object.freeze({
  106: {
    ogameId: 106,
    names: { en: 'Espionage Technology', fr: 'Technologie Espionnage' },
    category: CATEGORIES.BASIC,
    factor: 2,
    base: {
      metal: 200, crystal: 1000, deuterium: 200, energyCost: 0,
    },
  },
  108: {
    ogameId: 108,
    names: { en: 'Computer Technology', fr: 'Technologie Ordinateur' },
    category: CATEGORIES.BASIC,
    factor: 2,
    base: {
      metal: 0, crystal: 400, deuterium: 600, energyCost: 0,
    },
  },
  109: {
    ogameId: 109,
    names: { en: 'Weapons Technology', fr: 'Technologie Armes' },
    category: CATEGORIES.COMBAT,
    factor: 2,
    base: {
      metal: 800, crystal: 200, deuterium: 0, energyCost: 0,
    },
  },
  110: {
    ogameId: 110,
    names: { en: 'Shielding Technology', fr: 'Technologie Bouclier' },
    category: CATEGORIES.COMBAT,
    factor: 2,
    base: {
      metal: 200, crystal: 600, deuterium: 0, energyCost: 0,
    },
  },
  111: {
    ogameId: 111,
    names: { en: 'Armour Technology', fr: 'Technologie Protection des vaisseaux spatiaux' },
    category: CATEGORIES.COMBAT,
    factor: 2,
    base: {
      metal: 1000, crystal: 0, deuterium: 0, energyCost: 0,
    },
  },
  113: {
    ogameId: 113,
    names: { en: 'Energy Technology', fr: 'Technologie Énergie' },
    category: CATEGORIES.BASIC,
    factor: 2,
    base: {
      metal: 0, crystal: 800, deuterium: 400, energyCost: 0,
    },
  },
  114: {
    ogameId: 114,
    names: { en: 'Hyperspace Technology', fr: 'Technologie Hyperespace' },
    category: CATEGORIES.ADVANCED,
    factor: 2,
    base: {
      metal: 0, crystal: 4000, deuterium: 2000, energyCost: 0,
    },
  },
  115: {
    ogameId: 115,
    names: { en: 'Combustion Drive', fr: 'Réacteur à combustion' },
    category: CATEGORIES.DRIVE,
    factor: 2,
    base: {
      metal: 400, crystal: 0, deuterium: 600, energyCost: 0,
    },
  },
  117: {
    ogameId: 117,
    names: { en: 'Impulse Drive', fr: 'Réacteur à impulsion' },
    category: CATEGORIES.DRIVE,
    factor: 2,
    base: {
      metal: 2000, crystal: 4000, deuterium: 600, energyCost: 0,
    },
  },
  118: {
    ogameId: 118,
    names: { en: 'Hyperspace Drive', fr: 'Propulsion hyperespace' },
    category: CATEGORIES.DRIVE,
    factor: 2,
    base: {
      metal: 10000, crystal: 20000, deuterium: 6000, energyCost: 0,
    },
  },
  120: {
    ogameId: 120,
    names: { en: 'Laser Technology', fr: 'Technologie Laser' },
    category: CATEGORIES.COMBAT,
    factor: 2,
    base: {
      metal: 200, crystal: 100, deuterium: 0, energyCost: 0,
    },
  },
  121: {
    ogameId: 121,
    names: { en: 'Ion Technology', fr: 'Technologie Ions' },
    category: CATEGORIES.COMBAT,
    factor: 2,
    base: {
      metal: 1000, crystal: 300, deuterium: 100, energyCost: 0,
    },
  },
  122: {
    ogameId: 122,
    names: { en: 'Plasma Technology', fr: 'Technologie Plasma' },
    category: CATEGORIES.COMBAT,
    factor: 2,
    base: {
      metal: 2000, crystal: 4000, deuterium: 1000, energyCost: 0,
    },
  },
  123: {
    ogameId: 123,
    names: { en: 'Intergalactic Research Network', fr: 'Réseau de recherche intergalactique' },
    category: CATEGORIES.ADVANCED,
    factor: 2,
    base: {
      metal: 240000, crystal: 400000, deuterium: 160000, energyCost: 0,
    },
  },
  124: {
    ogameId: 124,
    names: { en: 'Astrophysics', fr: 'Astrophysique' },
    category: CATEGORIES.ADVANCED,
    // Astrophysics is the only technology with a non-integer factor; the game
    // also rounds each level cost up to the nearest hundred.
    factor: 1.75,
    roundTo: 100,
    base: {
      metal: 4000, crystal: 8000, deuterium: 4000, energyCost: 0,
    },
  },
  199: {
    ogameId: 199,
    names: { en: 'Graviton Technology', fr: 'Technologie Graviton' },
    category: CATEGORIES.ADVANCED,
    factor: 3,
    base: {
      metal: 0, crystal: 0, deuterium: 0, energyCost: 300000,
    },
  },
});

export { CATEGORIES };
export default RESEARCH;
