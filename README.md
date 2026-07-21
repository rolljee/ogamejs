# ogamejs

A small, dependency-free JavaScript library that reproduces [OGame](https://gameforge.com/en-GB/play/ogame)'s core formulas: building costs and production, fleet debris, and the marketplace exchange rates.

It ships only the math — no UI, no state — so you can build your own calculator, bot, or dashboard on top of it.

## Requirements

- **Node.js >= 24**
- The package is **ESM-only** (use `import`, not `require`)

## Installation

```bash
npm install ogamejs
```

## Quick start

```javascript
import Ogame from 'ogamejs';

// Reference data bundled with the library
const { Buildings, Destroyable } = Ogame.models;

// Level 10 metal mine on a universe with speed x5
const metalBase = Buildings[1].base;
const mine = Ogame.Building.getMetalMine(metalBase, 10, 5);
// → { crystal: 576, deuterium: 0, energy: 259, metal: 2306, production: 3890 }

// Debris field left by 100 light fighters (universe debris factor 0.3)
const debris = Ogame.Fleets.getDebris(Destroyable[1], 100, 0.3);
// → { metal: 90000, crystal: 30000 }

// Sell 10 000 deuterium at the default 2:1.5:1 rate
const trade = Ogame.Trader.sellDeut(10000);
// → { metal: 12000, crystal: 6000 }
```

`Ogame` is the default export and exposes four namespaces:

| Namespace         | Purpose                                                     |
| ----------------- | ----------------------------------------------------------- |
| `Ogame.Building`  | Building cost & production calculators                      |
| `Ogame.Fleets`    | Fleet-related calculations                                  |
| `Ogame.Trader`    | Marketplace exchange helpers                                |
| `Ogame.models`    | Reference data (`Buildings`, `Destroyable`)                 |

You can also import a single namespace directly:

```javascript
import Building from 'ogamejs/src/buildings/index.js';
```

## API reference

### `Ogame.Building`

Every mine/plant calculator takes a **base** object (from `Ogame.models.Buildings[id].base`) and returns the cost to reach `targetLevel` plus the resulting production.

The returned object always has the same shape:

```javascript
{
  metal: Number,       // metal cost to reach targetLevel
  crystal: Number,     // crystal cost to reach targetLevel
  deuterium: Number,   // deuterium cost to reach targetLevel
  energy: Number,      // energy consumption at targetLevel
  production: Number,  // resource (or energy) produced at targetLevel
}
```

#### `getMetalMine(base, targetLevel, universeSpeed = 1)`

```javascript
Ogame.Building.getMetalMine(Ogame.models.Buildings[1].base, 10, 5);
// → { crystal: 576, deuterium: 0, energy: 259, metal: 2306, production: 3890 }
```

#### `getCrystalMine(base, targetLevel, pos, universeSpeed = 1)`

`pos` is the planet position (1, 2 or 3), which grants a production bonus (positions closer to the sun produce more crystal).

```javascript
Ogame.Building.getCrystalMine(Ogame.models.Buildings[2].base, 10, 1, 5);
// → { crystal: 1649, deuterium: 0, energy: 259, metal: 3298, production: 3371 }
```

#### `getDeutSynth(base, targetLevel, avg, universeSpeed = 1)`

`avg` is the planet's average temperature — the colder the planet, the higher the deuterium production.

```javascript
Ogame.Building.getDeutSynth(Ogame.models.Buildings[3].base, 10, 40, 5);
// → { crystal: 2883, deuterium: 0, energy: 518, metal: 8649, production: 1554 }
```

#### `getSolarPlant(base, targetLevel)`

Produces energy, so `production` is an energy amount and `energy` (consumption) is `0`.

```javascript
Ogame.Building.getSolarPlant(Ogame.models.Buildings[4].base, 10);
// → { crystal: 1153, deuterium: 0, energy: 0, metal: 2883, production: 518 }
```

#### `getFusionReactor(base, targetLevel, energyTech, universeSpeed = 1)`

`energyTech` is the Energy Technology level. The returned object additionally includes `consumption` (deuterium burned per hour):

```javascript
{
  metal: Number,
  crystal: Number,
  deuterium: Number,   // deuterium cost to build
  energy: Number,      // always 0 (it produces energy)
  consumption: Number, // deuterium consumed at targetLevel
  production: Number,  // energy produced at targetLevel
}
```

#### `parseInfoCompteData(data)`

Parses the BBCode of the French OGame "infocompte" report into a structured object.

```javascript
const report = Ogame.Building.parseInfoCompteData(bbcodeString);
// → {
//   planets: [{ planet, metal, crystal, deut, temperature }, ...],
//   production: { hourly: {...}, daily: {...}, weekly: {...} },
//   points: { metal, crystal, deut, total },
//   plasma: Number,
//   universe: Number,
//   lang: String,
// }
```

> Note: this parser expects a French-language report.

### `Ogame.Fleets`

#### `getDebris(ship, number, factor)`

Returns the debris field generated when `number` ships (or defenses) of a given type are destroyed. `factor` is the universe's debris factor (e.g. `0.3` for 30%). Pass a full entry from `Ogame.models.Destroyable`.

```javascript
Ogame.Fleets.getDebris(Ogame.models.Destroyable[1], 100, 0.3);
// → { metal: 90000, crystal: 30000 }
```

### `Ogame.Trader`

Marketplace helpers to convert one resource into the two others. Rates are expressed as a `metal:crystal:deut` string (default `'2:1.5:1'`), and percentages control how the traded amount is split between the two target resources. **All parameters are optional.**

#### `sellDeut(deut = 0, percentM = 60, percentC = 40, rate = '2:1.5:1')`

```javascript
Ogame.Trader.sellDeut(10000);
// → { metal: 12000, crystal: 6000 }
```

#### `sellMetal(metal = 0, percentD = 40, percentC = 60, rate = '2:1.5:1')`

```javascript
Ogame.Trader.sellMetal(10000);
// → { deut: Number, crystal: Number }
```

#### `sellCrystal(crystal = 0, percentD = 40, percentM = 60, rate = '2:1.5:1')`

```javascript
Ogame.Trader.sellCrystal(10000);
// → { deut: Number, metal: Number }
```

#### `parseRate(rate = '2:1.5:1', type = 'deut')`

Normalizes a rate string relative to a reference resource (`'metal'`, `'crystal'` or `'deut'`). Throws if the rate is malformed.

```javascript
Ogame.Trader.parseRate('3:2:1', 'deut');
// → { rateMetal: 3, rateCrystal: 2, rateDeut: 1 }
```

### `Ogame.models`

Frozen reference datasets you feed into the calculators.

- **`Buildings`** — every building, keyed by in-game id, with its `name` and `base` stats.
  See [`src/models/buildings.js`](./src/models/buildings.js).
- **`Destroyable`** — every ship and defense, keyed by id, with structure, shield, attack, cost, rapid-fire table, etc.
  See [`src/models/destroyable.js`](./src/models/destroyable.js).

```javascript
Ogame.models.Buildings[1];
// → { name: 'Mine de métal', base: { production, consumption, metal, crystal, deutrium, energy } }

Ogame.models.Destroyable[1];
// → { name: 'chasseur léger', structure, shield, attack, cost: { metal, crystal, deut }, ... }
```

## Development

```bash
npm install      # install dependencies
npm test         # run the test suite (Vitest)
npm run test:watch
npm run lint     # ESLint (flat config)
```

The library is written in native ESM and published straight from `src/` — there is no build step.

## Releases

Releases are fully automated with [semantic-release](https://github.com/semantic-release/semantic-release), driven by [Conventional Commits](https://www.conventionalcommits.org/):

- pushes to `master` publish a stable release,
- pushes to `develop` publish a pre-release.

The version, `CHANGELOG.md`, git tag, GitHub release and npm publish (via OIDC trusted publishing) are all handled by CI. Do not bump the version manually.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE.md)
