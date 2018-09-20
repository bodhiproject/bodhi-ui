/** This is a mock module of ../queries.js,
 * so the test files link to this instead of connecting to backend
 * This file simply skip the backend retrival and fake query results and return
 * Current logic is straightforward but good enough to make tests
 * */
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

export function mockAddTransaction(newTransaction) {
  mockData.addTransactions(newTransaction);
}

export function mockAddOracle(newOracle) {
  mockData.addOracles(newOracle);
}

export function queryAllTopics(app, filters, orderBy, limit, skip) {
  const end = skip + limit <= mockData.topics.length ? skip + limit : mockData.topics.length;
  return mockData.topics.slice(skip, end);
}

export function queryAllOracles(app, filters, orderBy, limit, skip) {
  const end = skip + limit <= mockData.oracles.length ? skip + limit : mockData.oracles.length;
  return mockData.oracles.slice(skip, end);
}

export function queryAllTransactions(filters, orderBy, limit, skip) {
  const end = skip + limit <= mockData.transactions.length ? skip + limit : mockData.transactions.length;
  return mockData.transactions.slice(skip, end);
}
