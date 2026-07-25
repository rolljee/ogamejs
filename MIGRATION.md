# Migration guide

## 3.x → 4.0

4.0 renames the ambiguous fields of the models, unifies the calculator
signatures, and corrects one piece of wrong game data. Every change below is
mechanical, and the errors thrown by the new code point at the fix.

### Calculators take the entry, not its `base`

The mine and plant calculators used to take `Buildings[id].base`. They now take
the whole `Buildings[id]`, like every other calculator, because they read the
cost `factor` that lives on the entry.

```diff
- Ogame.Building.getMetalMine(Ogame.models.Buildings[1].base, 10, 5);
+ Ogame.Building.getMetalMine(Ogame.models.Buildings[1], 10, 5);
```

Passing a `base` throws an error that says exactly this, so a test run finds
every call site for you.

### `base.energy` split in three

`base.energy` meant "energy consumed" on a mine and "energy paid to build" on
the Terraformer. `base.consumption` meant "deuterium burned". They are now named
after what they are:

| 3.x                | 4.0                             |
| ------------------ | ------------------------------- |
| `base.energy`      | `base.energyConsumption`, or `base.energyCost` on the Terraformer and the Space Dock |
| `base.consumption` | `base.deuteriumConsumption`     |
| `base.deutrium`    | `base.deuterium`                |

The `energyIsCost` flag that 3.x used internally is gone — it existed only to
tell those two meanings apart.

### Calculators return one shape

Every building calculator now returns the same seven fields, `0` where a field
does not apply. The `energy` and `consumption` keys of the returned object are
gone:

```diff
  {
    metal, crystal, deuterium,
-   energy,        // consumption for a mine, 0 for a plant
-   consumption,   // fusion reactor only
+   energyCost,           // energy paid to build it
+   energyConsumption,    // energy it consumes once built
+   deuteriumConsumption, // deuterium it burns once built
    production,
  }
```

`getBuildingCost` and `getResearchCost` return the four cost fields only, with
`energy` renamed to `energyCost`.

### Models: renamed and corrected fields

| 3.x                          | 4.0                    |
| ---------------------------- | ---------------------- |
| `entry.name`                 | `entry.names.fr`       |
| `Destroyable[id].fret`       | `Destroyable[id].cargo` |
| `Destroyable[id].cost.deut`  | `Destroyable[id].cost.deuterium` |
| `Destroyable[id].deutCost`   | `Destroyable[id].fuelConsumption` — **and the values changed**, see below |

**`deutCost` held half the real fuel consumption.** All fifteen ships were
consistently at half the in-game value (light fighter 10 instead of 20, cruiser
150 instead of 300). `fuelConsumption` carries the correct values. If you had
compensated for this by doubling somewhere, remove that.

`Destroyable[301]` and `[302]` moved from the `defenses` category to `missiles`,
which is what `ATTRIBUTES.CATEGORIES.MISSILE` was always meant for.

### `parseInfoCompteData` returns numbers

Planet mine levels came back as strings while `temperature` in the same object
was a number. They are numbers now.

```diff
- report.planets[0].metal // '36'
+ report.planets[0].metal // 36
```

The parser also throws readable errors instead of a `TypeError` when a section
is missing, reads the report language from its header, and accepts
`{ locale }` / `{ labels }` options.

### `getDebris` gained a key and an argument

```diff
- Ogame.Fleets.getDebris(ship, 100, 0.3) // { metal, crystal }
+ Ogame.Fleets.getDebris(ship, 100, 0.3) // { metal, crystal, deuterium }
```

A fourth argument, `deuteriumFactor`, covers the universes that put deuterium in
debris fields. A `toEqual` on the old two-key object needs updating.

### New in 4.0

Nothing below breaks anything; it is what the major bought.

- **TypeScript declarations**, generated from the JSDoc and shipped in `types/`.
- `Ogame.models.Buildings` went from 5 to 19 buildings, and there is now a
  `Ogame.models.Research` with the 16 technologies.
- `Ogame.Research`, `Ogame.i18n` namespaces.
- `getBuildingCost`, `getBuildTime`, `getStorage`, `getPlanetProduction`,
  `getProductionBonus`, `getResearchCost`, `getResearchTime`.
- `Ogame.Fleets`: `getDistance`, `getShipSpeed`, `getFleetSpeed`,
  `getActiveDrive`, `getFlightTime`, `getFuelConsumption`, `getTrip`,
  `simulateCombat`.
- `names: { en, fr }` on every model entry, and `ogameId` to map back to the game.
- Subpath exports: `ogamejs/buildings`, `ogamejs/models/research`, `ogamejs/i18n`, …
  The `ogamejs/src/buildings/index.js` form documented in 3.x never actually
  worked, the `exports` map blocked it.
