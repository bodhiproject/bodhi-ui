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
    it('sets all the values for a Betting Oracle', async () => {
      const { topicAddress, address, txid } = mockDB.oracles[0];
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
      // expect(store.buttonDisabled).toBe(false);
      // expect(store.warningType).toBe('');
      // expect(store.eventWarningMessageId).toBe('');
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
    });
  });

  // it('Init', async () => {
  //   const curListNum = store.list.length;
  //   expect.assertions(4);
  //   expect(curListNum).toBe(0);
  //   await store.init();
  //   expect(app.ui.location).toBe(Routes.ALL_EVENTS);
  //   expect(store.list.length).toBe(curListNum + store.limit);
  //   expect(store.loaded).toBe(true);
  // });

  // it('Load More Events', async () => {
  //   await store.init();
  //   const curSkip = store.skip;
  //   expect.assertions(6);
  //   expect(store.list.length).toBe(store.limit);
  //   expect(store.loadingMore).toBe(false);
  //   await store.loadMoreEvents();
  //   expect(store.list.length).toBe(36); // mock backend only has 36 events in total
  //   expect(store.loadingMore).toBe(false);
  //   expect(store.hasMore).toBe(false); // no events left in backend
  //   expect(store.skip).toBe(curSkip + store.limit);
  // });

  // it('Reaction SortBy', async () => {
  //   expect.assertions(4);
  //   expect(store.list.length).toBe(0);
  //   app.ui.location = Routes.ALL_EVENTS;
  //   const newSortBy = app.sortBy === SortBy.ASCENDING ? SortBy.DESCENDING : SortBy.ASCENDING;
  //   app.sortBy = newSortBy;
  //   await sleep(100);
  //   expect(store.app.ui.location).toBe(Routes.ALL_EVENTS);
  //   expect(store.app.sortBy).toBe(newSortBy);
  //   expect(store.list.length).toBe(store.limit);
  // });

  // it('Reaction Wallet Addr', async () => {
  //   expect.assertions(2);
  //   expect(store.list.length).toBe(0);
  //   app.ui.location = Routes.ALL_EVENTS;
  //   const newAddr = {
  //     address: cryptoRandomString(34),
  //     qtum: 200,
  //     bot: 10,
  //   };
  //   app.wallet.addresses.push(newAddr);
  //   await sleep(100);
  //   expect(store.list.length).toBe(store.limit);
  // });

  // it('Reaction BlockNum', async () => {
  //   expect.assertions(2);
  //   expect(store.list.length).toBe(0);
  //   app.ui.location = Routes.ALL_EVENTS;
  //   app.global.syncBlockNum = 1;
  //   await sleep(100);
  //   expect(store.list.length).toBe(store.limit);
  // });

  // it('Reaction Refreshing', async () => {
  //   expect.assertions(2);
  //   expect(store.list.length).toBe(0);
  //   app.ui.location = Routes.ALL_EVENTS;
  //   app.refreshing = true;
  //   await sleep(100);
  //   expect(store.list.length).toBe(store.limit);
  // });
});
