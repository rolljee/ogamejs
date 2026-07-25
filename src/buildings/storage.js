import getCost, { assertLevel } from '../cost.js';

/**
 *
 * Return the capacity of a storage building at a given level
 *
 * Level 0 is the free 10.000 units every planet starts with.
 * @param {number} level The storage level, >= 0
 * @returns {number} The protected capacity, in resource units
 */
function getStorageCapacity(level) {
  if (!Number.isInteger(level) || level < 0) {
    throw new Error(`level must be an integer >= 0, received ${level}`);
  }

  return 5000 * Math.floor(2.5 * Math.exp((20 * level) / 33));
}

/**
 *
 * Return the cost and the capacity of a storage building at a given level
 * @param {import('../types.js').BuildingEntry} storage A storage entry of models/buildings.js (22, 23 or 24)
 * @param {number} targetLevel The level to reach, >= 1
 * @returns {import('../types.js').Cost & {capacity: number}} The cost of that level plus the capacity
 */
function getStorage(storage, targetLevel) {
  assertLevel(targetLevel);

  if (!storage || !storage.storage) {
    throw new Error('storage must be a storage building entry (Buildings 22, 23 or 24)');
  }

  return {
    ...getCost(storage, targetLevel),
    capacity: getStorageCapacity(targetLevel),
  };
}

/**
 *
 * Return the lowest storage level able to protect a given amount of resources
 * @param {number} amount The amount of resources to protect
 * @returns {number} The required storage level
 */
function getStorageLevelFor(amount) {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error(`amount must be a positive number, received ${amount}`);
  }

  let level = 0;
  while (getStorageCapacity(level) < amount) {
    level += 1;
  }

  return level;
}

export { getStorageCapacity, getStorageLevelFor };
export default getStorage;
