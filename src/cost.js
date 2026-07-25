function assertLevel(targetLevel) {
  if (!Number.isInteger(targetLevel) || targetLevel < 1) {
    throw new Error(`targetLevel must be an integer >= 1, received ${targetLevel}`);
  }
}

/**
 * Guard against the pre-4.0 habit of passing `Buildings[id].base` around.
 * Every calculator now needs the whole entry, because the cost `factor` lives
 * on it and not on its `base`.
 */
function assertEntry(entry, targetLevel) {
  assertLevel(targetLevel);

  if (!entry || typeof entry !== 'object') {
    throw new Error('expected a Buildings or Research entry, received nothing');
  }

  if (!entry.base || !entry.factor) {
    const looksLikeABase = 'metal' in entry && 'crystal' in entry;

    throw new Error(
      looksLikeABase
        ? 'expected a Buildings or Research entry, received its `base`: pass Buildings[id], not Buildings[id].base'
        : 'expected a Buildings or Research entry with a `base` and a `factor`',
    );
  }
}

function levelCost(baseCost, factor, level, roundTo) {
  const cost = baseCost * factor ** (level - 1);

  if (roundTo) {
    return Math.ceil(cost / roundTo) * roundTo;
  }

  return Math.floor(cost);
}

/**
 *
 * Return the cost of a building or a technology at a given level
 *
 * Works for anything carrying a `base` and a `factor`, so both
 * `models/buildings.js` and `models/research.js` entries are accepted.
 * Use the dedicated `getMetalMine`/`getCrystalMine`/... helpers when you also
 * need the production or the consumption of a mine or a plant.
 *
 * @param {import('./types.js').BuildingEntry|import('./types.js').ResearchEntry} entry A Buildings or
 *   Research entry (not its `base`)
 * @param {number} targetLevel The level to reach, >= 1
 * @returns {import('./types.js').Cost} The resources, and the energy, paid to reach that level
 */
function getCost(entry, targetLevel) {
  assertEntry(entry, targetLevel);

  const { base, factor, roundTo } = entry;
  // Only the space dock scales its energy cost on a factor of its own.
  const energyFactor = entry.energyFactor ?? factor;

  return {
    metal: levelCost(base.metal, factor, targetLevel, roundTo),
    crystal: levelCost(base.crystal, factor, targetLevel, roundTo),
    deuterium: levelCost(base.deuterium, factor, targetLevel, roundTo),
    energyCost: levelCost(base.energyCost, energyFactor, targetLevel, roundTo),
  };
}

export { assertLevel, assertEntry };
export default getCost;
