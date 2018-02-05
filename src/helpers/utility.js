import BN from 'bn.js';
import moment from 'moment';
import fetch from 'node-fetch';

const BOTOSHI_TO_BOT = 100000000; // Both qtum and bot's conversion rate is 10^8 : 1
const BOT_MIN_VALUE = 0.01; // Both qtum and bot's conversion rate is 10^8 : 1
const BOT_DECIMALS = 8;
const AVG_BLOCK_TIME_SECONDS = 144.3489932885906;
const FORMAT_DATE_TIME = 'MMM D, YYYY h:mm:ss a';
const FORMAT_SHORT_DATE_TIME = 'M/D/YY h:mm:ss a';

/**
 * Executes an HTTP request.
 * @param url {String} The URL we want to request.
 * @param options {Object} The fetch options.
 * @return {Object} The response data as a Promise.
 */
export function request(url, options) {
  console.log('url:', url, 'options:', options);

  return fetch(url, options)
    .then(checkStatusCode)
    .then(parseResponse);
}

function checkStatusCode(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response);
  }
  return Promise.reject(new Error(response.statusText));
}

/**
 * Parses the HTTP response returned by a network request.
 * @param response {Object} A response from a network request.
 * @return {Object} The parsed JSON from the request.
 */
function parseResponse(response) {
  if (response.url === 'https://testnet.qtum.org/insight-api/statistics/total') {
    return response.text()
      .then((res) => JSON.parse(res))
      .catch((err) => {
        throw new Error(err);
      });
  }
  return response.json()
    .then((res) => res.result)
    .catch((err) => {
      throw new Error(err);
    });
}

/*
* Calculates the estimated block based on current block and future date.
* @param currentBlock {Number} The current block number.
* @param futureDate {Moment} A moment instance (UTC) of the future date to estimate.
* @return {Number} Returns a number of the estimated future block.
*/
export function calculateBlock(currentBlock, futureDate) {
  const diffSec = futureDate.unix() - moment().unix();
  return Math.round(diffSec / AVG_BLOCK_TIME_SECONDS) + currentBlock;
}

/**
 * Convert a BigNumber to ES6 Int (2^53 max == 9 007 199 254 740 992) and divide it by 10^8
 * If result number is too small (less than 0.01) we return 0
 * @param  {[type]}
 * @return {[type]}
 */
export function convertBNHexStrToQtum(input) {
  const bigNumber = new BN(input, 16);
  const botoshi = new BN(BOTOSHI_TO_BOT);

  const integer = bigNumber.div(botoshi).toNumber();
  const decimal = bigNumber.mod(botoshi).toNumber();
  const result = integer + (decimal / BOTOSHI_TO_BOT);

  // if (input !== '0') { console.log(`${input} to ${result}`); }

  return result >= BOT_MIN_VALUE ? result : 0;
}

/*
* Converts a decimal number to Botoshi expressed as a String.
* @dev To be able to handle numbers bigger than JS Ints 2^53, we express it as a String.
* @param {Number} Decimal format number to convert.
* @return {String} Converted number to Botoshi.
*/
export function decimalToBotoshi(decimalNum) {
  return (decimalNum * BOTOSHI_TO_BOT).toString();
}

/*
* Returns the string formatted date and time based on a unix timestamp.
* @param dateTime {Moment} A moment instance of the date and time to convert.
* @return {String} Returns a formatted string.
*/
export function getLocalDateTimeString(unixSeconds) {
  return moment.unix(unixSeconds).format(FORMAT_DATE_TIME);
}

export function getShortLocalDateTimeString(unixSeconds) {
  return moment.unix(unixSeconds).format(FORMAT_SHORT_DATE_TIME);
}
