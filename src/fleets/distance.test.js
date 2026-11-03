import getDistance from './distance.js';

const at = (galaxy, system, position) => ({ galaxy, system, position });

describe('Distance should be correctly returned when', () => {
  it('The galaxies differ', () => {
    expect(getDistance(at(1, 1, 1), at(4, 1, 1))).toBe(60000);
    expect(getDistance(at(4, 1, 1), at(1, 1, 1))).toBe(60000);
  });

  it('Only the systems differ', () => {
    expect(getDistance(at(1, 1, 1), at(1, 1, 1))).toBe(5);
    expect(getDistance(at(1, 1, 1), at(1, 51, 1))).toBe(2700 + 95 * 50);
  });

  it('Only the positions differ', () => {
    expect(getDistance(at(1, 1, 1), at(1, 1, 2))).toBe(1005);
    expect(getDistance(at(1, 1, 1), at(1, 1, 15))).toBe(1070);
  });

  it('Origin and target are the same planet', () => {
    expect(getDistance(at(2, 30, 8), at(2, 30, 8))).toBe(5);
  });
});

describe('Distance in a donut universe should be correctly returned when', () => {
  const donut = {
    galaxies: 6, systems: 499, donutGalaxy: true, donutSystem: true,
  };

  it('The way round the edge is shorter', () => {
    expect(getDistance(at(1, 1, 1), at(6, 1, 1), donut)).toBe(20000);
    expect(getDistance(at(2, 1, 1), at(2, 499, 1), donut)).toBe(2700 + 95);
    expect(getDistance(at(2, 480, 1), at(2, 10, 1), donut)).toBe(2700 + 95 * 29);
  });

  it('The direct way is still the shorter one', () => {
    expect(getDistance(at(1, 1, 1), at(3, 1, 1), donut)).toBe(40000);
    expect(getDistance(at(2, 100, 1), at(2, 106, 1), donut)).toBe(2700 + 95 * 6);
  });

  it('Only the galaxies wrap', () => {
    const shape = { galaxies: 6, systems: 499, donutGalaxy: true };

    expect(getDistance(at(1, 1, 1), at(6, 1, 1), shape)).toBe(20000);
    expect(getDistance(at(2, 1, 1), at(2, 499, 1), shape)).toBe(2700 + 95 * 498);
  });
});

describe('Distance should throw when', () => {
  it('A donut universe comes without its size', () => {
    expect(() => getDistance(at(1, 1, 1), at(6, 1, 1), { donutGalaxy: true }))
      .toThrow('a donut universe needs its size');
  });

  it('A coordinate is missing', () => {
    expect(() => getDistance({ galaxy: 1, system: 1 }, at(1, 1, 1)))
      .toThrow('origin must be a { galaxy, system, position }');
  });

  it('A coordinate is not a positive integer', () => {
    expect(() => getDistance(at(1, 1, 1), at(1, 1, 0)))
      .toThrow('target must be a { galaxy, system, position }');
  });
});
