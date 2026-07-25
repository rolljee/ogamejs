import getStorage, { getStorageCapacity, getStorageLevelFor } from './storage.js';
import BUILDINGS from '../models/buildings.js';

describe('Storage capacity should be correctly returned when', () => {
  it('Level 0 is given, which is the free capacity of every planet', () => {
    expect(getStorageCapacity(0)).toBe(10000);
  });

  it('The first levels are given', () => {
    expect(getStorageCapacity(1)).toBe(20000);
    expect(getStorageCapacity(2)).toBe(40000);
    expect(getStorageCapacity(3)).toBe(75000);
  });

  it('A high level is given', () => {
    expect(getStorageCapacity(20)).toBe(2296600000);
  });

  it('The level is not a positive integer', () => {
    expect(() => getStorageCapacity(-1)).toThrow('level must be an integer >= 0');
  });
});

describe('Storage should be correctly returned when', () => {
  it('A metal storage level is given', () => {
    expect(getStorage(BUILDINGS[22], 1)).toEqual({
      metal: 1000, crystal: 0, deuterium: 0, energyCost: 0, capacity: 20000,
    });
  });

  it('A deuterium tank level is given', () => {
    expect(getStorage(BUILDINGS[24], 4)).toEqual({
      metal: 8000, crystal: 8000, deuterium: 0, energyCost: 0, capacity: 140000,
    });
  });

  it('The building is not a storage', () => {
    expect(() => getStorage(BUILDINGS[1], 1)).toThrow('must be a storage building entry');
  });
});

describe('The required storage level should be returned when', () => {
  it('An amount fits the free capacity', () => {
    expect(getStorageLevelFor(10000)).toBe(0);
  });

  it('An amount needs a few levels', () => {
    expect(getStorageLevelFor(10001)).toBe(1);
    expect(getStorageLevelFor(75000)).toBe(3);
    expect(getStorageLevelFor(75001)).toBe(4);
  });

  it('The amount is not a positive number', () => {
    expect(() => getStorageLevelFor(-1)).toThrow('amount must be a positive number');
  });
});
