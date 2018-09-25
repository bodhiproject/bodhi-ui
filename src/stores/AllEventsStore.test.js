import { observable } from 'mobx';
import { Routes, SortBy } from 'constants';
import cryptoRandomString from 'crypto-random-string';
import AllEventsStore from './AllEventsStore';
import { mockResetTopicList, mockResetOracleList, mockAddTopic, mockAddOracle } from '../network/graphql/queries/';

jest.mock('../network/graphql/queries'); // block and manually mock our backend

/** mock necessary http needed modules */
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
const navigatorMock = {};
global.navigator = navigatorMock;
global.localStorage = localStorageMock;
const sleep = ms => new Promise(res => setTimeout(res, ms));

describe('AllEventsStore', () => {
  let store;
  const addr = {
    address: cryptoRandomString(34),
    qtum: 2000,
    bot: 100,
  };
  const app = observable({
    sortBy: 'ASC',
    wallet: { addresses: [addr] },
    global: { syncBlockNum: 0 },
    refreshing: false,
    ui: { location: 0 },
  }); // mock the appstore
  beforeEach(() => {
    store = new AllEventsStore(app); // create a new instance before each test case
    mockResetOracleList();
    mockResetTopicList();
    for (let i = 0; i < 18; i++) {
      mockAddTopic({ txid: cryptoRandomString(64) });
      mockAddOracle({
        txid: cryptoRandomString(64),
        amounts: [],
        consensusThreshold: 100,
        address: 'cryptoRandomString(40)',
        topicAddress: 'cryptoRandomString(40)',
        resultSetEndTime: 10,
        endTime: 20,
        options: [],
      });
    }
  });

  /** all following test cases target specifically to the mock backend, eg. network/graphql/__mocks__/queries.js */
  it('Init', async () => {
    const curListNum = store.list.length;
    expect.assertions(4);
    expect(curListNum).toBe(0);
    await store.init();
    expect(app.ui.location).toBe(Routes.ALL_EVENTS);
    expect(store.list.length).toBe(curListNum + store.limit);
    expect(store.loadingFirst).toBe(false);
  });

  it('Load More Events', async () => {
    await store.init();
    const curSkip = store.skip;
    expect.assertions(6);
    expect(store.list.length).toBe(store.limit);
    expect(store.loadingMore).toBe(false);
    await store.loadMoreEvents();
    expect(store.list.length).toBe(36); // mock backend only has 36 events in total
    expect(store.loadingMore).toBe(false);
    expect(store.hasMore).toBe(false); // no events left in backend
    expect(store.skip).toBe(curSkip + store.limit);
  });

  it('Reaction SortBy', async () => {
    expect.assertions(4);
    expect(store.list.length).toBe(0);
    app.ui.location = Routes.ALL_EVENTS;
    const newSortBy = app.sortBy === SortBy.ASCENDING ? SortBy.DESCENDING : SortBy.ASCENDING;
    app.sortBy = newSortBy;
    await sleep(100);
    expect(store.app.ui.location).toBe(Routes.ALL_EVENTS);
    expect(store.app.sortBy).toBe(newSortBy);
    expect(store.list.length).toBe(store.limit);
  });

  it('Reaction Wallet Addr', async () => {
    expect.assertions(2);
    expect(store.list.length).toBe(0);
    app.ui.location = Routes.ALL_EVENTS;
    const newAddr = {
      address: cryptoRandomString(34),
      qtum: 200,
      bot: 10,
    };
    app.wallet.addresses.push(newAddr);
    await sleep(100);
    expect(store.list.length).toBe(store.limit);
  });

  it('Reaction BlockNum', async () => {
    expect.assertions(2);
    expect(store.list.length).toBe(0);
    app.ui.location = Routes.ALL_EVENTS;
    app.global.syncBlockNum = 1;
    await sleep(100);
    expect(store.list.length).toBe(store.limit);
  });

  it('Reaction Refreshing', async () => {
    expect.assertions(2);
    expect(store.list.length).toBe(0);
    app.ui.location = Routes.ALL_EVENTS;
    app.refreshing = true;
    await sleep(100);
    expect(store.list.length).toBe(store.limit);
  });
});
