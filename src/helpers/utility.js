import BN from 'bn.js';
import moment from 'moment';

const SATOSHI_CONVERSION = 10 ** 8;
const BOT_MIN_VALUE = 0.01;
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
 * Converts a decimal number to Satoshi/Botoshi 10^8.
 * @param number {String/Number} The decimal number to convert.
 * @return {String} The converted number.
 */
export function decimalToSatoshi(number) {
  const conversionBN = new BN(SATOSHI_CONVERSION);
  return new BN(number).mul(conversionBN).toString(10);
}

/**
 * Convert a BigNumber to ES6 Int (2^53 max == 9 007 199 254 740 992) and divide it by 10^8
 * If result number is too small (less than 0.01) we return 0
 * @param  {[type]}
 * @return {[type]}
 */
export function satoshiToDecimal(input) {
  const bigNumber = new BN(input, 16);
  const botoshi = new BN(SATOSHI_CONVERSION);

  const integer = bigNumber.div(botoshi).toNumber();
  const decimal = bigNumber.mod(botoshi).toNumber();
  const result = integer + (decimal / SATOSHI_CONVERSION);

  // if (input !== '0') { console.log(`${input} to ${result}`); }

  return result >= BOT_MIN_VALUE ? result : 0;
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

export function getEndTimeCountDownString(unixSeconds) {
  const nowUnix = moment().unix();
  const unixDiff = unixSeconds - nowUnix;

  if (unixDiff <= 0) {
    return 'Ended';
  }

  const dur = moment.duration(unixDiff * 1000);

  return `${dur.days()}d ${dur.hours()}h ${dur.minutes()}m Left`;
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
