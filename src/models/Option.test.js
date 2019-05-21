import { observable } from 'mobx';
import { Token, Phases, OracleStatus } from 'constants';
import Option from './Option';
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
const navigatorMock = {};
global.navigator = navigatorMock;
global.localStorage = localStorageMock;

const { NAKA, NBOT } = Token;
const { BETTING, VOTING } = Phases;

describe('Option Model', () => {
  const addr = {
    address: 'qSu4uU8MGp2Ya6j9kQZAtizUfC82aCvGT1',
    naka: 2000,
    nbot: 100,
  };
  const app = observable({
    sortBy: 'ASC',
    wallet: { addresses: [addr] },
    global: { syncBlockNum: 0 },
    refreshing: false,
    ui: { location: 0 },
    eventPage: { selectedOptionIdx: 0 },
  }); // mock the appstore
  let store;
  let oracle;
  beforeEach(() => {
    store = null;
    oracle = {
      txid: '0906a03d4ebb95258731970ef87cfc76b818e37aee35b0b6e17b9f620e0b5287',
      amounts: [99, 100],
      consensusThreshold: 100,
      address: '02e91962156da21fae38e65038279c020347e4ff',
      topicAddress: '4044f951857f2885d66d29a475235dacdaddea84',
      resultSetEndTime: 10,
      endTime: 20,
      options: ['0', '1'],
      token: NAKA,
      phase: BETTING,
      optionIdxs: [0, 1],
      status: OracleStatus.VOTING,
    };
  });

  describe('constructor()', () => {
    it('Constructor 1: centralized oracle unconfirmed', () => {
      const i = 0;
      const name = '0';
      store = new Option(name, i, oracle, app);

      expect(store.app).toBe(app);
      expect(store.idx).toBe(i);
      expect(store.amount).toBe(oracle.amounts[i]);
      expect(store.isLast).not.toBeTruthy();
      expect(store.isFirst).toBeTruthy();
      expect(store.name).toBe(name);
      expect(store.token).toBe(NAKA);
      expect(store.phase).toBe(BETTING);
      expect(store.value).toBe('99 NAKA');
      expect(store.percent).toBe(50);
      expect(store.isPrevResult).toBe(undefined);
      expect(store.maxAmount).toBe(undefined);
      expect(store.disabled).toBeTruthy();
    });

    it('Constructor 2: centralized oracle confirmed', () => {
      const name = '0';
      const i = 0;

      oracle.unconfirmed = false;
      store = new Option(name, i, oracle, app);

      expect(store.app).toBe(app);
      expect(store.idx).toBe(i);
      expect(store.amount).toBe(oracle.amounts[i]);
      expect(store.isLast).not.toBeTruthy();
      expect(store.isFirst).toBeTruthy();
      expect(store.name).toBe(name);
      expect(store.token).toBe(NAKA);
      expect(store.phase).toBe(BETTING);
      expect(store.value).toBe('99 NAKA');
      expect(store.percent).toBe(50);
      expect(store.isPrevResult).toBe(undefined);
      expect(store.maxAmount).toBe(undefined);
      expect(store.disabled).not.toBeTruthy();
    });

    it('Constructor 3: decentralized oracle confirmed & prev result', () => {
      const name = '1';
      const i = 1;

      oracle.token = NBOT;
      oracle.phase = VOTING;
      oracle.unconfirmed = false;
      oracle.optionIdxs = [0];
      store = new Option(name, i, oracle, app);

      expect(store.app).toBe(app);
      expect(store.idx).toBe(i);
      expect(store.amount).toBe(oracle.amounts[i]);
      expect(store.isLast).toBeTruthy();
      expect(store.isFirst).not.toBeTruthy();
      expect(store.name).toBe(name);
      expect(store.token).toBe(NBOT);
      expect(store.phase).toBe(VOTING);
      expect(store.value).toBe('100 NBOT');
      expect(store.percent).toBe(0);
      expect(store.isPrevResult).toBeTruthy();
      expect(store.maxAmount).toBe(0);
      expect(store.disabled).toBeTruthy();
    });

    it('Constructor 4: decentralized oracle confirmed & choosable', () => {
      const name = '1';
      const i = 1;

      oracle.token = NBOT;
      oracle.phase = VOTING;
      oracle.unconfirmed = false;
      oracle.optionIdxs = [1];
      store = new Option(name, i, oracle, app);

      expect(store.app).toBe(app);
      expect(store.idx).toBe(i);
      expect(store.amount).toBe(oracle.amounts[i]);
      expect(store.isLast).toBeTruthy();
      expect(store.isFirst).not.toBeTruthy();
      expect(store.name).toBe(name);
      expect(store.token).toBe(NBOT);
      expect(store.phase).toBe(VOTING);
      expect(store.value).toBe('100 NBOT');
      expect(store.percent).toBe(100);
      expect(store.isPrevResult).not.toBeTruthy();
      expect(store.maxAmount).toBe(0);
      expect(store.disabled).not.toBeTruthy();
    });
  });

  describe('toggleExpansion()', () => {
    it('toggleExpansion & expand', () => {
      const name = '1';
      const i = 1;

      oracle.token = NBOT;
      oracle.phase = VOTING;
      oracle.optionIdxs = [1];
      oracle.unconfirmed = false;
      store = new Option(name, i, oracle, app);

      app.eventPage.selectedOptionIdx = 0;
      expect(store.isExpanded).not.toBeTruthy();
      store.toggleExpansion();
      expect(app.eventPage.selectedOptionIdx).toBe(i);
      expect(store.isExpanded).toBeTruthy();
    });

    it('toggleExpansion & unexpand', () => {
      const name = 'cons test 4';
      const i = 1;

      oracle.token = NBOT;
      oracle.phase = VOTING;
      oracle.optionIdxs = [1];
      oracle.unconfirmed = false;
      store = new Option(name, i, oracle, app);

      app.eventPage.selectedOptionIdx = 1;
      expect(store.isExpanded).toBeTruthy();
      store.toggleExpansion();
      expect(app.eventPage.selectedOptionIdx).toBe(-1);
      expect(store.isExpanded).not.toBeTruthy();
    });
  });
});
