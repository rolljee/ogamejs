import hasNaN from './utils';

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
    res = {
      rateMetal: metal,
      rateCrystal: crystal,
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

  if (hasNaN(Object.values(res))) {
    throw new Error('rate not parsed correctly');
  }

  return res;
}
