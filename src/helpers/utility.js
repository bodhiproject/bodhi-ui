import moment from 'moment';
import { isNaN, isFinite, isUndefined, orderBy } from 'lodash';
import { defineMessages } from 'react-intl';
import { fromWei, isHexStrict, numberToHex, toBN } from 'web3-utils';
import { getIntlProvider } from './i18nUtil';
import { OracleStatus, SortBy, Phases } from '../constants';

const { BETTING, VOTING, RESULT_SETTING, PENDING, WITHDRAWING, UNCONFIRMED } = Phases;
const SATOSHI_CONVERSION = 10 ** 8;
const GAS_COST = 0.0000004;
const messages = defineMessages({
  end: {
    id: 'str.end',
    defaultMessage: 'Ended',
  },
  day: {
    id: 'str.d',
    defaultMessage: 'd',
  },
  hour: {
    id: 'str.h',
    defaultMessage: 'h',
  },
  minute: {
    id: 'str.m',
    defaultMessage: 'm',
  },
  second: {
    id: 'str.s',
    defaultMessage: 's',
  },
  left: {
    id: 'str.left',
    defaultMessage: 'Left',
  },
});
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
 * @return {String} The converted Satoshi/Botoshi number.
 */
export function decimalToSatoshi(number) {
  if (!number) {
    return number;
  }

  const conversionBN = toBN(SATOSHI_CONVERSION);
  return toBN(number).mul(conversionBN).toString(10);
}

/**
 * Converts Satoshi/Botoshi to a decimal number.
 * @param number {String} The Satoshi/Botoshi string (or hex string) to convert.
 * @return {String} The converted decimal number.
 */
export function satoshiToDecimal(number) {
  if (!number) {
    return number;
  }

  let bn;
  if (isNaN(Number(number))) {
    bn = toBN(number, 16);
  } else {
    bn = toBN(number);
  }

  const conversionBN = toBN(SATOSHI_CONVERSION);
  return bn.div(conversionBN).toNumber();
}

/**
 * Converts String to a big number.
 * @param number {String} The number string to convert.
 * @return {BigNumber} The converted big number.
 */
export function stringToBN(number) {
  if (!number) {
    return number;
  }

  return toBN(number);
}

/**
 * Converts wei to a decimal number.
 * @param number {String} The wei to convert.
 * @return {String} The converted decimal number.
 */
export function weiToDecimal(number) {
  if (!number) {
    return number;
  }

  const decimal = fromWei(number);
  return Number(decimal);
}

/**
 * Returns hex string with hex prefix.
 * @param number {String|Number} The number to convert.
 * @return {String} The converted hex string.
 */
export function numToHex(number) {
  if (isUndefined(number)) return number;
  if (isHexStrict(number)) return number;
  return numberToHex(number);
}

/**
 * Converts the gas number to NAKA cost.
 * @param gas {Number} The gas number to convert.
 * @return {Number} The gas amount represented as NAKA.
 */
export function gasToNaka(gas) {
  if (!gas || !isFinite(gas)) {
    return undefined;
  }

  const gasCostBN = toBN(GAS_COST);
  return toBN(gas).multipliedBy(gasCostBN).toNumber();
}

/**
 * Converts a duration to the countdown display string.
 * @param unixDiff {Number} The duration to convert. Formatted in unix time format.
 * @param locale {Object}} Locale object that the Intl is using.
 * @param localeMessages {Object} LocalMessages object that the Intl is using.
 * @param isShort {Boolean} Whether to show shorter version.
 * @return {String} A string either showing "ended" or the duration in human friendly way.
 */
export function getEndTimeCountDownString(unixDiff, locale, localeMessages, isShort) {
  const { day, hour, minute, second, end } = messages;

  const { formatMessage } = getIntlProvider(locale, localeMessages);
  if (unixDiff <= 0) {
    return formatMessage(end);
  }

  if (isShort) return moment.duration(unixDiff, 'seconds').format(`+d${formatMessage(day)} hh:mm:ss`);
  return moment.duration(unixDiff, 'seconds').format(`d[${formatMessage(day)}] h[${formatMessage(hour)}] m[${formatMessage(minute)}] s[${formatMessage(second)}]`);
}

/**
 * Converts a timestamp to the display string.
 * @param unix {Number} The timestamp to convert. Formatted in unix time format.
 * @return {Array} An array inclue time and date
 */
export function getEndTimeCornerString(unix) {
  const ret = {};
  const dest = moment.unix(unix);
  ret.time = dest.format('h:mm a');
  if (dest.isSame(moment(), 'year')) {
    ret.day = dest.format('MMM Do');
  } else {
    ret.day = dest.format('MMM Do YY');
  }
  return ret;
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

/**
 * Checks to see if the unlocked until timestamp is before the current UNIX time.
 * @param isEncrypted {Boolean} Is the wallet encrypted.
 * @param unlockedUntil {Number|String} The UNIX timestamp in seconds to compare to.
 * @return {Boolean} If the user needs to unlock their wallet.
 */
export function doesUserNeedToUnlockWallet(isEncrypted, unlockedUntil) {
  if (!isEncrypted) {
    return false;
  }

  if (unlockedUntil === 0) {
    return true;
  }

  const now = moment();
  const unlocked = moment.unix(unlockedUntil).subtract(1, 'hours');
  return now.isSameOrAfter(unlocked);
}

/**
 * Returns the correct path of the latest Oracle to route to the detail page.
 * @param oracles {Array} Array of Oracle objects.
 * @return {String} The path to route the user to the correct detail page.
 */
export function getDetailPagePath(oracles) {
  if (oracles.length) {
    const sorted = orderBy(oracles, ['blockNum'], [SortBy.DESCENDING.toLowerCase()]);
    const latestOracle = sorted[0];

    // construct url for oracle or topic
    let url;
    if (latestOracle.status !== OracleStatus.WITHDRAW) {
      url = `/oracle/${latestOracle.topicAddress}/${latestOracle.address}/${latestOracle.txid}`;
    } else {
      url = `/topic/${latestOracle.topicAddress}`;
    }

    return url;
  }
  return undefined;
}

/**
 * Takes an oracle object and returns which phase it is in.
 * @param {oracle} oracle
 */
export const getPhase = ({ token, status }) => {
  const [NBOT, NAKA] = [token === 'NBOT', token === 'NAKA'];
  if (NAKA && status === 'CREATED') return UNCONFIRMED; // BETTING
  if (NAKA && status === 'VOTING') return BETTING;
  if (NBOT && status === 'VOTING') return VOTING;
  if (NAKA && ['WAITRESULT', 'OPENRESULTSET'].includes(status)) return RESULT_SETTING;
  if ((NBOT || NAKA) && status === 'PENDING') return PENDING; // VOTING
  if ((NBOT || NAKA) && status === 'WITHDRAW') return WITHDRAWING;
  throw Error(`Invalid Phase determined by these -> TOKEN: ${token} STATUS: ${status}`);
};

export function toFixed(num) {
  let x = num;
  if (Math.abs(x) < 1.0) {
    const e = parseInt(x.toString().split('e-')[1], 10);
    if (e) {
      x *= 10 ** (e - 1);
      x = `0.${(new Array(e)).join('0')}${x.toString().substring(2)}`;
    }
  } else {
    let e = parseInt(x.toString().split('+')[1], 10);
    if (e > 20) {
      e -= 20;
      x /= 10 ** e;
      x += (new Array(e + 1)).join('0');
    }
  }
  return x;
}
