const DEFAULT_LANG = 'en';

const LANGS = Object.freeze(['en', 'fr']);

/**
 *
 * Return the localised name of a model entry
 * @param {{names: import('./types.js').Names}} entry An entry of Buildings, Destroyable or Research
 * @param {import('./types.js').Lang} [lang] 'en' or 'fr', defaults to 'en'
 * @returns {string} The localised name
 */
function getName(entry, lang = DEFAULT_LANG) {
  if (!entry || !entry.names) {
    throw new Error('entry has no names, is it a model entry?');
  }

  // eslint-disable-next-line security/detect-object-injection
  return entry.names[lang] ?? entry.names[DEFAULT_LANG];
}

/**
 *
 * Look an entry up by any of its localised names, case and accent insensitive
 * @param {Record<string|number, {names: import('./types.js').Names}>} model Buildings, Destroyable or Research
 * @param {string} name The name to look for, in any supported language
 * @returns {object|undefined} The matching entry, or undefined
 */
function findByName(model, name) {
  const normalize = (value) => value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()
    .toLowerCase();

  const needle = normalize(name);

  return Object.values(model).find((entry) => LANGS
    // `lang` comes from the LANGS constant, never from the caller.
    // eslint-disable-next-line security/detect-object-injection
    .some((lang) => entry.names?.[lang] && normalize(entry.names[lang]) === needle));
}

export { getName, findByName, LANGS };
