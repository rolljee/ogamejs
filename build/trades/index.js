"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _parseRate = _interopRequireDefault(require("./parseRate"));

var _deut = _interopRequireDefault(require("./deut"));

var _crystal = _interopRequireDefault(require("./crystal"));

var _metal = _interopRequireDefault(require("./metal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Trader = {
  parseRate: _parseRate["default"],
  sellDeut: _deut["default"],
  sellCrystal: _crystal["default"],
  sellMetal: _metal["default"]
};
var _default = Trader;
exports["default"] = _default;