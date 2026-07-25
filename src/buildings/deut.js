import buildingInfo from './info.js';

// The colder the planet, the more deuterium the synthesizer draws out of it.
function getTemperatureFactor(avg) {
  return 0.68 - 0.002 * avg;
}

function getMineProduction(energyConsumption, avg, universeSpeed) {
  return Math.floor(universeSpeed * energyConsumption * getTemperatureFactor(avg));
}

/**
 *
 * Return information about the deuterium synthesizer at a given level
 * @param {import('../types.js').BuildingEntry} mine The deuterium synthesizer entry, `Buildings[3]`
 * @param {number} targetLevel The level to reach, >= 1
 * @param {number} avg The planet average temperature, the lower the higher the production
 * @param {number} [universeSpeed] Production is increased on faster universes
 * @returns {import('../types.js').BuildingInfo} Cost, consumption and production at that level
 */
function getDeutSynth(mine, targetLevel, avg, universeSpeed = 1) {
  return buildingInfo(
    mine,
    targetLevel,
    universeSpeed,
    // The synthesizer production is driven by the energy it consumes.
    (base, flows) => getMineProduction(flows.energyConsumption, avg, universeSpeed),
  );
}

export default getDeutSynth;
