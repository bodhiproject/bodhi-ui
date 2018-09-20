import { observable } from 'mobx';
import { Routes } from 'constants';
import AllEventsStore from './AllEventsStore';
import { queryAllOracles, mockResetTopicList, mockResetOracleList, mockAddTopic, mockAddOracle } from '../network/graphql/queries/';

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
    address: 'qSu4uU8MGp2Ya6j9kQZAtizUfC82aCvGT1',
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
    for (let i = 0; i < 24; i++) {
      mockAddTopic({ txid: i });
      mockAddOracle({
        txid: i,
        amounts: [],
        consensusThreshold: 100,
        address: '02e91962156da21fae38e65038279c020347e4ff',
        topicAddress: '4044f951857f2885d66d29a475235dacdaddea84',
        resultSetEndTime: 10,
        endTime: 20,
        options: [],
      });
    }
  });

  /** all following test cases target specifically to the mock backend, eg. network/graphql/__mocks__/queries.js */
  it('Init', async () => {
    const curListNum = store.list.length;
    expect(curListNum).toBe(0);
    expect.assertions(4);
    await store.init();
    expect(app.ui.location).toBe(Routes.ALL_EVENTS);
    expect(store.list.length).toBe(curListNum + store.limit);
    expect(store.loading).toBe(false);
  });

  it('Load More Events', async () => {
    await store.init();
    const curSkip = store.skip;
    const curListNum = store.list.length;
    expect.assertions(6);
    expect(store.list.length).toBe(store.limit);
    expect(store.loadingMore).toBe(false);
    await store.loadMoreEvents();
    expect(store.list.length).toBe((curListNum + store.limit) - 2); // mock backend only has 46 events in total
    expect(store.loadingMore).toBe(false);
    expect(store.hasMore).toBe(false); // no events left in backend
    expect(store.skip).toBe(curSkip + store.limit);
  });

  it('Reaction SortBy', () => {
    expect.assertions(3);
    expect(store.list.length).toBe(0);
    app.ui.location = Routes.ALL_EVENTS;
    app.sortBy = 'Yo';
    const a = queryAllOracles(null, null, 100, 0);
    sleep(500);
    expect(a.length).toBe(store.limit);
    expect(store.app.location).toBe(Routes.ALL_EVENTS);
    expect(store.app.sortBy).toBe('Yo');
    expect(store.list.length).toBe(store.limit);
  });

  it('Reaction Wallet Addr', () => {
    expect.assertions(2);
    expect(store.list.length).toBe(0);
    app.ui.location = Routes.ALL_EVENTS;
    const newAddr = {
      address: 'qSu4uU8MGp2Ya6j9kQZAtizUfC82aCvGT2',
      qtum: 200,
      bot: 10,
    };
    app.wallet.addresses.push(newAddr);
    sleep(500);
    expect(store.list.length).toBe(store.limit);
  });

  it('Reaction BlockNum', () => {
    expect.assertions(2);
    expect(store.list.length).toBe(0);
    app.ui.location = Routes.ALL_EVENTS;
    app.global.syncBlockNum = 1;
    sleep(500);
    expect(store.list.length).toBe(store.limit);
  });

  it('Reaction Refreshing', () => {
    expect.assertions(2);
    expect(store.list.length).toBe(0);
    app.ui.location = Routes.ALL_EVENTS;
    app.refreshing = true;
    sleep(500);
    expect(store.list.length).toBe(store.limit);
  });
});
