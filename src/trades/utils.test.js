import isUsableRate from './utils.js';

describe('Test the usable rate check', () => {
  it('Giving good numbers should return true', () => {
    expect(isUsableRate([15, 10, 11])).toBe(true);
    expect(isUsableRate([2, 1.5, 1])).toBe(true);
  });

  it('Giving a NaN should return false', () => {
    expect(isUsableRate([NaN, 10, 11])).toBe(false);
  });

  // What a `0` term turns into once another term is divided by it.
  it('Giving an Infinity should return false', () => {
    expect(isUsableRate([Infinity, 10, 11])).toBe(false);
    expect(isUsableRate([-Infinity, 10, 11])).toBe(false);
  });

  // What an empty term (`'2::1'`) parses to.
  it('Giving a zero should return false', () => {
    expect(isUsableRate([0, 10, 11])).toBe(false);
  });

  it('Giving a negative number should return false', () => {
    expect(isUsableRate([-2, 10, 11])).toBe(false);
  });
});
