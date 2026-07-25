import getResearchTime from './researchTime.js';
import RESEARCH from '../models/research.js';

describe('Research time should be correctly returned when', () => {
  it('A lab level is given', () => {
    // Energy technology level 1 costs 800 crystal and 400 deuterium,
    // so (0 + 800) / (1000 * (1 + 1)) hours.
    expect(getResearchTime(RESEARCH[113], 1, 1)).toBe(1440);
  });

  it('No lab is given, which is the slowest case', () => {
    expect(getResearchTime(RESEARCH[113], 1)).toBe(2880);
  });

  it('The universe research speed is given', () => {
    expect(getResearchTime(RESEARCH[113], 1, 1, 4)).toBe(360);
  });
});
