import parseRate from './parseRate.js';

describe('Parse rate given a resource and a rate', () => {
  it('Parse rate by selling deut', () => {
    const res = parseRate('2:1.5:1', 'deut');
    expect(res).toEqual({
      rateMetal: 2,
      rateCrystal: 1.5,
      rateDeut: 1,
    });
  });
  it('Parse rate by selling metal', () => {
    const res = parseRate('2:1.5:1', 'metal');
    expect(res).toEqual({
      rateMetal: 2 / 2,
      rateCrystal: 1.5 / 2,
      rateDeut: 1 / 2,
    });
  });

  it('Parse rate by selling crystal', () => {
    const res = parseRate('2:1.5:1', 'crystal');
    expect(res).toEqual({
      rateMetal: 2 / 1.5,
      rateCrystal: 1.5 / 1.5,
      rateDeut: 1 / 1.5,
    });
  });

  // Normalizing means expressing the other two terms in units of the reference
  // resource, whichever one it is. The deut branch used to read the metal and
  // crystal terms raw, so a rate written against anything but 1 deuterium came
  // back scaled.
  it('Parse rate by selling deut when the deut term is not 1', () => {
    const res = parseRate('4:3:2', 'deut');
    expect(res).toEqual({
      rateMetal: 2,
      rateCrystal: 1.5,
      rateDeut: 1,
    });
  });

  it('Reads equivalent rates identically, whichever resource is sold', () => {
    ['metal', 'crystal', 'deut'].forEach((type) => {
      expect(parseRate('4:3:2', type)).toEqual(parseRate('2:1.5:1', type));
      expect(parseRate('10:7.5:5', type)).toEqual(parseRate('2:1.5:1', type));
    });
  });

  it('Should return an error if rate is not correctly specified', () => {
    try {
      const res = parseRate('3:toto:1');
      expect(res).toBe(true); // explicitly fail since we test the throw
    } catch (e) {
      expect(e).toEqual(new Error('rate not parsed correctly'));
    }
  });
});
