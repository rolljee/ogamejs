import sellDeut from './deut.js';

describe('A deut trade', () => {
  it('Sell 100000 at 50/50 at rate 2:1.5:1', () => {
    const { metal, crystal } = sellDeut(100000, 50, 50, '2:1.5:1');
    expect(metal).toBe(100000);
    expect(crystal).toBe(75000);
  });

  // `4:3:2` is the same rate as `2:1.5:1`; it used to pay twice as much.
  it('Sells the same deut for the same amount at an equivalent rate', () => {
    const { metal, crystal } = sellDeut(100000, 50, 50, '4:3:2');
    expect(metal).toBe(100000);
    expect(crystal).toBe(75000);
  });
});
