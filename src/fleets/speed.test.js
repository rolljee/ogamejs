import getShipSpeed, { getActiveDrive, getFleetSpeed } from './speed.js';
import DESTROYABLE, { ATTRIBUTES } from '../models/destroyable.js';

const { DRIVES } = ATTRIBUTES;

describe('Ship speed should be correctly returned when', () => {
  it('No drive is researched', () => {
    expect(getShipSpeed(DESTROYABLE[1])).toBe(12500);
  });

  it('The combustion drive adds 10% of the base speed per level', () => {
    expect(getShipSpeed(DESTROYABLE[1], { combustion: 10 })).toBe(25000);
  });

  it('The impulse drive adds 20% per level', () => {
    expect(getShipSpeed(DESTROYABLE[3], { impulse: 5 })).toBe(30000);
  });

  it('The hyperspace drive adds 30% per level', () => {
    expect(getShipSpeed(DESTROYABLE[7], { hyperspace: 10 })).toBe(20000);
  });

  it('Only the drive the ship actually uses counts', () => {
    // The light fighter flies on combustion, hyperspace does nothing for it.
    expect(getShipSpeed(DESTROYABLE[1], { hyperspace: 20 })).toBe(12500);
  });

  it('A ship with no drive at all is given', () => {
    expect(getShipSpeed(DESTROYABLE[16], { combustion: 20 })).toBe(0);
  });
});

describe('Drive upgrades should be handled when', () => {
  it('The small cargo has not reached impulse 5 yet', () => {
    const drive = getActiveDrive(DESTROYABLE[11], { combustion: 6, impulse: 4 });

    expect(drive.drive).toBe(DRIVES.COMBUSTION);
    expect(drive.speed).toBe(8000);
    expect(drive.fuelConsumption).toBe(10);
  });

  it('The small cargo reaches impulse 5 and switches drive', () => {
    // Only the three fields the caller cares about come back, never the
    // `minLevel` of the upgrade that happened to win.
    expect(getActiveDrive(DESTROYABLE[11], { combustion: 6, impulse: 5 })).toEqual({
      drive: DRIVES.IMPULSE,
      speed: 20000,
      fuelConsumption: 20,
    });
  });

  it('A ship could use two upgrades and takes the fastest', () => {
    const drive = getActiveDrive(DESTROYABLE[14], { impulse: 17, hyperspace: 15 });

    expect(drive.drive).toBe(DRIVES.HYPERSPACE);
    expect(drive.speed).toBe(6000 * (1 + 0.3 * 15));
  });

  it('The upgrade is only worth it once the new drive is high enough', () => {
    // Combustion 20 gives the recycler 6000, better than impulse 17 at 4000 x 4.4.
    const drive = getActiveDrive(DESTROYABLE[14], { combustion: 20, impulse: 3 });

    expect(drive.drive).toBe(DRIVES.COMBUSTION);
    expect(drive.speed).toBe(6000);
  });
});

describe('Fleet speed should be correctly returned when', () => {
  it('The fleet is mixed, taking the speed of its slowest ship', () => {
    const fleet = [
      { ship: DESTROYABLE[1], count: 100 },
      { ship: DESTROYABLE[8], count: 1 },
    ];

    // The deathstar sets the pace.
    expect(getFleetSpeed(fleet, { combustion: 10, hyperspace: 10 })).toBe(400);
  });

  it('A ship is present with a count of zero', () => {
    const fleet = [
      { ship: DESTROYABLE[1], count: 100 },
      { ship: DESTROYABLE[8], count: 0 },
    ];

    expect(getFleetSpeed(fleet, { combustion: 10, hyperspace: 10 })).toBe(25000);
  });
});

describe('Speed computation should throw when', () => {
  it('The ship is not a model entry', () => {
    expect(() => getShipSpeed({})).toThrow('expected an entry of models/destroyable.js');
  });

  it('A drive level is not a positive integer', () => {
    expect(() => getShipSpeed(DESTROYABLE[1], { combustion: -1 }))
      .toThrow('drives.combustion must be an integer >= 0');
  });

  it('The fleet is empty', () => {
    expect(() => getFleetSpeed([])).toThrow('fleet must be a non empty array');
  });

  it('Every ship in the fleet has a count of zero', () => {
    expect(() => getFleetSpeed([{ ship: DESTROYABLE[1], count: 0 }]))
      .toThrow('fleet must hold at least one ship with a count above 0');
  });
});
