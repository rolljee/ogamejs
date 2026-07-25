import getBuildTime from './buildTime.js';
import BUILDINGS from '../models/buildings.js';

describe('Build time should be correctly returned when', () => {
  it('No robotics factory and no nanite factory are given', () => {
    // (400 + 120) / 2500 hours
    expect(getBuildTime(BUILDINGS[14], 1)).toBe(749);
  });

  it('A robotics factory halves the time at level 1', () => {
    expect(getBuildTime(BUILDINGS[14], 1, 1)).toBe(374);
  });

  it('A nanite factory halves the time per level', () => {
    expect(getBuildTime(BUILDINGS[14], 1, 0, 2)).toBe(187);
  });

  it('The universe economy speed is given', () => {
    expect(getBuildTime(BUILDINGS[14], 1, 0, 0, 5)).toBe(150);
  });
});
