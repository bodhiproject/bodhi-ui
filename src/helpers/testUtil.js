/**
 * Sleeps for a given number of milliseconds.
 * @param {number} ms Number of milliseconds to sleep.
 */
export async function sleep(ms) {
  await new Promise(res => setTimeout(res, ms));
}

/**
 * Generates a random number within a range.
 * @param {number} min Minimum number, inclusive.
 * @param {number} max Maximum number, inclusive.
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min); // eslint-disable-line no-mixed-operators
}

export function getMockAppStore