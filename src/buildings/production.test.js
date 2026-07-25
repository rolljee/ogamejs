import getPlanetProduction, {
  getProductionBonus, BASE_INCOME,
} from './production.js';

describe('Production bonuses should be correctly returned when', () => {
  it('Nothing applies', () => {
    expect(getProductionBonus()).toEqual({ metal: 1, crystal: 1, deuterium: 1 });
  });

  it('Plasma technology is given', () => {
    // 1% metal, 0.66% crystal and 0.33% deuterium per level.
    const bonus = getProductionBonus({ plasmaTech: 15 });
    expect(bonus.metal).toBeCloseTo(1.15);
    expect(bonus.crystal).toBeCloseTo(1.099);
    expect(bonus.deuterium).toBeCloseTo(1.0495);
  });

  it('The geologist and the collector class are given', () => {
    expect(getProductionBonus({ geologist: true, collectorClass: true }))
      .toEqual({ metal: 1.35, crystal: 1.35, deuterium: 1.35 });
  });

  it('Booster items are given per resource', () => {
    const bonus = getProductionBonus({ items: { metal: 0.4, deuterium: 0.1 } });
    expect(bonus.metal).toBeCloseTo(1.4);
    expect(bonus.crystal).toBeCloseTo(1);
    expect(bonus.deuterium).toBeCloseTo(1.1);
  });

  it('Everything applies at once, adding up rather than compounding', () => {
    const bonus = getProductionBonus({
      plasmaTech: 10, geologist: true, collectorClass: true, items: { metal: 0.3 },
    });
    // 1 + 0.10 + 0.1 + 0.25 + 0.3
    expect(bonus.metal).toBeCloseTo(1.75);
  });
});

describe('Production bonuses should throw when', () => {
  it('The plasma level is not a positive integer', () => {
    expect(() => getProductionBonus({ plasmaTech: -1 }))
      .toThrow('plasmaTech must be an integer >= 0');
  });

  it('An item bonus is out of range', () => {
    expect(() => getProductionBonus({ items: { metal: 2 } }))
      .toThrow('items.metal must be a number between 0 and 1');
  });
});

describe('Planet production should be correctly returned when', () => {
  const planet = {
    metalMine: 30, crystalMine: 25, deutSynth: 22, position: 8, temperature: -20,
  };

  it('No bonus applies', () => {
    const production = getPlanetProduction(planet);

    // The flat planet income is added on top and no bonus applies to it.
    expect(production.metal).toBe(15704 + BASE_INCOME.metal);
    expect(production.crystal).toBe(5417 + BASE_INCOME.crystal);
    expect(production.deuterium).toBe(2578 + BASE_INCOME.deuterium);
  });

  it('The universe is faster', () => {
    const slow = getPlanetProduction(planet);
    const fast = getPlanetProduction({ ...planet, universeSpeed: 5 });

    // Mines scale with the universe speed, and so does the flat income. The
    // mine output is floored once at the end, so this is not exactly five times
    // the slow figure.
    expect(fast.metal).toBe(78672);
    expect(fast.metal).toBeCloseTo(slow.metal * 5, -1);
  });

  it('Bonuses apply', () => {
    const plain = getPlanetProduction(planet);
    const boosted = getPlanetProduction(planet, { plasmaTech: 15, geologist: true });

    expect(boosted.metal).toBeGreaterThan(plain.metal);
    expect(boosted.bonus.metal).toBeCloseTo(1.25);
  });

  it('A mine is not built yet', () => {
    const production = getPlanetProduction({ ...planet, deutSynth: 0 });

    expect(production.deuterium).toBe(BASE_INCOME.deuterium);
  });

  it('The planet is short on energy', () => {
    const full = getPlanetProduction(planet);
    const half = getPlanetProduction({ ...planet, energyEfficiency: 0.5 });

    expect(half.metal - BASE_INCOME.metal)
      .toBe(Math.floor((full.metal - BASE_INCOME.metal) / 2));
  });

  it('The energy the mines need is reported', () => {
    expect(getPlanetProduction(planet).energyConsumption).toBeGreaterThan(0);
  });

  it('A mine level is negative', () => {
    expect(() => getPlanetProduction({ ...planet, crystalMine: -1 }))
      .toThrow('crystalMine must be an integer >= 0');
  });

  it('The energy efficiency is out of range', () => {
    expect(() => getPlanetProduction({ ...planet, energyEfficiency: 1.5 }))
      .toThrow('energyEfficiency must be a number between 0 and 1');
  });
});
