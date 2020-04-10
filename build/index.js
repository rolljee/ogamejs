"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _trades = _interopRequireDefault(require("./trades"));

var _buildings = _interopRequireDefault(require("./buildings"));

var _fleets = _interopRequireDefault(require("./fleets"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Ogame = {
  Trader: _trades["default"],
  Building: _buildings["default"],
  Fleets: _fleets["default"]
};
var _default = Ogame;
exports["default"] = _default;