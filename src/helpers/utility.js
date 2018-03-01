import BN from 'bn.js';
import moment from 'moment';

const BOTOSHI_TO_BOT = 100000000; // Both qtum and bot's conversion rate is 10^8 : 1
const BOT_MIN_VALUE = 0.01; // Both qtum and bot's conversion rate is 10^8 : 1
const BOT_DECIMALS = 8;
const FORMAT_DATE_TIME = 'MMM D, YYYY h:mm:ss a';
const FORMAT_SHORT_DATE_TIME = 'M/D/YY h:mm:ss a';

/*
* Calculates the estimated block based on current block and future date.
* @param currentBlock {Number} The current block number.
* @param futureDate {Moment} A moment instance (UTC) of the future date to estimate.
* @param averageBlockTime {Number} The average block time in seconds.
* @return {Number} Returns a number of the estimated future block.
*/
export function calculateBlock(currentBlock, futureDate, averageBlockTime) {
  const diffSec = futureDate.unix() - moment().unix();
  return Math.round(diffSec / averageBlockTime) + currentBlock;
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

/**
 * Shortens address string by only showing the first and last couple characters.
 * @param text {String} Origin address
 * @param maxLength {Number} Length of output string, including 3 dots
 * @return {String} Address in format "Qjsb ... 3dkb", or empty string if input is undefined or empty
 */
export function shortenAddress(text, maxLength) {
  if (!text) {
    return '';
  }

  const cutoffLength = (maxLength - 3) / 2;
  return text.length > maxLength
    ? `${text.substr(0, cutoffLength)} ... ${text.substr(text.length - cutoffLength)}`
    : text;
}
