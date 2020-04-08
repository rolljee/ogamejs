import parseRate from './parseRate';

function sellMetal(metal = 0, percentD = 40, percentC = 60, rate = '2:1.5:1') {
  const pDeut = percentD / 100;
  const pCrystal = percentC / 100;
  const { rateDeut, rateCrystal } = parseRate(rate, 'metal');
  const deut = pDeut * rateDeut * metal;
  const crystal = pCrystal * rateCrystal * metal;

  return {
    deut: Math.round(deut),
    crystal: Math.round(crystal),
  };
}

export default sellMetal;
