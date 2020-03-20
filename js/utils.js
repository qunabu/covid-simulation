/** https://redstapler.co/javascript-weighted-random/ */
export function weightedRandom(prob) {
  let i,
    sum = 0,
    r = Math.random();
  for (i in prob) {
    sum += prob[i];
    if (r <= sum) return i;
  }
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomAge(config, ages) {
  const dict = Object.keys(ages).reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: config[curr]
    }),
    {}
  );
  const ageKey = weightedRandom(dict);

  return randomInteger(ages[ageKey][0], ages[ageKey][1]);
}
