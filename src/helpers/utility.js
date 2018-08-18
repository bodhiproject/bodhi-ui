import { BigNumber } from 'bignumber.js';
import moment from 'moment';
import _ from 'lodash';
import { defineMessages } from 'react-intl';

import { getIntlProvider } from './i18nUtil';
import { OracleStatus, SortBy, Phases } from '../constants';
import Zhlang from '../languageProvider/entries/zh-Hans-CN';
const { BETTING, VOTING, RESULT_SETTING, PENDING, FINALIZING, WITHDRAWING, UNCONFIRMED } = Phases;

const SATOSHI_CONVERSION = 10 ** 8;
const BOT_MIN_VALUE = 0.01; // eslint-disable-line
const GAS_COST = 0.0000004;
const FORMAT_DATE_TIME = 'MMM Do, YYYY H:mm:ss';
const FORMAT_SHORT_DATE_TIME = 'M/D/YY H:mm:ss';
const FORMAT_SHORT_DATE_TIME_CN = 'YY/M/D H:mm:ss';
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

  const conversionBN = new BigNumber(SATOSHI_CONVERSION);
  return new BigNumber(number).multipliedBy(conversionBN).toString(10);
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
  if (_.isNaN(Number(number))) {
    bn = new BigNumber(number, 16);
  } else {
    bn = new BigNumber(number);
  }

  const conversionBN = new BigNumber(SATOSHI_CONVERSION);
  return bn.dividedBy(conversionBN).toNumber();
}

/**
 * Converts the gas number to QTUM cost.
 * @param gas {Number} The gas number to convert.
 * @return {Number} The gas amount represented as QTUM.
 */
export function gasToQtum(gas) {
  if (!gas || !_.isFinite(gas)) {
    return undefined;
  }

  const gasCostBN = new BigNumber(GAS_COST);
  return new BigNumber(gas).multipliedBy(gasCostBN).toNumber();
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
  const dateTime = moment.unix(unixSeconds);
  if (moment.locale() === Zhlang.momentlocale) {
    return dateTime.format(FORMAT_SHORT_DATE_TIME_CN);
  }

  return dateTime.format(FORMAT_SHORT_DATE_TIME);
}

export function getEndTimeCountDownString(unixSeconds, locale, localeMessages) {
  const { day, hour, minute, second, end } = messages;
  const nowUnix = moment().unix();
  const unixDiff = unixSeconds - nowUnix;

  const { formatMessage } = getIntlProvider(locale, localeMessages);
  if (unixDiff <= 0) {
    return formatMessage(end);
  }

  return moment.duration(unixDiff, 'seconds').format(`d[${formatMessage(day)}] h[${formatMessage(hour)}] m[${formatMessage(minute)}] s[${formatMessage(second)}]`);
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
    const sorted = _.orderBy(oracles, ['blockNum'], [SortBy.DESCENDING.toLowerCase()]);
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
  const [BOT, QTUM] = [token === 'BOT', token === 'QTUM'];
  if (QTUM && status === 'CREATED') return UNCONFIRMED; // BETTING
  if (QTUM && status === 'VOTING') return BETTING;
  if (BOT && status === 'VOTING') return VOTING;
  if (QTUM && ['WAITRESULT', 'OPENRESULTSET'].includes(status)) return RESULT_SETTING;
  if ((BOT || QTUM) && status === 'PENDING') return PENDING; // VOTING
  if (BOT && status === 'WAITRESULT') return FINALIZING;
  if ((BOT || QTUM) && status === 'WITHDRAW') return WITHDRAWING;
  throw Error(`Invalid Phase determined by these -> TOKEN: ${token} STATUS: ${status}`);
};

export function processTopic(topic) {
  if (!topic) {
    return undefined;
  }

  const newTopic = _.assign({}, topic);
  newTopic.qtumAmount = _.map(topic.qtumAmount, satoshiToDecimal);
  newTopic.botAmount = _.map(topic.botAmount, satoshiToDecimal);
  newTopic.escrowAmount = satoshiToDecimal(topic.escrowAmount);
  newTopic.oracles = _.map(topic.oracles, processOracle);
  return newTopic;
}

export function processOracle(oracle) {
  if (!oracle) {
    return undefined;
  }

  const newOracle = _.assign({}, oracle);
  newOracle.amounts = _.map(oracle.amounts, satoshiToDecimal);
  newOracle.consensusThreshold = satoshiToDecimal(oracle.consensusThreshold);
  return newOracle;
}

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
