const { sortBy, map } = require('lodash');
const TokenExchangeMeta = require('./contracts/token-exchange');
const NakaBodhiTokenMeta = require('./contracts/naka-bodhi-token');
const EventFactoryMeta = require('./contracts/event-factory');
const MultipleResultsEventMeta = require('./contracts/multiple-results-event');

/**
 * Gets the TokenExchange contract metadata.
 * @return {object} TokenExchange contract metadata.
 */
export const TokenExchange = () => TokenExchangeMeta;

/**
 * Gets the NakaBodhiToken contract metadata.
 * @return {object} NakaBodhiToken contract metadata.
 */
export const NakaBodhiToken = () => NakaBodhiTokenMeta;

/**
 * Gets the latest EventFactory contract metadata.
 * @return {object} Latest EventFactory contract metadata.
 */
export const EventFactory = () => {
  let keys = Object.keys(EventFactoryMeta);
  keys = sortBy(map(keys, key => Number(key)));
  const latestVersion = keys[keys.length - 1];
  return EventFactoryMeta[`${latestVersion}`];
};

/**
 * Gets the MultipleResultsEvent contract metadata.
 * @param {number} version Version of the contract.
 * @return {object} MultipleResultsEvent contract metadata.
 */
export const MultipleResultsEvent = (version) =>
  MultipleResultsEventMeta[`${version}`];
