import { getName, findByName, LANGS } from './i18n.js';
import BUILDINGS from './models/buildings.js';
import DESTROYABLE from './models/destroyable.js';
import RESEARCH from './models/research.js';

const MODELS = { BUILDINGS, DESTROYABLE, RESEARCH };

describe('Every model entry should be translated', () => {
  it.each(Object.entries(MODELS))('%s has a name in every language', (_, model) => {
    for (const [id, entry] of Object.entries(model)) {
      for (const lang of LANGS) {
        // eslint-disable-next-line security/detect-object-injection
        expect(entry.names?.[lang], `${id} is missing its ${lang} name`).toBeTruthy();
      }
    }
  });

  it.each(Object.entries(MODELS))('%s exposes an ogameId', (_, model) => {
    for (const [id, entry] of Object.entries(model)) {
      expect(entry.ogameId, `${id} is missing its ogameId`).toBeTypeOf('number');
    }
  });
});

describe('getName should return', () => {
  it('The English name by default', () => {
    expect(getName(BUILDINGS[1])).toBe('Metal Mine');
    expect(getName(DESTROYABLE[8])).toBe('Deathstar');
    expect(getName(RESEARCH[122])).toBe('Plasma Technology');
  });

  it('The requested language', () => {
    expect(getName(BUILDINGS[1], 'fr')).toBe('Mine de métal');
  });

  it('The English name when the language is unknown', () => {
    expect(getName(BUILDINGS[1], 'de')).toBe('Metal Mine');
  });

  it('An error when the entry is not a model entry', () => {
    expect(() => getName({})).toThrow('entry has no names');
  });
});

describe('findByName should find an entry', () => {
  it('By its English name', () => {
    expect(findByName(BUILDINGS, 'Metal Storage').ogameId).toBe(22);
  });

  it('By its French name', () => {
    expect(findByName(BUILDINGS, 'Hangar de métal').ogameId).toBe(22);
  });

  it('Whatever the case and the accents', () => {
    expect(findByName(DESTROYABLE, 'etoile de la mort').ogameId).toBe(214);
    expect(findByName(RESEARCH, 'ASTROPHYSICS').ogameId).toBe(124);
  });

  it('Or nothing when there is no match', () => {
    expect(findByName(BUILDINGS, 'Kaelesh Sanctuary')).toBeUndefined();
  });
});
