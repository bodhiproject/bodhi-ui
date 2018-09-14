import Option from './Option';
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
const navigatorMock = {};
global.navigator = navigatorMock;
global.localStorage = localStorageMock;

describe('stores/models/Option', () => {
  const addr = {
    address: 'qSu4uU8MGp2Ya6j9kQZAtizUfC82aCvGT1',
    qtum: 2000,
    bot: 100,
  };
  const app = {
    sortBy: 'ASC',
    wallet: { addresses: [addr] },
    global: { syncBlockNum: 0 },
    refreshing: false,
    ui: { location: 0 },
  }; // mock the appstore
  const oracle = {
    txid: 0,
    amounts: [],
    consensusThreshold: 100,
    address: '02e91962156da21fae38e65038279c020347e4ff',
    topicAddress: '4044f951857f2885d66d29a475235dacdaddea84',
    resultSetEndTime: 10,
    endTime: 20,
    options: [],
  };
  let store;
  // beforeEach(() => store = new Option());
  it('haha', () => expect(1).toBe(1));
});
