/**
 * Shared type definitions.
 *
 * This module holds no runtime code: it only exists so the JSDoc of the rest of
 * the library — and the generated `.d.ts` files — can point at named types
 * instead of a bare `object`.
 *
 * @module types
 */

/**
 * @typedef {'en' | 'fr'} Lang A supported language
 */

/**
 * @typedef {object} Names
 * @property {string} en The English name
 * @property {string} fr The French name
 */

/**
 * @typedef {object} BuildingBase The level 1 values of a building
 * @property {number} metal Metal paid to build it
 * @property {number} crystal Crystal paid to build it
 * @property {number} deuterium Deuterium paid to build it
 * @property {number} energyCost Energy paid to build it
 * @property {number} energyConsumption Energy it consumes once built
 * @property {number} deuteriumConsumption Deuterium it burns once built
 * @property {number} production What it produces, resources or energy
 */

/**
 * @typedef {object} BuildingEntry An entry of `models/buildings.js`
 * @property {number} ogameId The id OGame itself uses
 * @property {Names} names The localised labels
 * @property {string} category `resources`, `facilities` or `moon`
 * @property {number} factor The per-level cost multiplier
 * @property {BuildingBase} base The level 1 values
 * @property {number} [energyFactor] A separate multiplier for the energy cost
 * @property {string} [storage] The resource it stores, on storage buildings only
 */

/**
 * @typedef {object} ResearchBase The level 1 cost of a technology
 * @property {number} metal Metal cost
 * @property {number} crystal Crystal cost
 * @property {number} deuterium Deuterium cost
 * @property {number} energyCost Energy cost, Graviton technology only
 */

/**
 * @typedef {object} ResearchEntry An entry of `models/research.js`
 * @property {number} ogameId The id OGame itself uses
 * @property {Names} names The localised labels
 * @property {string} category `basic`, `drive`, `advanced` or `combat`
 * @property {number} factor The per-level cost multiplier
 * @property {ResearchBase} base The level 1 cost
 * @property {number} [roundTo] Rounding step, Astrophysics only
 */

/**
 * @typedef {object} Cost The resources a level costs
 * @property {number} metal Metal cost
 * @property {number} crystal Crystal cost
 * @property {number} deuterium Deuterium cost
 * @property {number} energyCost Energy cost
 */

/**
 * @typedef {object} BuildingInfo Everything about a building at a given level
 * @property {number} metal Metal paid to reach that level
 * @property {number} crystal Crystal paid to reach that level
 * @property {number} deuterium Deuterium paid to reach that level
 * @property {number} energyCost Energy paid to reach that level
 * @property {number} energyConsumption Energy consumed at that level
 * @property {number} deuteriumConsumption Deuterium burned at that level
 * @property {number} production Resources, or energy, produced at that level
 */

/**
 * @typedef {object} RapidFire A rapid-fire bonus against another unit
 * @property {number} target The library id of the unit it applies to
 * @property {number} fire How many shots it can chain
 */

/**
 * @typedef {object} DriveUpgrade A better drive a ship switches to
 * @property {string} drive The drive it moves to
 * @property {number} minLevel The drive level that unlocks it
 * @property {number} speed The new base speed
 * @property {number} fuelConsumption The new base fuel consumption
 */

/**
 * @typedef {object} DestroyableEntry An entry of `models/destroyable.js`
 * @property {number} ogameId The id OGame itself uses
 * @property {Names} names The localised labels
 * @property {number} structure The metal plus crystal cost, hull is a tenth of it
 * @property {number} shield The base shield
 * @property {number} attack The base attack
 * @property {number} speed The base speed, before any drive bonus
 * @property {number} cargo The cargo capacity
 * @property {number} fuelConsumption The base deuterium burned
 * @property {string} drive The drive powering it
 * @property {string} type `attack`, `civil` or `defense`
 * @property {string} category `ships`, `defenses` or `missiles`
 * @property {RapidFire[]} rapidFire Its rapid-fire table
 * @property {{metal: number, crystal: number, deuterium: number}} cost What it costs to build
 * @property {DriveUpgrade[]} [driveUpgrades] The drives it can switch to
 */

/**
 * @typedef {object} Coordinates A place in the universe
 * @property {number} galaxy The galaxy
 * @property {number} system The system
 * @property {number} position The position in the system
 */

/**
 * @typedef {object} FleetEntry A group of identical ships
 * @property {DestroyableEntry} ship The ship
 * @property {number} count How many of them
 */

/**
 * @typedef {object} Drives The drive technology levels
 * @property {number} [combustion] The Combustion Drive level
 * @property {number} [impulse] The Impulse Drive level
 * @property {number} [hyperspace] The Hyperspace Drive level
 */

/**
 * @typedef {object} CombatTechs The combat technology levels
 * @property {number} [weapons] The Weapons Technology level
 * @property {number} [shielding] The Shielding Technology level
 * @property {number} [armour] The Armour Technology level
 */

/**
 * @typedef {object} Resources An amount of each resource
 * @property {number} metal Metal
 * @property {number} crystal Crystal
 * @property {number} deuterium Deuterium
 */

export {};
