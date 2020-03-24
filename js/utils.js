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

export const timer = (time, onTick = () => {}) => {
  let tick = 0;
  let interval;

  const ticker = () => {
    onTick(tick++);
  };

  const start = () => {
    interval = setInterval(ticker, time);
  };

  const stop = () => {
    clearInterval(interval);
  };

  const restart = () => {
    tick = 0;
    stop();
    start();
  };

  start();

  return {
    stop,
    restart
  };
};
/**
 * @param {number} min
 * @param {number} max
 * @returns {function(number): boolean}
 */
const isInRange = ([min, max]) => value => value >= min && value <= max;

/**
 * @param {Object} ageRanges
 * @returns {function(number): string}
 */
export const getAgeRangeKeyByAge = ageRanges => age =>
  Object.keys(ageRanges).find(rangeKey => isInRange(ageRanges[rangeKey])(age));
