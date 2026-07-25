import { getFlightTime, getFuelConsumption, getTrip } from './flight.js';
import DESTROYABLE from '../models/destroyable.js';

const at = (galaxy, system, position) => ({ galaxy, system, position });

describe('Flight time should be correctly returned when', () => {
  it('The fleet flies at full speed', () => {
    // 10 + 350 * sqrt(10050 / 20000)
    expect(getFlightTime(1005, 20000)).toBe(258);
  });

  it('The fleet slows down to 10%', () => {
    expect(getFlightTime(1005, 20000, 10)).toBe(2491);
  });

  it('The universe has a fleet speed of its own', () => {
    expect(getFlightTime(1005, 20000, 100, 5)).toBe(52);
  });
});

describe('Fuel consumption should be correctly returned when', () => {
  const oneFighter = [{ ship: DESTROYABLE[1], count: 1 }];

  it('One ship flies at full speed', () => {
    // 1 + round(20 * 1005 / 35000 * (1 + 1) ** 2)
    expect(getFuelConsumption(oneFighter, 1005)).toBe(3);
  });

  it('Slowing down burns less fuel', () => {
    expect(getFuelConsumption(oneFighter, 1005, 10)).toBe(2);
  });

  it('A ship that switched drive burns more', () => {
    const cargo = [{ ship: DESTROYABLE[11], count: 100 }];

    expect(getFuelConsumption(cargo, 7355, 100, { impulse: 5 }))
      .toBeGreaterThan(getFuelConsumption(cargo, 7355, 100, { impulse: 4 }));
  });
});

describe('A trip should be correctly described when', () => {
  const fleet = [{ ship: DESTROYABLE[12], count: 100 }];

  it('A one way trip is given', () => {
    const trip = getTrip(fleet, at(1, 1, 1), at(1, 50, 8), {
      drives: { combustion: 12 },
    });

    expect(trip).toEqual({
      distance: 7355,
      fleetSpeed: 16500,
      duration: 749,
      fuel: 4204,
      cargo: 2500000,
      cargoAfterFuel: 2495796,
    });
  });

  it('A round trip is given', () => {
    const oneWay = getTrip(fleet, at(1, 1, 1), at(1, 50, 8), { drives: { combustion: 12 } });
    const roundTrip = getTrip(fleet, at(1, 1, 1), at(1, 50, 8), {
      drives: { combustion: 12 }, roundTrip: true,
    });

    expect(roundTrip.duration).toBe(oneWay.duration * 2);
    expect(roundTrip.fuel).toBe(oneWay.fuel * 2);
  });

  it('The fuel eats into the cargo hold', () => {
    // A colony ship burns far more than its own hold can carry over 8 galaxies.
    const trip = getTrip([{ ship: DESTROYABLE[13], count: 1 }], at(1, 1, 1), at(9, 1, 1));

    expect(trip.fuel).toBeGreaterThan(trip.cargo);
    expect(trip.cargoAfterFuel).toBe(0);
  });
});

describe('Flight computation should throw when', () => {
  it('The speed percentage is out of range', () => {
    expect(() => getFlightTime(1005, 20000, 0)).toThrow('speedPercent must be between 1 and 100');
    expect(() => getFlightTime(1005, 20000, 150)).toThrow('speedPercent must be between 1 and 100');
  });

  it('The fleet has no speed', () => {
    expect(() => getFlightTime(1005, 0)).toThrow('fleetSpeed must be greater than 0');
  });

  it('The fleet is empty', () => {
    expect(() => getFuelConsumption([], 1005)).toThrow('fleet must be a non empty array');
  });
});
