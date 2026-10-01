/** A moon size, in km, can only be in this range. */
const MIN_MOON_SIZE = 3464;
const MAX_MOON_SIZE = 8944;

/** Each attacker spreads their Deathstars over this many waves. */
const WAVES_PER_ATTACKER = 6;

function assertMoonSize(moonSize) {
  if (!Number.isFinite(moonSize) || moonSize < MIN_MOON_SIZE || moonSize > MAX_MOON_SIZE) {
    throw new Error(`moonSize must be between ${MIN_MOON_SIZE} and ${MAX_MOON_SIZE}, received ${moonSize}`);
  }
}

function assertFleets(fleets) {
  if (!Array.isArray(fleets) || fleets.length === 0) {
    throw new Error('fleets must be a non-empty array of Deathstar counts');
  }
  for (const rip of fleets) {
    if (!Number.isInteger(rip) || rip < 0) {
      throw new Error(`each fleet must be an integer >= 0, received ${rip}`);
    }
  }
}

/**
 *
 * Return the chance that a single wave of Deathstars destroys the moon
 *
 * `(100 - sqrt(moonSize)) * sqrt(rip) / 100`, capped at 1
 * @param {number} moonSize The moon diameter, in km
 * @param {number} rip The number of Deathstars in the wave
 * @return {number} The chance, between 0 and 1
 */
function getWaveChance(moonSize, rip) {
  return Math.min(1, ((100 - Math.sqrt(moonSize)) * Math.sqrt(rip)) / 100);
}

/**
 *
 * Return the waves one attacker sends, in firing order
 *
 * The Deathstars are spread over 6 waves: when the count is not a multiple of 6,
 * the first waves carry one extra ship. Under 6 Deathstars, the last waves are
 * empty, which neither threaten the moon nor lose a ship.
 * @param {number} rip The attacker's Deathstars
 * @return {number[]} The size of each of the 6 waves
 */
function getMoonbreakWaves(rip) {
  const base = Math.floor(rip / WAVES_PER_ATTACKER);
  const remainder = rip % WAVES_PER_ATTACKER;

  return Array.from({ length: WAVES_PER_ATTACKER }, (_, i) => (i < remainder ? base + 1 : base));
}

/**
 *
 * Return the chance that a coordinated attack destroys the moon
 *
 * The attackers fire one after the other and the moon is gone as soon as one
 * wave succeeds, so the attack fails only when every wave fails.
 * @param {number} moonSize The moon diameter, in km (3464 to 8944)
 * @param {number[]} fleets The Deathstars of each attacker, in firing order
 * @return {number} The chance, between 0 and 1
 */
function getMoonbreakChance(moonSize, fleets) {
  assertMoonSize(moonSize);
  assertFleets(fleets);

  const failure = fleets
    .flatMap(getMoonbreakWaves)
    .reduce((acc, rip) => acc * (1 - getWaveChance(moonSize, rip)), 1);

  return 1 - failure;
}

/**
 *
 * Return the expected Deathstar losses of a coordinated attack
 *
 * Each Deathstar of a wave is destroyed with probability `sqrt(moonSize) / 200`,
 * and a wave only costs ships if every wave before it failed. The variance sums
 * the per-wave binomial variances (the waves are treated as independent), and
 * the spread is summarised as a gaussian around the mean: 1σ / 2σ / 3σ for the
 * 68 / 95 / 99 % bands, clamped between 0 and the whole fleet.
 * @param {number} moonSize The moon diameter, in km (3464 to 8944)
 * @param {number[]} fleets The Deathstars of each attacker, in firing order
 * @return {{
 *   mean: number, sigma: number,
 *   bands: { confidence: number, min: number, max: number }[],
 * }} The losses, unrounded
 */
function getMoonbreakLosses(moonSize, fleets) {
  assertMoonSize(moonSize);
  assertFleets(fleets);

  const destructionRate = Math.sqrt(moonSize) / 200;
  const total = fleets.reduce((acc, rip) => acc + rip, 0);

  let mean = 0;
  let variance = 0;
  // The chance that every wave so far has failed, so that this one fires.
  let reached = 1;

  for (const size of fleets.flatMap(getMoonbreakWaves)) {
    const p = destructionRate * reached;
    mean += size * p;
    variance += size * p * (1 - p);
    reached *= 1 - getWaveChance(moonSize, size);
  }

  const sigma = Math.sqrt(variance);
  const band = (confidence, sigmas) => ({
    confidence,
    min: Math.max(mean - sigmas * sigma, 0),
    max: Math.min(mean + sigmas * sigma, total),
  });

  return {
    mean,
    sigma,
    bands: [band(68, 1), band(95, 2), band(99, 3)],
  };
}

export {
  getWaveChance,
  getMoonbreakWaves,
  getMoonbreakChance,
  getMoonbreakLosses,
  MIN_MOON_SIZE,
  MAX_MOON_SIZE,
  WAVES_PER_ATTACKER,
};
