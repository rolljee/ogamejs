import getCost from './cost.js';
import BUILDINGS from './models/buildings.js';
import RESEARCH from './models/research.js';

describe('Building cost should be correctly returned when', () => {
  it('Level 1 is given, which is the base cost', () => {
    expect(getCost(BUILDINGS[14], 1)).toEqual({
      metal: 400, crystal: 120, deuterium: 200, energyCost: 0,
    });
  });

  it('A facility level is given', () => {
    // Robotics factory grows on a factor 2.
    expect(getCost(BUILDINGS[14], 5)).toEqual({
      metal: 6400, crystal: 1920, deuterium: 3200, energyCost: 0,
    });
  });

  it('A storage level is given', () => {
    expect(getCost(BUILDINGS[22], 10)).toEqual({
      metal: 512000, crystal: 0, deuterium: 0, energyCost: 0,
    });
  });

  it('The building really pays energy to be built', () => {
    // The terraformer energy cost grows on the same factor 2 as its resources.
    expect(getCost(BUILDINGS[33], 3)).toEqual({
      metal: 0, crystal: 200000, deuterium: 400000, energyCost: 4000,
    });
  });

  it('The building only consumes energy, and does not pay any to be built', () => {
    // Metal mine level 10 consumes 259 energy but is paid in resources only.
    expect(getCost(BUILDINGS[1], 10).energyCost).toBe(0);
  });

  it('The space dock scales its energy on its own factor', () => {
    expect(getCost(BUILDINGS[36], 2)).toEqual({
      metal: 1000, crystal: 0, deuterium: 250, energyCost: 125,
    });
  });
});

describe('Research cost should be correctly returned when', () => {
  it('A regular technology is given', () => {
    expect(getCost(RESEARCH[113], 4)).toEqual({
      metal: 0, crystal: 6400, deuterium: 3200, energyCost: 0,
    });
  });

  it('Astrophysics is given, which is rounded up to the nearest hundred', () => {
    expect(getCost(RESEARCH[124], 3)).toEqual({
      metal: 12300, crystal: 24500, deuterium: 12300, energyCost: 0,
    });
  });

  it('Graviton technology is given, which only costs energy', () => {
    expect(getCost(RESEARCH[199], 1)).toEqual({
      metal: 0, crystal: 0, deuterium: 0, energyCost: 300000,
    });
  });
});

describe('Cost computation should throw when', () => {
  it('The target level is not a positive integer', () => {
    expect(() => getCost(BUILDINGS[14], 0)).toThrow('targetLevel must be an integer >= 1');
    expect(() => getCost(BUILDINGS[14], 1.5)).toThrow('targetLevel must be an integer >= 1');
  });

  it('A `base` is passed instead of the whole entry', () => {
    expect(() => getCost(BUILDINGS[14].base, 1))
      .toThrow('pass Buildings[id], not Buildings[id].base');
  });

  it('Nothing is passed at all', () => {
    expect(() => getCost(undefined, 1)).toThrow('received nothing');
  });
});
