import { isEqual } from 'lodash';
import { EventType, TransactionType } from 'constants';
import cryptoRandomString from 'crypto-random-string';

import EventStore from './store';
import mockDB from '../../../test/mockDB';
import { getMockAppStore } from '../../helpers/testUtil';

// Test init
jest.mock('../../network/graphql/queries');
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
const navigatorMock = {};
global.navigator = navigatorMock;
global.localStorage = localStorageMock;

describe('EventStore', () => {
  let app;
  let store;

  beforeEach(() => {
    app = getMockAppStore();
    store = new EventStore(app); // create a new instance before each test case
    mockDB.init();
  });

  describe('constructor', () => {
    it('sets the values', () => {
      expect(isEqual(store.app, app)).toBe(true);
    });
  });

  describe('init()', () => {
    it('sets all the values for an Unconfirmed Oracle', async () => {
    });

    it('sets all the values for a Betting Oracle', async () => {
      const { topicAddress, address, txid } = mockDB.paginatedOracles.oracles[0];
      await store.init({
        topicAddress,
        address,
        txid,
        type: EventType.ORACLE,
      });

      // reset()
      expect(store.amount).toBe('');
      expect(store.transactionHistoryItems.length).toBe(0);
      expect(store.selectedOptionIdx).toBe(-1);
      expect(store.escrowClaim).toBe(0);
      expect(store.allowance).toBe(undefined);
      expect(store.nakaWinnings).toBe(0);
      expect(store.nbotWinnings).toBe(0);
      expect(store.withdrawableAddresses.length).toBe(0);

      // Oracle values
      expect(store.topicAddress).toBe(topicAddress);
      expect(store.address).toBe(address);
      expect(store.txid).toBe(txid);
      expect(store.type).toBe(EventType.ORACLE);
      expect(store.hashId).toBe(undefined);

      // initOracle()
      expect(store.oracles.length).toBe(1);
      expect(store.oracles[0].address).toBe(address);
      expect(store.loading).toBe(false);
      // TODO: txs
      // TODO: allowance API mock
    });

    it('sets all the values for a Result Setting Oracle', async () => {
    });

    it('sets all the values for a Voting Oracle', async () => {
    });

    it('sets all the values for a Withdrawing Topic', async () => {
    });

    it('sets the reactions', () => {
    });

    it('sets random values to transaction history', async () => {
      let numBets = 0;
      let numVotes = 0;
      let numResultsets = 0;
      let numWithdraws = 0;
      let numPendings = 0;
      const topicAddress = cryptoRandomString(40);

      mockDB.addTransactions(mockDB.generateTransaction({ topicAddress }));
      numPendings += 1;
      mockDB.addWithdraws(mockDB.generateWithdraw({ topicAddress }));
      mockDB.addWithdraws(mockDB.generateWithdraw({ topicAddress }));
      numWithdraws += 2;
      mockDB.addResultSets(mockDB.generateWithdraw({ oracleAddress: cryptoRandomString(40), topicAddress })); // result set
      mockDB.addResultSets(mockDB.generateWithdraw({ oracleAddress: cryptoRandomString(40), topicAddress }));
      mockDB.addResultSets(mockDB.generateWithdraw({ oracleAddress: null, topicAddress }));
      for (let i = 0; i < 10; i++) {
        const vote = mockDB.generateVote({ topicAddress });
        if (vote.type === TransactionType.BET) numBets += 1;
        if (vote.type === TransactionType.VOTE) numVotes += 1;
        if (vote.type === TransactionType.SET_RESULT) numResultsets += 1;
        mockDB.addVotes(vote);
      }

      await store.queryTransactions(topicAddress);

      expect(store.transactionHistoryItems.length).toBe(numPendings + numBets + numVotes + numResultsets + numWithdraws);
    });
  });
});
