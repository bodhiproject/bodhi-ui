import cryptoRandomString from 'crypto-random-string';
import { times } from 'lodash';
import moment from 'moment';
import { OracleStatus, Token } from 'constants';

import { decimalToSatoshi, randomInt } from '../../../helpers/utility';

/**
 * This is a storage class work for mocking graphql
 * so the test files link to this instead of connecting to backend.
 * This file simply skip the backend retrival and fake query results and return.
 * Current logic is straightforward but good enough to make tests.
 * */
export default {
  paginatedOracles: { totalCount: 0, oracles: [], pageInfo: { hasNextPage: true, count: 0, pageNumber: 1 } },
  paginatedTopics: { totalCount: 0, topics: [], pageInfo: { hasNextPage: true, count: 0, pageNumber: 1 } },
  transactions: [],

  // Call this to populate the entire DB with mock data in all tables.
  initDB() {
    this.addTopics(times(10, this.generateTopic()));
    this.addOracles(times(10, () => {
      const topic = this.getRandomTopic();
      return this.generateOracle(topic.address);
    }));
  },

  generateTopic(params) {
    const topic = {
      txid: cryptoRandomString(64),
      blockNum: Math.random() * 1000,
      address: cryptoRandomString(40),
      creatorAddress: `q${cryptoRandomString(33)}`,
      hashId: cryptoRandomString(32),
      status: OracleStatus.VOTING,
      name: 'Test Topic',
      options: ['A', 'B', 'C'],
      qtumAmount: times(3, decimalToSatoshi(Math.random())),
      botAmount: times(3, decimalToSatoshi(Math.random())),
      resultIdx: randomInt(0, 2),
      escrowAmount: decimalToSatoshi(5),
      language: 'en-US',
    };
    Object.assign(topic, params);
    return topic;
  },

  addTopics(newTopics) {
    this.paginatedTopics.topics.push(newTopics);
    this.paginatedTopics.totalCount = this.paginatedTopics.totalCount + 1;
  },

  getRandomTopic() {
    return this.topics[Math.floor(Math.random() * this.topics.length)];
  },

  generateOracle(params) {
    const currentUnix = moment.unix();
    const oracle = {
      txid: cryptoRandomString(64),
      blockNum: Math.random() * 1000,
      address: cryptoRandomString(40),
      topicAddress: cryptoRandomString(40),
      status: OracleStatus.VOTING,
      name: 'Test Oracle',
      options: ['A', 'B', 'C'],
      optionIdxs: [0, 1, 2],
      resultIdx: randomInt(0, 2),
      amounts: times(3, decimalToSatoshi(Math.random())),
      token: Token.QTUM,
      consensusThreshold: decimalToSatoshi(100),
      startTime: currentUnix,
      endTime: currentUnix + 100,
      resultSetStartTime: currentUnix + 200,
      resultSetEndTime: currentUnix + 300,
      language: 'en-US',
    };
    Object.assign(oracle, params);
    return oracle;
  },

  addOracles(newOracles) {
    this.paginatedOracles.oracles.push(newOracles);
    this.paginatedOracles.totalCount = this.paginatedOracles.totalCount + 1;
  },

  addTransactions(newTransactions) {
    this.transactions.push(newTransactions);
  },

  resetAll() {
    this.paginatedOracles = { totalCount: 0, oracles: [], pageInfo: { hasNextPage: true, count: 0, pageNumber: 1 } };
    this.paginatedTopics = { totalCount: 0, topics: [], pageInfo: { hasNextPage: true, count: 0, pageNumber: 1 } };
    this.transactions = [];
  },

  resetTopics() {
    this.paginatedTopics = { totalCount: 0, topics: [], pageInfo: { hasNextPage: true, count: 0, pageNumber: 1 } };
  },

  resetOracles() {
    this.paginatedOracles = { totalCount: 0, oracles: [], pageInfo: { hasNextPage: true, count: 0, pageNumber: 1 } };
  },

  resetTransactions() {
    this.transactions = [];
  },
};
