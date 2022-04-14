# A library for Ogame

## Introduction

I always wanted an Ogame calculator that suited me, all those I could see online are, either too old in graphic terms, or it didn't work, it was calculating badly the number of resources to send for each exchange... 

So I decided to write a library in Javascript to create accessible methods to perform all calculations in a simple way for anyone who wants to create a graphical interface.

## Api documentation

All available methods will be listed below

### Building

* `getCrystalMine` Return information about the crystal mine given a specific level

``` javascript
/**
 *
 * Return information about the crystal mine given a specific level
 * @param {object} mine The crystal mine base information
 * @param {number} targetLevel the crystal mine target level
 * @param {number} pos pos 1/2/3 have a 15/10/5%
 * @param {number} universeSpeed production factor is increased for some universe
 * @returns {Object} informations about the crystal mine at this specific level
 */
function getCrystalMine(mine, targetLevel, pos, universeSpeed = 1) {
    @return {
        crystal: Number,
        deut: Number,
        energy: Number,
        metal: Number,
        production: Number
    }
}
```

* `getDeutSynth` Return information about the deuterium synth given a specific level

``` javascript
/**
 *
 * Return information about the deuterium synth given a specific level
 * @param {object} mine The deut synth base information
 * @param {number} targetLevel the deuterieum synth target level
 * @param {number} avg planet average temperature - The lower the higher the prod is
 * @param {number} universeSpeed production factor is increased for some universe
 * @returns {Object} informations about the deut synth at this specific level
 */
function getDeutSynth(mine, targetLevel, avg, universeSpeed = 1) {
    @return {
        crystal: Number,
        deut: Number,
        energy: Number,
        metal: Number,
        production: Number
    }
}
```

* `getMetalMine` Return information about the metal mine given a specific level

``` javascript
/**
 *
 * Return information about the metal mine given a specific level
 * @param {object} mine The metal mine base information
 * @param {number} targetLevel
 * @param {number} universeSpeed production factor is increased for some universe
 * @returns {Object} informations about the metal mine at this specific level
 */
function getMetalMine(mine, targetLevel, universeSpeed = 1) {
    @return {
        crystal: Number,
        deut: Number,
        energy: Number,
        metal: Number,
        production: Number
    }
}
```

* `getSolarPlant` Return information about the solar plant given a specific level

``` javascript
/**
 *
 * Return information about the solar plant given a specific level
 * @param {object} solarPlant The solarPlant base information
 * @param {number} targetLevel
 * @returns {Object} informations about the solar plant at this specific level
 */
function getSolarPlant(solarPlant, targetLevel) {
    @return {
        crystal: Number,
        deut: Number,
        energy: Number,
        metal: Number,
        production: Number
    }
}
```

* `getFusionReactor` Return information about the fusion reactor given a specific level

``` javascript
/**
 *
 * Return information about the fusion reactor given a specific level
 * @param {object} reactor The fusion react base information
 * @param {number} targetLevel
 * @param {number} energyTech The technology energy level
 * @param {number} universeSpeed production factor is increased for some universe
 * @returns {Object} informations about the fusion reactor at this specific level
 */

function getFusionReactor(reactor, targetLevel, energyTech, universeSpeed = 1) {
    @return {
        crystal: Number,
        deut: Number,
        energy: Number,
        metal: Number,
        production: Number
    }
}
```

* `parseInfoCompteData` Return the number of debris generated

``` javascript
/**
 *
 * Return information about the crystal mine given a specific level
 * @param {object} data The infocompte bb-code
 * @returns {Object} The parsed JSON object of infocompte
 */
function parseInfoCompteData(data) {
    @return {
        planet: String,
        metal: String,
        crystal: String,
        deut: String,
        temperature: Number,
    }
}
```

### Fleet

* `getDebris` Return the number of debris generated

``` javascript
/**
 *
 * Returns the number of debris generated
 * @param {number} shipId The ship identifier
 * @param {number} number The number of ship
 * @param {number} factor The universe debris factor
 * @return {Object} The debris generated
 */
getDebris(ship, number, facror) {
    @return {
        metal: Number,
        crystal: Number,
    }
}
```

### Trader

* `sellDeut` Exchange of deuterium against `Metal` and `Crystal` 

``` javascript
// All params are optionnals
// values placed here will be used if not specified
sellDeut(deut = 0, percentM = 60, percentC = 40, rate = '2:1.5:1') {
    @return {
        metal: Number,
        crystal: Number
    }
}
```

* `sellMetal` Exchange of deuterium against `Metal` and `Crystal` 

``` javascript
// All params are optionnals
// values placed here will be used if not specified
sellMetal(metal = 0, percentD = 40, percentC = 60, rate = '2:1.5:1') {
    @return {
        deut: Number,
        metal: Number
    }
}
```

* `sellCrystal` Exchange of deuterium against `Metal` and `Crystal` 

``` javascript
// All params are optionnals
// values placed here will be used if not specified
sellCrystal(crystal = 0, percentD = 40, percentM = 60, rate = '2:1.5:1') {
    @return {
        deut: Number,
        metal: Number
    }
}
```

* `parseRate()` Parse the exchange rate

``` javascript
// All params are optionnals
// values placed here will be used if not specified
parseRate(rate = '2:1.5:1') {
    @return {
        rateDeut: Number,
        rateMetal: Number,
        rateCrystal: Number
    };
}
```

### Models

Listed below are categories of Buildings / Ships / Defenses

#### Buildings

[Buildings](./src/models/buildings.js) Here you will find all listed Buildings in the game

#### Destroyable

[Destroyable](./src/models/destroyable.js) Here you will find all listed Ships / Defense in the game

