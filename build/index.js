"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _trades = _interopRequireDefault(require("./trades"));

var _buildings = _interopRequireDefault(require("./buildings"));

var _fleets = _interopRequireDefault(require("./fleets"));

var _buildings2 = _interopRequireDefault(require("./models/buildings"));

var _destroyable = _interopRequireDefault(require("./models/destroyable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Ogame = {
  Trader: _trades["default"],
  Building: _buildings["default"],
  Fleets: _fleets["default"],
  models: {
    Buildings: _buildings2["default"],
    Destroyable: _destroyable["default"]
  }
};
var _default = Ogame;
exports["default"] = _default;