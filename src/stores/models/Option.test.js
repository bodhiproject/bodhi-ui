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

const { QTUM, BOT } = Token;
const { BETTING, VOTING, FINALIZING } = Phases;

describe('stores/models/Option', () => {
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
    eventPage: { selectedOptionIdx: 0 },
  }); // mock the appstore
  let store;
  beforeEach(() => store = null);
  it('Constructor 1: centralized oracle unconfirmed', () => {
    const name = 'cons test 1';
    const i = 0;
    const oracle = observable({
      txid: 0,
      amounts: [99, 100],
      consensusThreshold: 100,
      address: '02e91962156da21fae38e65038279c020347e4ff',
      topicAddress: '4044f951857f2885d66d29a475235dacdaddea84',
      resultSetEndTime: 10,
      endTime: 20,
      options: [name, 'cons test 2'],
      token: QTUM,
      phase: BETTING,
      optionIdxs: [0, 1],
      status: OracleStatus.VOTING,
      unconfirmed: true,
    });
    store = new Option(name, i, oracle, app);

    expect(store.app).toBe(app);
    expect(store.idx).toBe(i);
    expect(store.amount).toBe(oracle.amounts[i]);
    expect(store.isLast).not.toBeTruthy();
    expect(store.isFirst).toBeTruthy();
    expect(store.name).toBe(name);
    expect(store.token).toBe(QTUM);
    expect(store.phase).toBe(BETTING);
    expect(store.value).toBe('99 QTUM');
    expect(store.percent).toBe(50);
    expect(store.isPrevResult).toBe(undefined);
    expect(store.maxAmount).toBe(undefined);
    expect(store.isFinalizing).toBe(undefined);
    expect(store.disabled).toBeTruthy();
  });

  it('Constructor 2: centralized oracle confirmed', () => {
    const name = 'cons test 2';
    const i = 0;
    const oracle = observable({
      txid: 0,
      amounts: [99, 100],
      consensusThreshold: 100,
      address: '02e91962156da21fae38e65038279c020347e4ff',
      topicAddress: '4044f951857f2885d66d29a475235dacdaddea84',
      resultSetEndTime: 10,
      endTime: 20,
      options: [name, 'cons test 3'],
      token: QTUM,
      phase: BETTING,
      optionIdxs: [0, 1],
      status: OracleStatus.VOTING,
      unconfirmed: false,
    });
    store = new Option(name, i, oracle, app);

    expect(store.app).toBe(app);
    expect(store.idx).toBe(i);
    expect(store.amount).toBe(oracle.amounts[i]);
    expect(store.isLast).not.toBeTruthy();
    expect(store.isFirst).toBeTruthy();
    expect(store.name).toBe(name);
    expect(store.token).toBe(QTUM);
    expect(store.phase).toBe(BETTING);
    expect(store.value).toBe('99 QTUM');
    expect(store.percent).toBe(50);
    expect(store.isPrevResult).toBe(undefined);
    expect(store.maxAmount).toBe(undefined);
    expect(store.isFinalizing).toBe(undefined);
    expect(store.disabled).not.toBeTruthy();
  });

  it('Constructor 3: decentralized oracle confirmed & prev result', () => {
    const name = 'cons test 3';
    const i = 1;
    const oracle = observable({
      txid: 0,
      amounts: [99, 100],
      consensusThreshold: 100,
      address: '02e91962156da21fae38e65038279c020347e4ff',
      topicAddress: '4044f951857f2885d66d29a475235dacdaddea84',
      resultSetEndTime: 10,
      endTime: 20,
      options: [name, 'cons test 4'],
      token: BOT,
      phase: VOTING,
      optionIdxs: [0],
      status: OracleStatus.Voting,
      unconfirmed: false,
    });
    store = new Option(name, i, oracle, app);

    expect(store.app).toBe(app);
    expect(store.idx).toBe(i);
    expect(store.amount).toBe(oracle.amounts[i]);
    expect(store.isLast).toBeTruthy();
    expect(store.isFirst).not.toBeTruthy();
    expect(store.name).toBe(name);
    expect(store.token).toBe(BOT);
    expect(store.phase).toBe(VOTING);
    expect(store.value).toBe(undefined);
    expect(store.percent).toBe(0);
    expect(store.isPrevResult).toBeTruthy();
    expect(store.maxAmount).toBe(0);
    expect(store.isFinalizing).not.toBeTruthy();
    expect(store.disabled).toBeTruthy();
  });

  it('Constructor 4: decentralized oracle confirmed & choosable', () => {
    const name = 'cons test 4';
    const i = 1;
    const oracle = observable({
      txid: 0,
      amounts: [99, 100],
      consensusThreshold: 100,
      address: '02e91962156da21fae38e65038279c020347e4ff',
      topicAddress: '4044f951857f2885d66d29a475235dacdaddea84',
      resultSetEndTime: 10,
      endTime: 20,
      options: [name, 'cons test 5'],
      token: BOT,
      phase: VOTING,
      optionIdxs: [1],
      status: OracleStatus.Voting,
      unconfirmed: false,
    });
    store = new Option(name, i, oracle, app);

    expect(store.app).toBe(app);
    expect(store.idx).toBe(i);
    expect(store.amount).toBe(oracle.amounts[i]);
    expect(store.isLast).toBeTruthy();
    expect(store.isFirst).not.toBeTruthy();
    expect(store.name).toBe(name);
    expect(store.token).toBe(BOT);
    expect(store.phase).toBe(VOTING);
    expect(store.value).toBe(undefined);
    expect(store.percent).toBe(100);
    expect(store.isPrevResult).not.toBeTruthy();
    expect(store.maxAmount).toBe(0);
    expect(store.isFinalizing).not.toBeTruthy();
    expect(store.disabled).not.toBeTruthy();
  });

  it('Constructor 5: decentralized oracle confirmed & prev result & finalizing', () => {
    const name = 'cons test 5';
    const i = 1;
    const oracle = observable({
      txid: 0,
      amounts: [99, 100],
      consensusThreshold: 100,
      address: '02e91962156da21fae38e65038279c020347e4ff',
      topicAddress: '4044f951857f2885d66d29a475235dacdaddea84',
      resultSetEndTime: 10,
      endTime: 20,
      options: [name, 'cons test 6'],
      token: BOT,
      phase: FINALIZING,
      optionIdxs: [0],
      status: OracleStatus.WAIT_RESULT,
      unconfirmed: false,
    });
    store = new Option(name, i, oracle, app);

    expect(store.app).toBe(app);
    expect(store.idx).toBe(i);
    expect(store.amount).toBe(oracle.amounts[i]);
    expect(store.isLast).toBeTruthy();
    expect(store.isFirst).not.toBeTruthy();
    expect(store.name).toBe(name);
    expect(store.token).toBe(BOT);
    expect(store.phase).toBe(FINALIZING);
    expect(store.value).toBe(undefined);
    expect(store.percent).toBe(0);
    expect(store.isPrevResult).toBeTruthy();
    expect(store.maxAmount).toBe(undefined);
    expect(store.isFinalizing).toBeTruthy();
    expect(store.disabled).not.toBeTruthy();
  });

  it('Constructor 6: decentralized oracle confirmed & NOT prev result & finalizing', () => {
    const name = 'cons test 6';
    const i = 1;
    const oracle = observable({
      txid: 0,
      amounts: [99, 100],
      consensusThreshold: 100,
      address: '02e91962156da21fae38e65038279c020347e4ff',
      topicAddress: '4044f951857f2885d66d29a475235dacdaddea84',
      resultSetEndTime: 10,
      endTime: 20,
      options: [name, 'cons test 7'],
      token: BOT,
      phase: FINALIZING,
      optionIdxs: [1],
      status: OracleStatus.WAIT_RESULT,
      unconfirmed: false,
    });
    store = new Option(name, i, oracle, app);

    expect(store.app).toBe(app);
    expect(store.idx).toBe(i);
    expect(store.amount).toBe(oracle.amounts[i]);
    expect(store.isLast).toBeTruthy();
    expect(store.isFirst).not.toBeTruthy();
    expect(store.name).toBe(name);
    expect(store.token).toBe(BOT);
    expect(store.phase).toBe(FINALIZING);
    expect(store.value).toBe(undefined);
    expect(store.percent).toBe(100);
    expect(store.isPrevResult).not.toBeTruthy();
    expect(store.maxAmount).toBe(undefined);
    expect(store.isFinalizing).toBeTruthy();
    expect(store.disabled).toBeTruthy();
  });

  it('toggleExpansion & expand', () => {
    const name = 'cons test 4';
    const i = 1;
    const oracle = observable({
      txid: 0,
      amounts: [99, 100],
      consensusThreshold: 100,
      address: '02e91962156da21fae38e65038279c020347e4ff',
      topicAddress: '4044f951857f2885d66d29a475235dacdaddea84',
      resultSetEndTime: 10,
      endTime: 20,
      options: [name, 'cons test 5'],
      token: BOT,
      phase: VOTING,
      optionIdxs: [1],
      status: OracleStatus.Voting,
      unconfirmed: false,
    });
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
    const oracle = observable({
      txid: 0,
      amounts: [99, 100],
      consensusThreshold: 100,
      address: '02e91962156da21fae38e65038279c020347e4ff',
      topicAddress: '4044f951857f2885d66d29a475235dacdaddea84',
      resultSetEndTime: 10,
      endTime: 20,
      options: [name, 'cons test 5'],
      token: BOT,
      phase: VOTING,
      optionIdxs: [1],
      status: OracleStatus.Voting,
      unconfirmed: false,
    });
    store = new Option(name, i, oracle, app);

    app.eventPage.selectedOptionIdx = 1;
    expect(store.isExpanded).toBeTruthy();
    store.toggleExpansion();
    expect(app.eventPage.selectedOptionIdx).toBe(-1);
    expect(store.isExpanded).not.toBeTruthy();
  });
});
