import BN from 'bn.js';
import moment from 'moment';
import fetch from 'node-fetch';

const BOTOSHI_TO_BOT = 100000000; // Both qtum and bot's conversion rate is 10^8 : 1
const BOT_MIN_VALUE = 0.01; // Both qtum and bot's conversion rate is 10^8 : 1
const BOT_DECIMALS = 8;
const AVG_BLOCK_TIME_SECONDS = 144.3489932885906;
const FORMAT_DATE_TIME = 'MMM D, YYYY h:mm:ss a';

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export function request(url, options) {
  console.log('url:', url, 'options:', options);

  return fetch(url, options)
    .then(parseJSON)
    .then(checkStatus);
}

/**
 * Returns resolved Promise if Http response contains result; otherwise returns rejected upon error.
 *
 * @param  {object} response   JSON response from a HTTP request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response) {
  // We can rely on checking error object so dont check HTTP status code here.
  if (response.error) {
    throw new Error(response.error);
  } else {
    return response.result;
  }
}

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response) {
  return response.json();
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
