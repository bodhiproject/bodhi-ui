import { isEqual } from 'lodash';
import { EventType } from 'constants';

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
      expect(store.transactions.length).toBe(0);
      expect(store.selectedOptionIdx).toBe(-1);
      expect(store.escrowClaim).toBe(0);
      expect(store.allowance).toBe(undefined);
      expect(store.qtumWinnings).toBe(0);
      expect(store.botWinnings).toBe(0);
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

    it('sets all the values for a Finalizing Oracle', async () => {
    });

    it('sets all the values for a Withdrawing Topic', async () => {
    });

    it('sets the reactions', () => {
    });
  });
});
