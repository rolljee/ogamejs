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

describe('Distance should throw when', () => {
  it('A coordinate is missing', () => {
    expect(() => getDistance({ galaxy: 1, system: 1 }, at(1, 1, 1)))
      .toThrow('origin must be a { galaxy, system, position }');
  });

  it('A coordinate is not a positive integer', () => {
    expect(() => getDistance(at(1, 1, 1), at(1, 1, 0)))
      .toThrow('target must be a { galaxy, system, position }');
  });
});
