import parseInfoCompteData from './infocompte';

describe('Infocompte informations should be correctly return when', () => {
  it('Version is ', () => {
    const params = `
      Niveau des mines du joueur Rolljee ( s165-fr ) le 07/04/2020, 16:40:32 :

      Planète 01 : Métal 36 / Cristal 31 / Deutérium 31 / -94°C
      Planète 02 : Métal 36 / Cristal 31 / Deutérium 31 / -95°C
      Planète 03 : Métal 36 / Cristal 31 / Deutérium 31 / 56°C
      Planète 04 : Métal 36 / Cristal 31 / Deutérium 31 / -118°C
      Planète 05 : Métal 36 / Cristal 31 / Deutérium 31 / -122°C
      Planète 06 : Métal 36 / Cristal 31 / Deutérium 31 / -97°C
      Planète 07 : Métal 36 / Cristal 31 / Deutérium 31 / -96°C
      Planète 08 : Métal 36 / Cristal 31 / Deutérium 33 / -108°C
      Planète 09 : Métal 38 / Cristal 31 / Deutérium 34 / -103°C
      Planète 10 : Métal 38 / Cristal 31 / Deutérium 34 / -76°C
      Planète 11 : Métal 38 / Cristal 31 / Deutérium 34 / -116°C

      Points dans les mines de métal : 4.832.457
      Points dans les mines de cristal : 2.807.321
      Points dans les mines de deut : 3.343.660
      Points dans les mines : 10.983.438
      Technologie Plasma : 15

      Par heure : 2.292.692 Métal / 726.693 Cristal / 718.186 Deutérium

      Par jour : 55.024.608 Métal / 17.440.632 Cristal / 17.236.464 Deutérium

      Par semaine : 385.172.256 Métal / 122.084.424 Cristal / 120.655.248 Deutérium

      Export with Infocompte v7.0.10
    `;
    const response = parseInfoCompteData(params);
    expect(response).toEqual({
      planets: [
        {
          planet: 'Planète 01', metal: '36', crystal: '31', deut: '31', temperature: -94,
        },
        {
          planet: 'Planète 02', metal: '36', crystal: '31', deut: '31', temperature: -95,
        },
        {
          planet: 'Planète 03', metal: '36', crystal: '31', deut: '31', temperature: 56,
        },
        {
          planet: 'Planète 04', metal: '36', crystal: '31', deut: '31', temperature: -118,
        },
        {
          planet: 'Planète 05', metal: '36', crystal: '31', deut: '31', temperature: -122,
        },
        {
          planet: 'Planète 06', metal: '36', crystal: '31', deut: '31', temperature: -97,
        },
        {
          planet: 'Planète 07', metal: '36', crystal: '31', deut: '31', temperature: -96,
        },
        {
          planet: 'Planète 08', metal: '36', crystal: '31', deut: '33', temperature: -108,
        },
        {
          planet: 'Planète 09', metal: '38', crystal: '31', deut: '34', temperature: -103,
        },
        {
          planet: 'Planète 10', metal: '38', crystal: '31', deut: '34', temperature: -76,
        },
        {
          planet: 'Planète 11', metal: '38', crystal: '31', deut: '34', temperature: -116,
        },
      ],
      production: {
        hourly: { metal: 2292692, crystal: 726693, deut: 718186 },
        daily: { metal: 55024608, crystal: 17440632, deut: 17236464 },
        weekly: { metal: 385172256, crystal: 122084424, deut: 120655248 },
      },
      points: {
        metal: 4832457, crystal: 2807321, deut: 3343660, total: 10983438,
      },
      plasma: 15,
    });
  });
});
