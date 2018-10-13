import cryptoRandomString from 'crypto-random-string';
import { times, each } from 'lodash';
import moment from 'moment';
import { OracleStatus, Token, TransactionStatus } from 'constants';
import { Transaction } from 'models';

import { decimalToSatoshi } from '../src/helpers/utility';
import { randomInt } from '../src/helpers/testUtil';

const INIT_VALUES = {
  paginatedTopics: {
    totalCount: 0,
    topics: [],
    pageInfo: {
      hasNextPage: true,
      count: 0,
      pageNumber: 1,
    },
  },
  paginatedOracles: {
    totalCount: 0,
    oracles: [],
    pageInfo: {
      hasNextPage: true,
      count: 0,
      pageNumber: 1,
    },
  },
  transactions: [],
};

/**
 * Storage class abstraction for mocking the GraphQL DB.
 * Mock GraphQL queries and mutations can use this directly.
 */
export default {
  paginatedTopics: INIT_VALUES.paginatedTopics,
  paginatedOracles: INIT_VALUES.paginatedOracles,
  transactions: [],

  // Call this to populate the entire DB with mock data in all tables.
  init() {
    this.resetAll();

    for (let i = 0; i < 20; i++) {
      this.addTopics(this.generateTopic());
    }
    for (let i = 0; i < 20; i++) {
      const topic = this.getRandomTopic();
      this.addOracles(this.generateOracle(topic.address));
    }
  },

  resetAll() {
    Object.assign(this, INIT_VALUES);
  },

  /* Topics */
  generateTopic(params) {
    const topic = {
      txid: cryptoRandomString(64),
      blockNum: randomInt(1, 1000),
      address: cryptoRandomString(40),
      creatorAddress: `q${cryptoRandomString(33)}`,
      hashId: cryptoRandomString(32),
      status: OracleStatus.WITHDRAW,
      name: `Test Topic ${randomInt(1, 10000)}`,
      options: ['A', 'B', 'C'],
      qtumAmount: times(3, () => decimalToSatoshi(randomInt(1, 10))),
      botAmount: times(3, () => decimalToSatoshi(randomInt(1, 10))),
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
    return this.paginatedTopics.topics[Math.floor(Math.random() * this.paginatedTopics.totalCount)];
  },

  resetTopics() {
    this.paginatedTopics = INIT_VALUES.paginatedTopics;
  },

  /* Oracles */
  generateOracle(params) {
    const currentUnix = moment.unix();
    const oracle = {
      txid: cryptoRandomString(64),
      blockNum: randomInt(1, 1000),
      address: cryptoRandomString(40),
      topicAddress: cryptoRandomString(40),
      status: OracleStatus.VOTING,
      name: 'Test Oracle',
      options: ['A', 'B', 'C'],
      optionIdxs: [0, 1, 2],
      resultIdx: randomInt(0, 2),
      amounts: times(3, decimalToSatoshi(randomInt(1, 10))),
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

  resetOracles() {
    this.paginatedOracles = INIT_VALUES.paginatedOracles;
  },

  /* Transactions */
  generateTransaction(params) {
    const tx = new Transaction({
      txid: cryptoRandomString(64),
      status: 'PENDING',
      createdTime: moment.unix(),
    });
    Object.assign(tx, params);
    return tx;
  },

  addTransactions(newTransactions) {
    this.transactions.push(newTransactions);
  },

  resetTransactions() {
    this.transactions = INIT_VALUES.transactions;
  },

  setAllTxsSuccess() {
    each(this.transactions, tx => tx.status = TransactionStatus.SUCCESS);
  },
};
