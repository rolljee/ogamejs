# ogamejs

A small, dependency-free JavaScript library that reproduces [OGame](https://gameforge.com/en-GB/play/ogame)'s formulas: building and research costs, production and bonuses, build and research times, storage capacity, flight times and fuel, combat, and the marketplace exchange rates.

It ships only the math — no UI, no state, no network — so you can build your own calculator, bot, or dashboard on top of it.

## Requirements

- **Node.js >= 24**
- The package is **ESM-only** (use `import`, not `require`)
- TypeScript declarations are bundled; no `@types` package needed

## Installation

```bash
npm install ogamejs
```

> Upgrading from 3.x? See [MIGRATION.md](./MIGRATION.md) — 4.0 renames several model fields and changes the calculator signatures.

## Quick start

```javascript
import Ogame from 'ogamejs';

const { Buildings, Destroyable, Research } = Ogame.models;

// A level 10 metal mine on a x5 universe
Ogame.Building.getMetalMine(Buildings[1], 10, 5);
// → { metal: 2306, crystal: 576, deuterium: 0, energyCost: 0,
//     energyConsumption: 259, deuteriumConsumption: 0, production: 3890 }

// What a whole planet actually makes per hour
Ogame.Building.getPlanetProduction(
  { metalMine: 30, crystalMine: 26, deutSynth: 24, position: 8, temperature: -23, universeSpeed: 6 },
  { plasmaTech: 15, geologist: true },
);
// → { metal: 117962, crystal: 44673, deuterium: 23668, energyConsumption: 13059, bonus: {...} }

// A raid: how long, and how much deuterium
Ogame.Fleets.getTrip(
  [{ ship: Destroyable[12], count: 250 }, { ship: Destroyable[9], count: 40 }],
  { galaxy: 1, system: 1, position: 8 },
  { galaxy: 3, system: 42, position: 6 },
  { drives: { combustion: 16, hyperspace: 12 } },
);
// → { distance: 40000, fleetSpeed: 19500, duration: 1595, fuel: 258287,
//     cargo: 6650000, cargoAfterFuel: 6391713 }

// And how it would go
Ogame.Fleets.simulateCombat(
  { fleet: [{ ship: Destroyable[1], count: 500 }], techs: { weapons: 14, shielding: 12, armour: 15 } },
  { fleet: [{ ship: Destroyable[201], count: 200 }], techs: { weapons: 10 } },
  { seed: 42 },
);
// → { winner: 'attacker', rounds: 3, seed: 42, attacker: {...}, defender: {...}, debris: {...} }

// Sell 10 000 deuterium at the default 2:1.5:1 rate
Ogame.Trader.sellDeut(10000);
// → { metal: 12000, crystal: 6000 }
```

`Ogame` is the default export and exposes these namespaces:

| Namespace        | Purpose                                                        |
| ---------------- | -------------------------------------------------------------- |
| `Ogame.Building` | Building costs, production, build times, storage               |
| `Ogame.Research` | Technology costs and research times                            |
| `Ogame.Fleets`   | Distance, speed, flight time, fuel, debris, combat             |
| `Ogame.Trader`   | Marketplace exchange helpers                                   |
| `Ogame.i18n`     | Localised names (`getName`, `findByName`)                      |
| `Ogame.models`   | Reference data (`Buildings`, `Destroyable`, `Research`)         |

Each namespace is also importable on its own:

```javascript
import Building from 'ogamejs/buildings';
import Fleets from 'ogamejs/fleets';
import Research from 'ogamejs/research';
import Trader from 'ogamejs/trades';
import BUILDINGS from 'ogamejs/models/buildings';
import { getName } from 'ogamejs/i18n';
```

## Conventions

A few rules hold across the whole library, so you rarely have to check the docs twice.

**Calculators take a model entry**, never its `base`. `getMetalMine(Buildings[1], 10)`, not `Buildings[1].base` — the entry carries the cost `factor` the calculator needs.

**Levels start at 1.** A cost is the cost *of* that level, not the sum up to it. Anything below 1 throws.

**Energy and deuterium flows are named after what they are.** No field means two things depending on the building:

| Field                  | Meaning                                        |
| ---------------------- | ---------------------------------------------- |
| `metal`/`crystal`/`deuterium` | Resources paid to build it              |
| `energyCost`           | Energy paid to build it (Terraformer, Space Dock, Graviton) |
| `energyConsumption`    | Energy it consumes once built (the mines)      |
| `deuteriumConsumption` | Deuterium it burns once built (Fusion Reactor) |
| `production`           | What it produces, resources or energy          |

**Every building calculator returns the same seven fields**, `0` where one does not apply. So you can read `production` off a result without knowing which building produced it.

**Times are in seconds**, production is per hour.

## API reference

### `Ogame.Building`

#### `getMetalMine(building, targetLevel, universeSpeed = 1)`

```javascript
Ogame.Building.getMetalMine(Ogame.models.Buildings[1], 10, 5);
// → { metal: 2306, crystal: 576, deuterium: 0, energyCost: 0,
//     energyConsumption: 259, deuteriumConsumption: 0, production: 3890 }
```

#### `getCrystalMine(building, targetLevel, pos, universeSpeed = 1)`

`pos` is the planet position; 1, 2 and 3 produce 30%, 22.5% and 15% more crystal.

```javascript
Ogame.Building.getCrystalMine(Ogame.models.Buildings[2], 10, 1, 5);
// → { ..., energyConsumption: 259, production: 3371 }
```

#### `getDeutSynth(building, targetLevel, avg, universeSpeed = 1)`

`avg` is the planet's average temperature — the colder the planet, the more deuterium.

```javascript
Ogame.Building.getDeutSynth(Ogame.models.Buildings[3], 10, 40, 5);
// → { ..., energyConsumption: 518, production: 1554 }
```

#### `getSolarPlant(building, targetLevel)`

```javascript
Ogame.Building.getSolarPlant(Ogame.models.Buildings[4], 10);
// → { ..., production: 518 }   // production is energy here
```

#### `getFusionReactor(building, targetLevel, energyTech, universeSpeed = 1)`

`production` is the energy delivered, `deuteriumConsumption` the deuterium burned per hour.

```javascript
Ogame.Building.getFusionReactor(Ogame.models.Buildings[5], 10, 12, 5);
// → { metal: 178523, crystal: 71409, deuterium: 35704, energyCost: 0,
//     energyConsumption: 0, deuteriumConsumption: 1296, production: 1442 }
```

#### `getBuildingCost(entry, targetLevel)`

Cost of **any** building at a given level, from its `factor`. Also accepts `Research` entries — `Ogame.Research.getResearchCost` is this very function.

```javascript
Ogame.Building.getBuildingCost(Ogame.models.Buildings[21], 12); // Shipyard
// → { metal: 819200, crystal: 409600, deuterium: 204800, energyCost: 0 }
```

#### `getBuildTime(building, targetLevel, roboticsLevel = 0, naniteLevel = 0, universeSpeed = 1)`

`(metal + crystal) / (2500 × (1 + robotics) × 2 ** nanites)` hours, divided by the universe economy speed.

```javascript
Ogame.Building.getBuildTime(Ogame.models.Buildings[15], 4, 10, 3, 6); // Nanite factory
// → 32727
```

#### `getStorage(storage, targetLevel)`

Cost **and** capacity of a storage building (`Buildings[22]`, `[23]` or `[24]`).

```javascript
Ogame.Building.getStorage(Ogame.models.Buildings[22], 12);
// → { metal: 2048000, crystal: 0, deuterium: 0, energyCost: 0, capacity: 18005000 }
```

#### `getStorageCapacity(level)` / `getStorageLevelFor(amount)`

`5000 × ⌊2.5 × e^(20 × level / 33)⌋`, and its inverse.

```javascript
Ogame.Building.getStorageCapacity(0);         // → 10000, the free capacity
Ogame.Building.getStorageLevelFor(1_000_000); // → 8
```

#### `getProductionBonus(options = {})`

The multiplier each resource gets. Bonuses **add up**, they do not compound.

```javascript
Ogame.Building.getProductionBonus({
  plasmaTech: 15,       // +1% metal, +0.66% crystal, +0.33% deuterium per level
  geologist: true,      // +10% on all three
  collectorClass: true, // +25% on all three
  items: { metal: 0.3 },// booster items, as fractions
});
// → { metal: 1.8, crystal: 1.449, deuterium: 1.3995 }
```

#### `getPlanetProduction(planet, bonuses = {})`

The hourly production of a whole planet: raw mine output, then the bonuses, then the flat planet income (30 metal and 15 crystal per hour × universe speed) which no bonus touches.

```javascript
Ogame.Building.getPlanetProduction(
  { metalMine: 30, crystalMine: 26, deutSynth: 24, position: 8, temperature: -23, universeSpeed: 6 },
  { plasmaTech: 15, geologist: true },
);
// → { metal: 117962, crystal: 44673, deuterium: 23668,
//     energyConsumption: 13059, bonus: { metal: 1.25, ... } }
```

A mine at level 0 simply produces nothing. Pass `energyEfficiency` (0 to 1) to model a planet running in an energy deficit — `energyConsumption` tells you what the mines ask for, so you can work it out against your plants.

#### `parseInfoCompteData(data, options = {})`

Parses the BBCode of an OGame "infocompte" report. The language comes from the `s165-fr` header.

```javascript
const report = Ogame.Building.parseInfoCompteData(bbcodeString);
// → {
//   planets: [{ planet: 'Planète 01', metal: 36, crystal: 31, deut: 31, temperature: -94 }, ...],
//   production: { hourly: {...}, daily: {...}, weekly: {...} },
//   points: { metal, crystal, deut, total },
//   plasma: Number, universe: Number, lang: String,
// }
```

French is the reference language; English is best effort. For anything else, pass your own labels — see `LOCALES` in [`src/buildings/infocompte.js`](./src/buildings/infocompte.js):

```javascript
Ogame.Building.parseInfoCompteData(bbcode, { locale: 'fr' });
Ogame.Building.parseInfoCompteData(bbcode, { labels: { planet: 'Planet', /* ... */ } });
```

### `Ogame.Research`

#### `getResearchCost(research, targetLevel)`

```javascript
Ogame.Research.getResearchCost(Ogame.models.Research[124], 5); // Astrophysics
// → { metal: 37600, crystal: 75100, deuterium: 37600, energyCost: 0 }
```

Astrophysics has the game's only non-integer factor (1.75) and its costs are rounded up to the nearest hundred; Graviton is paid entirely in `energyCost`.

#### `getResearchTime(research, targetLevel, labLevel = 0, researchSpeed = 1)`

`(metal + crystal) / (1000 × (1 + labs))` hours, divided by the universe research speed. `labLevel` is the Research Lab level, or the sum of every connected lab once the Intergalactic Research Network is up.

```javascript
Ogame.Research.getResearchTime(Ogame.models.Research[122], 10, 12, 2); // Plasma
// → 425354
```

### `Ogame.Fleets`

#### `getDistance(origin, target)`

Coordinates are `{ galaxy, system, position }`. The scale is not linear.

```javascript
Ogame.Fleets.getDistance({ galaxy: 1, system: 1, position: 1 }, { galaxy: 4, system: 1, position: 1 });
// → 60000
```

#### `getShipSpeed(ship, drives = {})` / `getFleetSpeed(fleet, drives = {})` / `getActiveDrive(ship, drives = {})`

`drives` holds the `{ combustion, impulse, hyperspace }` levels. Each level adds 10%, 20% or 30% of the ship's base speed, and only the drive the ship actually flies on counts.

A few ships switch to a better drive once the matching technology is high enough. `getActiveDrive` tells you which one is in use — and since a switch also changes the fuel burn, it reports that too.

```javascript
Ogame.Fleets.getShipSpeed(Ogame.models.Destroyable[11], { combustion: 6 });
// → 8000
Ogame.Fleets.getActiveDrive(Ogame.models.Destroyable[11], { combustion: 6, impulse: 5 });
// → { drive: 'impulse', speed: 20000, fuelConsumption: 20 }

// A fleet moves at the speed of its slowest ship
Ogame.Fleets.getFleetSpeed([{ ship: Ogame.models.Destroyable[1], count: 100 }], { combustion: 10 });
// → 25000
```

#### `getFlightTime(distance, fleetSpeed, speedPercent = 100, universeFleetSpeed = 1)`

`(10 + 35000 / speedPercent × √(distance × 10 / fleetSpeed)) / universeFleetSpeed`, in seconds.

#### `getFuelConsumption(fleet, distance, speedPercent = 100, drives = {})`

`1 + round(Σ(consumption × count) × distance / 35000 × (speedPercent / 100 + 1)²)`, in deuterium.

#### `getTrip(fleet, origin, target, options = {})`

The three above in one call, plus the cargo maths.

```javascript
Ogame.Fleets.getTrip(
  [{ ship: Ogame.models.Destroyable[12], count: 250 }, { ship: Ogame.models.Destroyable[9], count: 40 }],
  { galaxy: 1, system: 1, position: 8 },
  { galaxy: 3, system: 42, position: 6 },
  { drives: { combustion: 16, hyperspace: 12 }, speedPercent: 100, roundTrip: false },
);
// → { distance: 40000, fleetSpeed: 19500, duration: 1595, fuel: 258287,
//     cargo: 6650000, cargoAfterFuel: 6391713 }
```

`cargoAfterFuel` is what is left once the deuterium is loaded — the number that decides whether a raid is worth flying.

#### `getDebris(ship, number, factor, deuteriumFactor = 0)`

The debris field left by destroyed units. `factor` is the universe debris factor, `deuteriumFactor` its deuterium debris factor (`0` on most universes).

```javascript
Ogame.Fleets.getDebris(Ogame.models.Destroyable[1], 100, 0.3);
// → { metal: 90000, crystal: 30000, deuterium: 0 }
```

#### `simulateCombat(attacker, defender, options = {})`

A full battle: up to six rounds, every unit fires once per round at a random enemy, rapid fire grants extra shots, shots below 1% of the target's shield bounce off, shields come back every round, and a unit under 70% hull may explode at the end of the round.

```javascript
const battle = Ogame.Fleets.simulateCombat(
  {
    fleet: [{ ship: Ogame.models.Destroyable[1], count: 500 }],
    techs: { weapons: 14, shielding: 12, armour: 15 },
  },
  {
    fleet: [{ ship: Ogame.models.Destroyable[201], count: 200 }],
    techs: { weapons: 10, shielding: 10, armour: 10 },
  },
  { seed: 42, debrisFactor: 0.3 },
);
// → {
//   winner: 'attacker' | 'defender' | 'draw',
//   rounds: Number,
//   seed: Number,
//   attacker: { survivors: [{ ship, count }], losses: [{ ship, count }] },
//   defender: { survivors: [...], losses: [...] },
//   debris: { metal, crystal, deuterium },
// }
```

A battle is **random**, so one run is one possible outcome. Pass a `seed` to replay the exact same fight; average several seeds to get a feel for the likely result:

```javascript
const runs = Array.from({ length: 100 }, (_, seed) => simulateCombat(a, d, { seed }));
const winRate = runs.filter((run) => run.winner === 'attacker').length / runs.length;
```

Destroyed defenses are left out of the debris field unless you pass `defenseDebris: true`. Defense repair after a battle is not modelled.

### `Ogame.Trader`

Converts one resource into the two others. Rates are a `metal:crystal:deut` string (default `'2:1.5:1'`), and the percentages split the traded amount between the two target resources. **All parameters are optional.**

```javascript
Ogame.Trader.sellDeut(10000);    // → { metal: 12000, crystal: 6000 }
Ogame.Trader.sellMetal(10000);   // → { deut, crystal }
Ogame.Trader.sellCrystal(10000); // → { deut, metal }
```

#### `parseRate(rate = '2:1.5:1', type = 'deut')`

Normalizes a rate relative to a reference resource (`'metal'`, `'crystal'` or `'deut'`). Throws if the rate is malformed.

```javascript
Ogame.Trader.parseRate('3:2:1', 'deut');
// → { rateMetal: 3, rateCrystal: 2, rateDeut: 1 }
```

The reference term always comes back as `1`, so a rate and any multiple of it are the same rate, whichever resource you sell:

```javascript
Ogame.Trader.parseRate('4:3:2', 'deut');
// → { rateMetal: 2, rateCrystal: 1.5, rateDeut: 1 }  — same as '2:1.5:1'
```

### `Ogame.i18n`

Every model entry carries `names: { en, fr }`.

```javascript
Ogame.i18n.getName(Ogame.models.Buildings[22]);       // → 'Metal Storage'
Ogame.i18n.getName(Ogame.models.Buildings[22], 'fr'); // → 'Hangar de métal'

// Case and accent insensitive, matches any supported language
Ogame.i18n.findByName(Ogame.models.Destroyable, 'etoile de la mort').ogameId; // → 214
```

### `Ogame.models`

Frozen reference datasets you feed into the calculators.

- **`Buildings`** — the 19 buildings (mines, plants, storages, facilities, moon buildings).
  See [`src/models/buildings.js`](./src/models/buildings.js).
- **`Destroyable`** — the 27 ships, defenses and missiles, with structure, shield, attack, speed, cargo, fuel, drive and rapid-fire table.
  See [`src/models/destroyable.js`](./src/models/destroyable.js).
- **`Research`** — the 16 technologies.
  See [`src/models/research.js`](./src/models/research.js).
- **`ATTRIBUTES`** — the `TYPES`, `CATEGORIES` and `DRIVES` enums used by `Destroyable`.

```javascript
Ogame.models.Buildings[22];
// → {
//   ogameId: 22,
//   names: { en: 'Metal Storage', fr: 'Hangar de métal' },
//   category: 'resources',
//   factor: 2,
//   storage: 'metal',
//   base: { metal, crystal, deuterium, energyCost,
//           energyConsumption, deuteriumConsumption, production },
// }

Ogame.models.Destroyable[11];
// → {
//   ogameId: 202,
//   names: { en: 'Small Cargo', fr: 'Petit transporteur' },
//   structure: 4000, shield: 10, attack: 5,
//   speed: 5000, cargo: 5000, fuelConsumption: 10,
//   drive: 'combustion',
//   driveUpgrades: [{ drive: 'impulse', minLevel: 5, speed: 10000, fuelConsumption: 20 }],
//   type: 'civil', category: 'ships',
//   rapidFire: [{ target: 15, fire: 5 }, ...],
//   cost: { metal: 2000, crystal: 2000, deuterium: 0 },
// }
```

#### Ids

Ids 1–5 of `Buildings` and 1–302 of `Destroyable` are this library's own historical numbering. Every entry also carries **`ogameId`**, the id the game itself uses — that's the one to use when talking to OGame.

```javascript
Ogame.models.Buildings[5].ogameId;      // → 12  (Fusion Reactor)
Ogame.models.Destroyable[1].ogameId;    // → 204 (Light Fighter)
Ogame.models.Destroyable[201].ogameId;  // → 401 (Rocket Launcher)
```

`rapidFire` targets are **library** ids, so they index straight into `Destroyable`.

## TypeScript

Declarations are generated from the JSDoc and shipped in `types/`. Nothing to install:

```typescript
import Ogame from 'ogamejs';
import BUILDINGS from 'ogamejs/models/buildings';

const cost = Ogame.Building.getBuildingCost(BUILDINGS[21], 12);
const total: number = cost.metal + cost.crystal + cost.deuterium;
```

The shared types are importable too, for typing your own helpers:

```typescript
import type { BuildingEntry, FleetEntry, Coordinates } from 'ogamejs/types';
```

## Known gaps

Stated plainly, so you know what you are not getting:

- **Lifeforms** (the 2021 expansion) are not modelled — neither their buildings nor their technologies. This is a data problem, not a code one: the tables run to roughly 120 entries and we would rather have them sourced than guessed.
- **Drive upgrade values** for the three ships that switch drive (small cargo, recycler, bomber) come from community tables rather than a first-party source. The speeds are solid; the post-switch fuel figures deserve an in-game check.
- **Defense repair** after a battle is not simulated, and neither are moon-creation odds.
- Officers other than the geologist, and alliance classes, are not modelled in the production bonuses.

## Development

```bash
npm install      # install dependencies
npm test         # run the test suite (Vitest)
npm run test:watch
npm run lint     # ESLint (flat config)
npm run types    # type check and write types/
```

The library is written in native ESM and published straight from `src/` — the only build step is the declaration files, which `prepack` generates for you.

## Releases

Releases are fully automated with [semantic-release](https://github.com/semantic-release/semantic-release), driven by [Conventional Commits](https://www.conventionalcommits.org/):

- pushes to `master` publish a stable release,
- pushes to `develop` publish a pre-release.

The version, `CHANGELOG.md`, git tag, GitHub release and npm publish (via OIDC trusted publishing) are all handled by CI. Do not bump the version manually.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE.md)
