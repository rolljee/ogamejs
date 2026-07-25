/**
 * Labels used by the Infocompte export, per game language.
 *
 * The French set is the reference one; the others are best effort. A locale can
 * be overridden per call through the `labels` option, so an unsupported
 * language does not require a release.
 */
const LOCALES = Object.freeze({
  fr: {
    planet: 'Planète',
    metalPoints: 'Points dans les mines de métal',
    crystalPoints: 'Points dans les mines de cristal',
    deutPoints: 'Points dans les mines de deut',
    plasma: 'Technologie Plasma',
    hourly: 'Par heure',
  },
  en: {
    planet: 'Planet',
    metalPoints: 'Points in metal mines',
    crystalPoints: 'Points in crystal mines',
    deutPoints: 'Points in deut mines',
    plasma: 'Plasma Technology',
    hourly: 'Per hour',
  },
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Infocompte groups thousands with dots, spaces or non breaking spaces.
function toNumber(value = '') {
  return Number(String(value).replace(/[^\d-]/g, ''));
}

function matchOne(data, label, what) {
  // The label is escaped just above, so it cannot inject a pattern.
  // eslint-disable-next-line security/detect-non-literal-regexp
  const match = data.match(new RegExp(`${escapeRegExp(label)}\\s*:\\s*(.+)`));

  if (!match) {
    throw new Error(`could not find ${what} in the report, is the language supported?`);
  }

  return match[1];
}

function parseTriplet(line, what) {
  // Digits, plus the dot, space, non breaking space and narrow no-break space
  // Infocompte may use as a thousands separator.
  const numbers = line.match(/\d[\d.\u0020\u00A0\u202F]*/g);

  if (!numbers || numbers.length < 3) {
    throw new Error(`could not parse ${what} in the report`);
  }

  return numbers.slice(0, 3).map(toNumber);
}

function parsePlanets(data, labels) {
  // Matches `Planète 01 : Métal 36 / Cristal 31 / Deutérium 31 / -94°C` without
  // depending on the resource names, only on the shape of the line.
  // eslint-disable-next-line security/detect-non-literal-regexp
  const planetRe = new RegExp(
    `^[^\\S\\n]*(${escapeRegExp(labels.planet)}\\s+\\d+)\\s*:`
    + '[^\\d]*(\\d+)\\s*/[^\\d-]*(\\d+)\\s*/[^\\d-]*(\\d+)\\s*/\\s*(-?\\d+)\\s*°',
    'gm',
  );

  return [...data.matchAll(planetRe)].map(([, planet, metal, crystal, deut, temperature]) => ({
    planet: planet.trim(),
    metal: Number(metal),
    crystal: Number(crystal),
    deut: Number(deut),
    temperature: Number(temperature),
  }));
}

/**
 *
 * Parse the BBCode of an Infocompte report into a structured object
 * @param {string} data The infocompte bb-code
 * @param {object} [options] Parsing options
 * @param {string} [options.locale] Force a locale instead of reading it from the report
 * @param {object} [options.labels] Override the labels, see LOCALES for the shape
 * @returns {Object} The parsed JSON object of infocompte
 */
function parseInfoCompteData(data, options = {}) {
  if (typeof data !== 'string' || data.trim() === '') {
    throw new Error('data must be a non empty string');
  }

  const universeData = data.match(/([0-9]{3}-[a-z]{2})/);

  if (!universeData) {
    throw new Error('could not find the universe and language header in the report');
  }

  const [universe, lang] = universeData[1].split('-');
  const locale = options.locale ?? lang;
  // eslint-disable-next-line security/detect-object-injection
  const knownLocale = Object.hasOwn(LOCALES, locale) ? LOCALES[locale] : undefined;
  const labels = options.labels ?? knownLocale ?? LOCALES.fr;

  const metalPoint = toNumber(matchOne(data, labels.metalPoints, 'the metal mine points'));
  const crystalPoint = toNumber(matchOne(data, labels.crystalPoints, 'the crystal mine points'));
  const deutPoint = toNumber(matchOne(data, labels.deutPoints, 'the deuterium mine points'));
  const plasmaTechLevel = toNumber(matchOne(data, labels.plasma, 'the plasma technology level'));

  const [hourlyMetal, hourlyCrystal, hourlyDeut] = parseTriplet(
    matchOne(data, labels.hourly, 'the hourly production'),
    'the hourly production',
  );

  const perDay = 24;
  const perWeek = 24 * 7;

  return {
    planets: parsePlanets(data, labels),
    production: {
      hourly: {
        metal: hourlyMetal,
        crystal: hourlyCrystal,
        deut: hourlyDeut,
      },
      daily: {
        metal: hourlyMetal * perDay,
        crystal: hourlyCrystal * perDay,
        deut: hourlyDeut * perDay,
      },
      weekly: {
        metal: hourlyMetal * perWeek,
        crystal: hourlyCrystal * perWeek,
        deut: hourlyDeut * perWeek,
      },
    },
    points: {
      metal: metalPoint,
      crystal: crystalPoint,
      deut: deutPoint,
      total: metalPoint + crystalPoint + deutPoint,
    },
    plasma: plasmaTechLevel,
    universe: Number(universe),
    lang,
  };
}

export { LOCALES };
export default parseInfoCompteData;
