import sellCrystal from './crystal';

describe('A crystal trade', () => {
  it('Sell 100000 at 50/50 at rate 2:1.5:1', () => {
    const { deut, metal } = sellCrystal(100000, 50, 50, '2:1.5:1');
    expect(deut).toBe(33333);
    expect(metal).toBe(66667);
  });
});
