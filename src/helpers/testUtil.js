import { observable } from 'mobx';
import cryptoRandomString from 'crypto-random-string';
import { Routes } from 'constants';

/**
 * Sleeps for a given number of milliseconds.
 * @param {number} ms Number of milliseconds to sleep.
 */
export async function sleep(ms = 1) {
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

export function getMockAppStore() {
  return observable({
    global: getMockGlobalStore(),
    ui: getMockUiStore(),
    wallet: getMockWalletStore(),
    sortBy: 'ASC',
  });
}

function getMockGlobalStore() {
  return observable({
    localWallet: false,
    syncBlockNum: 1,
    syncBlockTime: '1506768969',
  });
}

function getMockUiStore() {
  return observable({
    location: Routes.QTUM_PREDICTION,
  });
}

function getMockWalletStore() {
  return observable({
    addresses: [
      {
        address: `q${cryptoRandomString(33)}`,
        qtum: 20000,
        bot: 20000,
      },
    ],
  });
}
