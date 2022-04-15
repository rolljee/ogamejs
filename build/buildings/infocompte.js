"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function toNumber() {
  var number = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return Number(number.split('.').join(''));
}
/**
 *
 * Return information about the crystal mine given a specific level
 * @param {object} data The infocompte bb-code
 * @returns {Object} The parsed JSON object of infocompte
 */


function parseInfoCompteData(data) {
  var universeDataRe = new RegExp('([0-9]{3}-[a-z]{2})');

  var _data$match$1$split = data.match(universeDataRe)[1].split('-'),
      _data$match$1$split2 = _slicedToArray(_data$match$1$split, 2),
      universe = _data$match$1$split2[0],
      lang = _data$match$1$split2[1]; // eslint-disable-next-line security/detect-unsafe-regex


  var planetsRe = new RegExp('(?:Planète [0-9]+(.+))(?:s+(?:Planète [0-9]+))*', 'g');
  var planets = data.matchAll(planetsRe);
  var metalPointRe = new RegExp('Points dans les mines de métal : (.+)');
  var metalPoint = toNumber(data.match(metalPointRe)[1]);
  var crystalPointRe = new RegExp('Points dans les mines de cristal : (.+)');
  var crystalPoint = toNumber(data.match(crystalPointRe)[1]);
  var deutRe = new RegExp('Points dans les mines de deut : (.+)');
  var deutPoint = toNumber(data.match(deutRe)[1]);
  var plasmaRe = new RegExp('Technologie Plasma : (.+)');
  var plasmaTechLevel = toNumber(data.match(plasmaRe)[1]);
  var hourlyRe = new RegExp('Par heure : (.+)');
  var hourly = data.match(hourlyRe);

  var _hourly$1$split = hourly[1].split('/'),
      _hourly$1$split2 = _slicedToArray(_hourly$1$split, 3),
      hourlyMetal = _hourly$1$split2[0],
      hourlyCristal = _hourly$1$split2[1],
      hourlyDeut = _hourly$1$split2[2];

  var _hourlyMetal$split = hourlyMetal.split(' '),
      _hourlyMetal$split2 = _slicedToArray(_hourlyMetal$split, 1),
      hourlyMetalValue = _hourlyMetal$split2[0];

  var hourlyMetalNumber = toNumber(hourlyMetalValue);

  var _hourlyCristal$split$ = hourlyCristal.split(' ').filter(Boolean),
      _hourlyCristal$split$2 = _slicedToArray(_hourlyCristal$split$, 1),
      hourlyCristalValue = _hourlyCristal$split$2[0];

  var hourlyCristalNumber = toNumber(hourlyCristalValue);

  var _hourlyDeut$split$fil = hourlyDeut.split(' ').filter(Boolean),
      _hourlyDeut$split$fil2 = _slicedToArray(_hourlyDeut$split$fil, 1),
      hourlyDeutValue = _hourlyDeut$split$fil2[0];

  var hourlyDeutNumber = toNumber(hourlyDeutValue);
  var response = {
    planets: [],
    production: {
      hourly: {
        metal: hourlyMetalNumber,
        crystal: hourlyCristalNumber,
        deut: hourlyDeutNumber
      },
      daily: {
        metal: hourlyMetalNumber * 24,
        crystal: hourlyCristalNumber * 24,
        deut: hourlyDeutNumber * 24
      },
      weekly: {
        metal: hourlyMetalNumber * 24 * 7,
        crystal: hourlyCristalNumber * 24 * 7,
        deut: hourlyDeutNumber * 24 * 7
      }
    },
    points: {
      metal: metalPoint,
      crystal: crystalPoint,
      deut: deutPoint,
      total: metalPoint + crystalPoint + deutPoint
    },
    plasma: plasmaTechLevel,
    universe: Number(universe),
    lang: lang
  }; // eslint-disable-next-line no-restricted-syntax

  var _iterator = _createForOfIteratorHelper(planets),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var planet = _step.value;

      var _planet$0$split = planet[0].split('/'),
          _planet$0$split2 = _slicedToArray(_planet$0$split, 4),
          planetMetal = _planet$0$split2[0],
          crystal = _planet$0$split2[1],
          deut = _planet$0$split2[2],
          temperatureText = _planet$0$split2[3];

      var _temperatureText$spli = temperatureText.split('°'),
          _temperatureText$spli2 = _slicedToArray(_temperatureText$spli, 1),
          temperature = _temperatureText$spli2[0];

      var _planetMetal$split = planetMetal.split(':'),
          _planetMetal$split2 = _slicedToArray(_planetMetal$split, 2),
          thePlanet = _planetMetal$split2[0],
          metal = _planetMetal$split2[1];

      response.planets.push({
        planet: thePlanet.trim(),
        metal: metal.trim().split(' ')[1],
        crystal: crystal.trim().split(' ')[1],
        deut: deut.trim().split(' ')[1],
        temperature: Number.parseInt(temperature.trim(), 10)
      });
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return response;
}

var _default = parseInfoCompteData;
exports["default"] = _default;