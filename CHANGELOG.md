## [4.0.2](https://github.com/rolljee/ogamejs/compare/v4.0.1...v4.0.2) (2026-08-15)


### Bug Fixes

* **trades:** reject rate terms that cannot describe a trade ([9047f07](https://github.com/rolljee/ogamejs/commit/9047f073a9c9295fb6f24ce138964719f619f0fb))

## [4.0.1](https://github.com/rolljee/ogamejs/compare/v4.0.0...v4.0.1) (2026-08-15)


### Bug Fixes

* **trades:** normalize the rate against deuterium like the other resources ([dd3d864](https://github.com/rolljee/ogamejs/commit/dd3d864ee2b67919e3e27cee377ccbd6c4337789))

# [4.0.0](https://github.com/rolljee/ogamejs/compare/v3.0.0...v4.0.0) (2026-07-25)


* feat!: ship types, complete the models, and add production, flight and combat ([af69541](https://github.com/rolljee/ogamejs/commit/af69541102c27461d88a627224bce4d7181e6be7))


### BREAKING CHANGES

* mine and plant calculators now take `Buildings[id]` rather
than `Buildings[id].base`, and return `energyCost`/`energyConsumption`/
`deuteriumConsumption` instead of `energy`/`consumption`.
* model fields renamed — `entry.name` to `entry.names.fr`,
`base.deutrium` to `base.deuterium`, `base.energy` to `base.energyConsumption`
or `base.energyCost`, `base.consumption` to `base.deuteriumConsumption`,
`fret` to `cargo`, `cost.deut` to `cost.deuterium`, and `deutCost` to
`fuelConsumption` with corrected values (they were half the in-game figure).
* parseInfoCompteData returns planet mine levels as numbers
instead of strings, and getDebris returns an extra `deuterium` key.

See MIGRATION.md for the full upgrade path.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>

# [3.0.0](https://github.com/rolljee/ogamejs/compare/v2.1.3...v3.0.0) (2026-07-21)


* feat!: modernize to Node 24 native ESM, Vitest and semantic-release ([4358f8d](https://github.com/rolljee/ogamejs/commit/4358f8d585f22e5351323d5eaf4b9218019d9a23))


### BREAKING CHANGES

* the package is now ESM-only and requires Node.js >= 24.
CommonJS `require()` is no longer supported; consumers must use `import`.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>

# Changelog

All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](https://semver.org) and releases are automated with [semantic-release](https://github.com/semantic-release/semantic-release).

### [2.1.3](https://github.com/rolljee/ogamejs/compare/v2.1.2...v2.1.3) (2020-04-16)

### [2.1.2](https://github.com/rolljee/ogamejs/compare/v2.1.1...v2.1.2) (2020-04-12)

### [2.1.1](https://github.com/rolljee/ogamejs/compare/v2.1.0...v2.1.1) (2020-04-12)

### [2.0.4](https://github.com/rolljee/ogamejs/compare/v2.0.3...v2.0.4) (2020-04-08)

### [2.0.3](https://github.com/rolljee/ogamejs/compare/v2.0.2...v2.0.3) (2020-04-08)

### [2.0.2](https://github.com/rolljee/ogamejs/compare/v2.0.0...v2.0.2) (2020-04-02)

## [2.0.0](https://github.com/rolljee/ogamejs/compare/v2.0.0-beta.0...v2.0.0) (2020-03-20)

## [2.0.0-beta.0](https://github.com/rolljee/ogamejs/compare/v1.1.2...v2.0.0-beta.0) (2020-03-06)

<a name="1.1.2"></a>
## [1.1.2](https://github.com/rolljee/ogamejs/compare/v1.1.1...v1.1.2) (2019-02-08)



<a name="1.1.1"></a>
## [1.1.1](https://github.com/rolljee/ogamejs/compare/v1.1.0...v1.1.1) (2019-01-30)


### Bug Fixes

* 🐛 Fix issues in tests ([82bce05](https://github.com/rolljee/ogamejs/commit/82bce05))



<a name="1.1.0"></a>
# 1.1.0 (2019-01-29)


### Features

* 🎸 added metal and crystal calcul ([07371e0](https://github.com/rolljee/ogamejs/commit/07371e0))
* 🎸 Rework the way of parsing rates ([aa63c19](https://github.com/rolljee/ogamejs/commit/aa63c19))
* 🎸 SellDeut & ParseRate ([47b83f2](https://github.com/rolljee/ogamejs/commit/47b83f2))



# Change Log

All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](https://semver.org) and releases are automated with [semantic-release](https://github.com/semantic-release/semantic-release).
