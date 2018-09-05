import { Routes } from 'constants';
jest.mock('../network/graphql/queries'); // block and manually mock our backend
import AllEventsStore from './AllEventsStore'; // eslint-disable-line

/** mock necessary http needed modules */
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
const navigatorMock = {};
global.navigator = navigatorMock;
global.localStorage = localStorageMock;

/** test */
describe('AllEventsStore', () => {
  let store;
  const app = {
    sortBy: 'ASC',
    wallet: { addresses: 0 },
    global: { syncBlockNum: 0 },
    refreshing: false,
    ui: { location: 0 },
  }; // mock the appstore
  beforeEach(() => {
    store = new AllEventsStore(app); // create a new instance before each test case
  });

  /** all following test cases target specifically to the mock backend, eg. network/graphql/__mocks__/queries.js */
  it('Init', async () => {
    const curListNum = store.list.length;
    expect(curListNum).toBe(0);
    expect.assertions(4);
    await store.init();
    expect(app.ui.location).toBe(Routes.ALL_EVENTS); // test webpage location
    expect(store.list.length).toBe(curListNum + store.limit); // test if list got new cards
    expect(store.loading).toBe(false); // test runInAction changes
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

  /** following test cases test the reaction function */
  it('Reaction SortBy', () => {
    app.ui.location = Routes.ALL_EVENTS;
    app.sortBy = 'Yo';
    setTimeout(() => {
      expect.assertions(2);
      expect(store.app.sortBy).toBe('Yo');
      expect(store.list.length).toBe(store.limit);
    }, 500);
  });

  it('Reaction Wallet Addr', () => {
    app.ui.location = Routes.ALL_EVENTS;
    app.wallet.addresses = 1;
    setTimeout(() => {
      expect.assertions(1);
      expect(store.list.length).toBe(store.limit);
    }, 500);
  });

  it('Reaction BlockNum', () => {
    app.ui.location = Routes.ALL_EVENTS;
    app.global.syncBlockNum = 1;
    setTimeout(() => {
      expect.assertions(1);
      expect(store.list.length).toBe(store.limit);
    }, 500);
  });

  it('Reaction Refreshing', () => {
    app.ui.location = Routes.ALL_EVENTS;
    app.refreshing = true;
    setTimeout(() => {
      expect.assertions(1);
      expect(store.list.length).toBe(store.limit);
    }, 500);
  });
});
