import cryptoRandomString from 'crypto-random-string';
import { times, each } from 'lodash';
import moment from 'moment';
import { OracleStatus, Token, TransactionStatus, TransactionType } from 'constants';
import { Transaction, ResultSet, Vote, Withdraw } from 'models';

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
  paginatedAccumulatedVotes: {
    totalCount: 0,
    votes: [],
    pageInfo: {
      hasNextPage: true,
      count: 0,
      pageNumber: 1,
    },
  },
  transactions: [],
  withdraws: [],
  resultSets: [],
  votes: [],
};

/**
 * Storage class abstraction for mocking the GraphQL DB.
 * Mock GraphQL queries and mutations can use this directly.
 */
export default {
  paginatedTopics: INIT_VALUES.paginatedTopics,
  paginatedOracles: INIT_VALUES.paginatedOracles,
  paginatedAccumulatedVotes: INIT_VALUES.paginatedAccumulatedVotes,
  transactions: [],
  withdraws: [],
  resultSets: [],
  votes: [],

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
      nakaAmount: times(3, () => decimalToSatoshi(randomInt(1, 10))),
      nbotAmount: times(3, () => decimalToSatoshi(randomInt(1, 10))),
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
      token: Token.NAKA,
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

  generateAccumulatedVote() {
    return {
      topicAddress: cryptoRandomString(40),
      voterAddress: `q${cryptoRandomString(33)}`,
      amount: times(3, decimalToSatoshi(randomInt(1, 10))),
      token: Token.NAKA,
    };
  },

  addAccumulatedVote(vote) {
    this.paginatedAccumulatedVotes.votes.push(vote);
    this.paginatedAccumulatedVotes.totalCount = this.paginatedAccumulatedVotes.totalCount + 1;
  },

  resetAccumulatedVote() {
    this.paginatedAccumulatedVotes = INIT_VALUES.paginatedAccumulatedVotes;
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

  /* Withdraws */
  generateWithdraw(params) {
    const isNaka = randomInt(0, 1);
    const tx = new Withdraw({
      txid: cryptoRandomString(64),
      block: {
        blockNum: randomInt(1, 1000),
        blockTime: moment.unix(),
      },
      topicAddress: cryptoRandomString(40),
      withdrawerAddress: cryptoRandomString(40),
      nakaAmount: isNaka ? decimalToSatoshi(randomInt(1, 10)) : 0,
      nbotAmount: !isNaka ? decimalToSatoshi(randomInt(1, 10)) : 0,
      version: 0,
      type: !isNaka ? 'ESCROW' : 'WINNING',
    });
    Object.assign(tx, params);
    return tx;
  },

  addWithdraws(newWithdraws) {
    this.withdraws.push(newWithdraws);
  },

  resetWithdraws() {
    this.withdraws = INIT_VALUES.withdraws;
  },

  /* Result Sets */
  generateResultSet(params) {
    const isWithdraw = randomInt(0, 1);
    const tx = new ResultSet({
      txid: cryptoRandomString(64),
      block: {
        blockNum: randomInt(1, 1000),
        blockTime: moment.unix(),
      },
      topicAddress: cryptoRandomString(40),
      oracleAddress: isWithdraw ? null : cryptoRandomString(40),
      fromAddress: cryptoRandomString(40),
      resultIdx: randomInt(0, 2),
      version: 0,
    });
    Object.assign(tx, params);
    return tx;
  },

  addResultSets(newResultSets) {
    this.resultSets.push(newResultSets);
  },

  resetResultSets() {
    this.resultSets = INIT_VALUES.resultSets;
  },

  /* Votes */
  generateVote(params) {
    const types = [TransactionType.BET, TransactionType.VOTE, TransactionType.SET_RESULT];
    const whichType = randomInt(0, 2);
    const tx = new Vote({
      txid: cryptoRandomString(64),
      block: {
        blockNum: randomInt(1, 1000),
        blockTime: moment.unix(),
      },
      topicAddress: cryptoRandomString(40),
      oracleAddress: cryptoRandomString(40),
      voterAddress: cryptoRandomString(40),
      optionIdx: randomInt(0, 2),
      amount: decimalToSatoshi(randomInt(1, 10)),
      version: 0,
      token: whichType === 0 ? Token.NAKA : Token.NBOT,
      type: types[whichType],
    });
    Object.assign(tx, params);
    return tx;
  },

  addVotes(newVotes) {
    this.votes.push(newVotes);
  },

  resetVotes() {
    this.votes = INIT_VALUES.votes;
  },
};
