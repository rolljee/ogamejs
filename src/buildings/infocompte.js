function toNumber(number = '') {
  return Number(number.split('.').join(''));
}

/**
 *
 * Return information about the crystal mine given a specific level
 * @param {object} data The infocompte bb-code
 * @returns {Object} The parsed JSON object of infocompte
 */
function parseInfoCompteData(data) {
  const universeDataRe = new RegExp('([0-9]{3}-[a-z]{2})');
  const [universe, lang] = data.match(universeDataRe)[1].split('-');

  // eslint-disable-next-line security/detect-unsafe-regex
  const planetsRe = new RegExp('(?:Planète [0-9]+(.+))(?:s+(?:Planète [0-9]+))*', 'g');
  const planets = data.matchAll(planetsRe);

  const metalPointRe = new RegExp('Points dans les mines de métal : (.+)');
  const metalPoint = toNumber(data.match(metalPointRe)[1]);

  const crystalPointRe = new RegExp('Points dans les mines de cristal : (.+)');
  const crystalPoint = toNumber(data.match(crystalPointRe)[1]);

  const deutRe = new RegExp('Points dans les mines de deut : (.+)');
  const deutPoint = toNumber(data.match(deutRe)[1]);

  const plasmaRe = new RegExp('Technologie Plasma : (.+)');
  const plasmaTechLevel = toNumber(data.match(plasmaRe)[1]);

  const hourlyRe = new RegExp('Par heure : (.+)');
  const hourly = data.match(hourlyRe);

  const [hourlyMetal, hourlyCristal, hourlyDeut] = hourly[1].split('/');

  const [hourlyMetalValue] = hourlyMetal.split(' ');
  const hourlyMetalNumber = toNumber(hourlyMetalValue);

  const [hourlyCristalValue] = hourlyCristal.split(' ').filter(Boolean);
  const hourlyCristalNumber = toNumber(hourlyCristalValue);

  const [hourlyDeutValue] = hourlyDeut.split(' ').filter(Boolean);
  const hourlyDeutNumber = toNumber(hourlyDeutValue);

  const response = {
    planets: [],
    production: {
      hourly: {
        metal: hourlyMetalNumber,
        crystal: hourlyCristalNumber,
        deut: hourlyDeutNumber,
      },
      daily: {
        metal: hourlyMetalNumber * 24,
        crystal: hourlyCristalNumber * 24,
        deut: hourlyDeutNumber * 24,
      },
      weekly: {
        metal: hourlyMetalNumber * 24 * 7,
        crystal: hourlyCristalNumber * 24 * 7,
        deut: hourlyDeutNumber * 24 * 7,
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

  // eslint-disable-next-line no-restricted-syntax
  for (const planet of planets) {
    const [planetMetal, crystal, deut, temperatureText] = planet[0].split('/');
    const [temperature] = temperatureText.split('°');
    const [thePlanet, metal] = planetMetal.split(':');

    response.planets.push({
      planet: thePlanet.trim(),
      metal: metal.trim().split(' ')[1],
      crystal: crystal.trim().split(' ')[1],
      deut: deut.trim().split(' ')[1],
      temperature: Number.parseInt(temperature.trim(), 10),
    });
  }

  return response;
}
export default parseInfoCompteData;
