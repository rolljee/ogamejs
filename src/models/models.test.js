import BUILDINGS from './buildings.js';
import DESTROYABLE, { ATTRIBUTES } from './destroyable.js';
import RESEARCH from './research.js';

const BUILDING_BASE_FIELDS = [
  'metal', 'crystal', 'deuterium',
  'energyCost', 'energyConsumption', 'deuteriumConsumption',
  'production',
];

const RESEARCH_BASE_FIELDS = ['metal', 'crystal', 'deuterium', 'energyCost'];

const entries = (model) => Object.entries(model);

describe('Every building', () => {
  it.each(entries(BUILDINGS))('%s has a complete base', (id, building) => {
    for (const field of BUILDING_BASE_FIELDS) {
      // eslint-disable-next-line security/detect-object-injection -- field is a constant
      expect(building.base[field], `${id}.base.${field}`).toBeTypeOf('number');
    }

    expect(Object.keys(building.base).sort()).toEqual([...BUILDING_BASE_FIELDS].sort());
  });

  it.each(entries(BUILDINGS))('%s has a usable cost factor', (id, building) => {
    expect(building.factor, `${id}.factor`).toBeGreaterThan(1);
  });

  it.each(entries(BUILDINGS))('%s belongs to a known category', (id, building) => {
    expect(['resources', 'facilities', 'moon']).toContain(building.category);
  });

  it('drops the fields 3.x deprecated', () => {
    for (const building of Object.values(BUILDINGS)) {
      expect(building).not.toHaveProperty('name');
      expect(building.base).not.toHaveProperty('deutrium');
      expect(building.base).not.toHaveProperty('energy');
      expect(building.base).not.toHaveProperty('consumption');
    }
  });

  it('only marks the storages as storages', () => {
    const storages = Object.values(BUILDINGS).filter((building) => building.storage);

    expect(storages.map((building) => building.storage).sort())
      .toEqual(['crystal', 'deuterium', 'metal']);
  });

  it('only pays energy to build the terraformer and the space dock', () => {
    const paying = entries(BUILDINGS)
      .filter(([, building]) => building.base.energyCost > 0)
      .map(([id]) => Number(id));

    expect(paying).toEqual([33, 36]);
  });
});

describe('Every technology', () => {
  it.each(entries(RESEARCH))('%s has a complete base', (id, research) => {
    expect(Object.keys(research.base).sort()).toEqual([...RESEARCH_BASE_FIELDS].sort());

    for (const field of RESEARCH_BASE_FIELDS) {
      // eslint-disable-next-line security/detect-object-injection -- field is a constant
      expect(research.base[field], `${id}.base.${field}`).toBeTypeOf('number');
    }
  });

  it.each(entries(RESEARCH))('%s is keyed by its own ogameId', (id, research) => {
    expect(research.ogameId).toBe(Number(id));
  });

  it('costs something to research', () => {
    for (const [id, research] of entries(RESEARCH)) {
      const { metal, crystal, deuterium, energyCost } = research.base;

      expect(metal + crystal + deuterium + energyCost, `${id} is free`).toBeGreaterThan(0);
    }
  });
});

describe('Every ship, defense and missile', () => {
  it.each(entries(DESTROYABLE))('%s has consistent stats', (id, unit) => {
    expect(unit.structure, `${id}.structure`).toBe(unit.cost.metal + unit.cost.crystal);
    expect(unit.shield, `${id}.shield`).toBeTypeOf('number');
    expect(unit.attack, `${id}.attack`).toBeTypeOf('number');
    expect(unit.cargo, `${id}.cargo`).toBeGreaterThanOrEqual(0);
    expect(unit.fuelConsumption, `${id}.fuelConsumption`).toBeGreaterThanOrEqual(0);
  });

  it.each(entries(DESTROYABLE))('%s has a known drive', (id, unit) => {
    expect(Object.values(ATTRIBUTES.DRIVES)).toContain(unit.drive);
  });

  it.each(entries(DESTROYABLE))('%s has a known type and category', (id, unit) => {
    expect(Object.values(ATTRIBUTES.TYPES)).toContain(unit.type);
    expect(Object.values(ATTRIBUTES.CATEGORIES)).toContain(unit.category);
  });

  it('aims its rapid fire at ids that exist', () => {
    for (const [id, unit] of entries(DESTROYABLE)) {
      for (const { target, fire } of unit.rapidFire) {
        expect(DESTROYABLE, `${id} fires at unknown ${target}`).toHaveProperty(String(target));
        expect(fire).toBeGreaterThan(1);
      }
    }
  });

  it('drops the fields 3.x deprecated', () => {
    for (const unit of Object.values(DESTROYABLE)) {
      expect(unit).not.toHaveProperty('name');
      expect(unit).not.toHaveProperty('fret');
      expect(unit).not.toHaveProperty('deutCost');
      expect(unit.cost).not.toHaveProperty('deut');
    }
  });

  it('only gives a drive to something that can move', () => {
    for (const [id, unit] of entries(DESTROYABLE)) {
      const canMove = unit.drive !== ATTRIBUTES.DRIVES.NONE;

      expect(unit.speed > 0, `${id} speed and drive disagree`).toBe(canMove);
    }
  });

  it('puts the missiles in the missile category', () => {
    expect(DESTROYABLE[301].category).toBe(ATTRIBUTES.CATEGORIES.MISSILE);
    expect(DESTROYABLE[302].category).toBe(ATTRIBUTES.CATEGORIES.MISSILE);
  });
});

describe('Across the models', () => {
  it('no two entries share an ogameId', () => {
    for (const model of [BUILDINGS, DESTROYABLE, RESEARCH]) {
      const ids = Object.values(model).map((entry) => entry.ogameId);

      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});
