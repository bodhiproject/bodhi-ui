import { Routes, SortBy } from 'constants';
import cryptoRandomString from 'crypto-random-string';

import AllEventsStore from './AllEventsStore';
import mockDB from '../../test/mockDB';
import { sleep, getMockAppStore } from '../helpers/testUtil';

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

describe('AllEventsStore', () => {
  let app;
  let store;

  beforeEach(() => {
    app = getMockAppStore();
    store = new AllEventsStore(app); // create a new instance before each test case
    mockDB.init();
  });

  /** all following test cases target specifically to the mock backend, eg. network/graphql/__mocks__/queries.js */
  it('Init', async () => {
    expect(store.list.length).toBe(0);

    await store.init();
    expect(app.ui.location).toBe(Routes.ALL_EVENTS);
    expect(store.list.length).toBe(store.limit);
    expect(store.loaded).toBe(true);
  });

  it('Load More Events', async () => {
    expect(store.skip).toBe(0);

    await store.init();
    expect(store.list.length).toBe(store.limit);
    expect(store.loadingMore).toBe(false);

    await store.loadMoreEvents();
    expect(store.list.length).toBe(40);
    expect(store.loadingMore).toBe(false);
    expect(store.hasMore).toBe(false); // no events left in backend
    expect(store.skip).toBe(store.skip);
  });

  it('Reaction SortBy', async () => {
    expect(store.list.length).toBe(0);
    app.ui.location = Routes.ALL_EVENTS;
    const newSortBy = app.sortBy === SortBy.ASCENDING ? SortBy.DESCENDING : SortBy.ASCENDING;
    app.sortBy = newSortBy;
    await sleep();
    expect(store.app.ui.location).toBe(Routes.ALL_EVENTS);
    expect(store.app.sortBy).toBe(newSortBy);
    expect(store.list.length).toBe(store.limit);
  });

  it('Reaction Wallet Addr', async () => {
    expect(store.list.length).toBe(0);
    app.ui.location = Routes.ALL_EVENTS;
    const newAddr = {
      address: cryptoRandomString(34),
      qtum: 200,
      bot: 10,
    };
    app.wallet.addresses.push(newAddr);
    await sleep();
    expect(store.list.length).toBe(store.limit);
  });

  it('Reaction BlockNum', async () => {
    expect(store.list.length).toBe(0);
    app.ui.location = Routes.ALL_EVENTS;
    app.global.syncBlockNum = 2;
    await sleep();
    expect(store.list.length).toBe(store.limit);
  });

  it('Reaction Refreshing', async () => {
    expect(store.list.length).toBe(0);
    app.ui.location = Routes.ALL_EVENTS;
    app.refreshing = true;
    await sleep();
    expect(store.list.length).toBe(store.limit);
  });
});
