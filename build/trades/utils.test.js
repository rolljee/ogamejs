
const _utils = _interopRequireDefault(require('./utils'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

test('Giving a NaN should return true', () => {
  const res = (0, _utils.default)([NaN, 10, 11]);
  expect(res).toBe(true);
});
test('Giving good number should return false', () => {
  const res = (0, _utils.default)([15, 10, 11]);
  expect(res).toBe(false);
});
