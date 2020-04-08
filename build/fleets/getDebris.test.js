
const _getDebris = _interopRequireDefault(require('./getDebris'));

const _destroyable = _interopRequireDefault(require('../models/destroyable'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Debris should be correctly return when', () => {
  it('A 10 light fighter crash with 60% in harvest fields', () => {
    const ship = _destroyable.default[1];
    const debris = (0, _getDebris.default)(ship, 10, 0.6);
    expect(debris).toEqual({
      metal: 18000,
      crystal: 6000,
    });
  });
  it('A 10 light fighter crash with 30% in harvest fields', () => {
    const ship = _destroyable.default[1];
    const debris = (0, _getDebris.default)(ship, 10, 0.3);
    expect(debris).toEqual({
      metal: 9000,
      crystal: 3000,
    });
  });
});
