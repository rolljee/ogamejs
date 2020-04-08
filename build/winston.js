Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

const _winston = _interopRequireDefault(require('winston'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const _default = _winston.default.createLogger({
  transports: [new _winston.default.transports.Console({
    format: _winston.default.format.simple(),
  })],
});

exports.default = _default;
