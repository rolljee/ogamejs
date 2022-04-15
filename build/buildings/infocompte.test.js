"use strict";

var _infocompte = _interopRequireDefault(require("./infocompte"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('Infocompte informations should be correctly return when', function () {
  it('Version is ', function () {
    var params = "\n      Niveau des mines du joueur Rolljee ( s165-fr ) le 07/04/2020, 16:40:32 :\n\n      Plan\xE8te 01 : M\xE9tal 36 / Cristal 31 / Deut\xE9rium 31 / -94\xB0C\n      Plan\xE8te 02 : M\xE9tal 36 / Cristal 31 / Deut\xE9rium 31 / -95\xB0C\n      Plan\xE8te 03 : M\xE9tal 36 / Cristal 31 / Deut\xE9rium 31 / 56\xB0C\n      Plan\xE8te 04 : M\xE9tal 36 / Cristal 31 / Deut\xE9rium 31 / -118\xB0C\n      Plan\xE8te 05 : M\xE9tal 36 / Cristal 31 / Deut\xE9rium 31 / -122\xB0C\n      Plan\xE8te 06 : M\xE9tal 36 / Cristal 31 / Deut\xE9rium 31 / -97\xB0C\n      Plan\xE8te 07 : M\xE9tal 36 / Cristal 31 / Deut\xE9rium 31 / -96\xB0C\n      Plan\xE8te 08 : M\xE9tal 36 / Cristal 31 / Deut\xE9rium 33 / -108\xB0C\n      Plan\xE8te 09 : M\xE9tal 38 / Cristal 31 / Deut\xE9rium 34 / -103\xB0C\n      Plan\xE8te 10 : M\xE9tal 38 / Cristal 31 / Deut\xE9rium 34 / -76\xB0C\n      Plan\xE8te 11 : M\xE9tal 38 / Cristal 31 / Deut\xE9rium 34 / -116\xB0C\n\n      Points dans les mines de m\xE9tal : 4.832.457\n      Points dans les mines de cristal : 2.807.321\n      Points dans les mines de deut : 3.343.660\n      Points dans les mines : 10.983.438\n      Technologie Plasma : 15\n\n      Par heure : 2.292.692 M\xE9tal / 726.693 Cristal / 718.186 Deut\xE9rium\n\n      Par jour : 55.024.608 M\xE9tal / 17.440.632 Cristal / 17.236.464 Deut\xE9rium\n\n      Par semaine : 385.172.256 M\xE9tal / 122.084.424 Cristal / 120.655.248 Deut\xE9rium\n\n      Export with Infocompte v7.0.10\n    ";
    var response = (0, _infocompte["default"])(params);
    expect(response).toEqual({
      planets: [{
        planet: 'Planète 01',
        metal: '36',
        crystal: '31',
        deut: '31',
        temperature: -94
      }, {
        planet: 'Planète 02',
        metal: '36',
        crystal: '31',
        deut: '31',
        temperature: -95
      }, {
        planet: 'Planète 03',
        metal: '36',
        crystal: '31',
        deut: '31',
        temperature: 56
      }, {
        planet: 'Planète 04',
        metal: '36',
        crystal: '31',
        deut: '31',
        temperature: -118
      }, {
        planet: 'Planète 05',
        metal: '36',
        crystal: '31',
        deut: '31',
        temperature: -122
      }, {
        planet: 'Planète 06',
        metal: '36',
        crystal: '31',
        deut: '31',
        temperature: -97
      }, {
        planet: 'Planète 07',
        metal: '36',
        crystal: '31',
        deut: '31',
        temperature: -96
      }, {
        planet: 'Planète 08',
        metal: '36',
        crystal: '31',
        deut: '33',
        temperature: -108
      }, {
        planet: 'Planète 09',
        metal: '38',
        crystal: '31',
        deut: '34',
        temperature: -103
      }, {
        planet: 'Planète 10',
        metal: '38',
        crystal: '31',
        deut: '34',
        temperature: -76
      }, {
        planet: 'Planète 11',
        metal: '38',
        crystal: '31',
        deut: '34',
        temperature: -116
      }],
      production: {
        hourly: {
          metal: 2292692,
          crystal: 726693,
          deut: 718186
        },
        daily: {
          metal: 55024608,
          crystal: 17440632,
          deut: 17236464
        },
        weekly: {
          metal: 385172256,
          crystal: 122084424,
          deut: 120655248
        }
      },
      points: {
        metal: 4832457,
        crystal: 2807321,
        deut: 3343660,
        total: 10983438
      },
      plasma: 15,
      universe: 165,
      lang: 'fr'
    });
  });
});