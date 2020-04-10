"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _crystal = _interopRequireDefault(require("./crystal"));

var _deut = _interopRequireDefault(require("./deut"));

var _metal = _interopRequireDefault(require("./metal"));

var _solarPlant = _interopRequireDefault(require("./solar-plant"));

var _fusionReactor = _interopRequireDefault(require("./fusion-reactor"));

var _infocompte = _interopRequireDefault(require("./infocompte"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Buildings = {
  getCrystalMine: _crystal["default"],
  getDeutSynth: _deut["default"],
  getMetalMine: _metal["default"],
  getSolarPlant: _solarPlant["default"],
  getFusionReactor: _fusionReactor["default"],
  parseInfoCompteData: _infocompte["default"]
};
var _default = Buildings;
exports["default"] = _default;