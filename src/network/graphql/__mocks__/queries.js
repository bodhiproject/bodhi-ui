/** This is a mock module of ../queries.js,
 * so the test files link to this instead of connecting to backend
 * this mock module is a interface between stores and mockData module.
 * */
import { orderBy as lodashOrderBy, flatten, uniqBy, each, forEach, filter as lodashFilter, toInteger } from 'lodash';
import cryptoRandomString from 'crypto-random-string';
import moment from 'moment';
import { TransactionStatus } from 'constants';
import { Transaction } from 'models';

import mockData from '../../../../test/mockDB';

export function mockResetAllList() {
  mockData.resetAll();
}

export function mockResetTopicList() {
  mockData.resetTopics();
}

export function mockResetOracleList() {
  mockData.resetOracles();
}

export function mockAddTopic(newTopic) {
  mockData.addTopics(newTopic);
}

export function mockResetTransactionList() {
  mockData.resetTransactions();
}

export function mockAddTransaction(args) {
  const tx = new Transaction({
    txid: cryptoRandomString(64),
    status: 'PENDING',
    createdTime: moment.unix(),
  });
  Object.assign(tx, args);
  mockData.addTransactions(tx);
  return tx;
}

export function mockAddOracle(newOracle) {
  mockData.addOracles(newOracle);
}

export function mockSetTxStatus(tx, status) {
  tx.status = status;
}

export function mockSetAllTxsSuccess(txs) {
  each(txs, tx => mockSetTxStatus(tx, TransactionStatus.SUCCESS));
}

export function queryAllTopics(app, filters, orderBy, limit, skip) {
  const end = skip + limit <= mockData.paginatedTopics.topics.length ? skip + limit : mockData.paginatedTopics.topics.length;
  const topics = mockData.paginatedTopics.topics.slice(skip, end);
  const pageNumber = toInteger(end / limit);
  return {
    totalCount: mockData.paginatedTopics.totalCount,
    topics,
    pageInfo: {
      hasNextPage: end < mockData.paginatedTopics.totalCount,
      pageNumber,
      count: topics.length,
    },
  };
}

export function queryAllOracles(app, filters, orderBy, limit, skip) {
  const { oracles, totalCount } = mockData.paginatedOracles;

  // Filter
  let filtered = flatten(filters.map((filter) => lodashFilter(oracles, filter)));

  // Order
  const orderFields = [];
  const orderDirections = [];
  forEach(orderBy, (order) => {
    orderDirections.push(order.direction);
    orderFields.push(order.field);
  });
  filtered = lodashOrderBy(filtered, orderFields, orderDirections);

  // Paginate
  const end = skip + limit <= filtered.length ? skip + limit : filtered.length;
  filtered = filtered.slice(skip, end);

  return {
    totalCount,
    oracles,
    pageInfo: {
      count: filtered.length,
      hasNextPage: end < totalCount,
      pageNumber: toInteger(end / limit),
    },
  };
}

export function queryAllTransactions(filters, orderBy, limit = 0, skip = 0) {
  const filteredTxs = uniqBy(flatten(filters.map((filter) => lodashFilter(mockData.transactions, filter))), 'txid');
  const orderFields = [];
  const orderDirections = [];
  forEach(orderBy, (order) => {
    orderDirections.push(order.direction);
    orderFields.push(order.field);
  });
  const result = lodashOrderBy(filteredTxs, orderFields, orderDirections);
  const end = skip + (limit > 0 && limit <= mockData.transactions.length) ? skip + limit : mockData.transactions.length;
  return result.slice(skip, end);
}
