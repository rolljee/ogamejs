import sellMetal from './metal';

describe('A deut trade', () => {
  it('Sell 100000 at 50/50 at rate 2:1.5:1', () => {
    const { deut, crystal } = sellMetal(100000, 50, 50, '2:1.5:1');
    expect(deut).toBe(25000);
    expect(crystal).toBe(37500);
  });
});
