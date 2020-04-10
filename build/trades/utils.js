"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = hasNaN;

function hasNaN(args) {
  var response = false;
  args.forEach(function (val) {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(val)) {
      response = true;
    }
  });
  return response;
}