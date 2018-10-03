/** This is a mock module of ../queries.js,
 * so the test files link to this instead of connecting to backend
 * this mock module is a interface between stores and mockData module.
 * */
import { orderBy as lodashOrderBy, flatten, uniqBy, each, forEach, filter as lodashFilter } from 'lodash';
import cryptoRandomString from 'crypto-random-string';
import moment from 'moment';
import { TransactionStatus } from 'constants';
import { Transaction } from 'models';

import mockData from './mockData';

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
  const end = skip + limit <= mockData.topics.length ? skip + limit : mockData.topics.length;
  return mockData.topics.slice(skip, end);
}

export function queryAllOracles(app, filters, orderBy, limit, skip) {
  const end = skip + limit <= mockData.oracles.length ? skip + limit : mockData.oracles.length;
  return mockData.oracles.slice(skip, end);
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
