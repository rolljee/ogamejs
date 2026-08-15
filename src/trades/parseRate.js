import isUsableRate from './utils.js';

function extract(rate, type) {
  let res = {};
  const split = rate.split(':').map(Number);
  const metal = split[0];
  const crystal = split[1];
  const deut = split[2];

  if (type === 'metal') {
    res = {
      rateMetal: 1,
      rateCrystal: crystal / metal,
      rateDeut: deut / metal,
    };
  } else if (type === 'crystal') {
    res = {
      rateMetal: metal / crystal,
      rateCrystal: 1,
      rateDeut: deut / crystal,
    };
  } else if (type === 'deut') {
    // Like the two branches above: express the other terms in units of the one
    // being sold, so its own term becomes 1. Reading `metal` and `crystal` raw
    // here only happened to work because rates are usually written against 1
    // deuterium — `4:3:2` is the same rate as `2:1.5:1`, but used to pay twice
    // as much for the very same deuterium.
    res = {
      rateMetal: metal / deut,
      rateCrystal: crystal / deut,
      rateDeut: 1,
    };
  } else {
    throw new Error(`${type} is not part of the game, try one of metal, crystal, deut`);
  }

  return res;
}

export default function parseRate(rate = '2:1.5:1', type = 'deut') {
  const split = rate.split(':');

  if (split.length !== 3) {
    throw new Error('rate not parsed correctly');
  }

  const res = extract(rate, type);

  // Checked after normalizing rather than on the raw terms: whatever makes a
  // rate unusable — a term that is not a number, `0`, empty, negative — shows
  // up here as a NaN, an Infinity, a 0 or a negative ratio.
  if (!isUsableRate(Object.values(res))) {
    throw new Error('rate not parsed correctly');
  }

  return res;
}
