import { observable } from 'mobx';
import { Token, Phases, OracleStatus } from 'constants';
import Oracle from './Oracle';
import { decimalToSatoshi } from '../../helpers/utility';

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
const navigatorMock = {};
global.navigator = navigatorMock;
global.localStorage = localStorageMock;

const { QTUM, BOT } = Token;
const { BETTING, VOTING, FINALIZING, UNCONFIRMED, PENDING, RESULT_SETTING, WITHDRAWING } = Phases;

describe('models/Oracle', () => {
  let oracle;
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
    oracle = null;
  });

  /** all following test cases target specifically to the mock backend, eg. network/graphql/__mocks__/queries.js */
  it('Constructor confirmed betting', async () => {
    const input = observable({
      txid: '0',
      amounts: [decimalToSatoshi('99'), decimalToSatoshi('100')],
      consensusThreshold: decimalToSatoshi('100'),
      address: '02e91962156da21fae38e65038279c020347e4ff',
      topicAddress: '4044f951857f2885d66d29a475235dacdaddea84',
      resultSetEndTime: '10',
      endTime: '20',
      options: ['1', '2'],
      token: QTUM,
      optionIdxs: [0, 1],
      status: OracleStatus.VOTING,
      hashId: 'hahaha',
    });
    oracle = new Oracle(input, app);
    expect(oracle.app).toBe(app);
    expect(oracle.amounts.length).toBe(input.amounts.length);
    expect(oracle.amounts[0]).toBe(99);
    expect(oracle.amounts[1]).toBe(100);
    expect(oracle.consensusThreshold).toBe(100);
    expect(oracle.url).toBe('/oracle/4044f951857f2885d66d29a475235dacdaddea84/02e91962156da21fae38e65038279c020347e4ff/0');
    expect(oracle.endTime).toBe('20');
    expect(oracle.options.length).toBe(input.options.length);

    expect(oracle.isUpcoming).not.toBeTruthy();
    expect(oracle.unconfirmed).not.toBeTruthy();
    expect(oracle.isPending).not.toBeTruthy();
    expect(oracle.isArchived).not.toBeTruthy();
    expect(oracle.isOpenResultSetting).not.toBeTruthy();
    expect(oracle.phase).toBe(BETTING);
  });

  it('Constructor unconfirmed result setting', async () => {
    const input = observable({
      txid: '0',
      amounts: [decimalToSatoshi('99'), decimalToSatoshi('100')],
      consensusThreshold: decimalToSatoshi('100'),
      address: undefined,
      topicAddress: undefined,
      resultSetEndTime: '10',
      endTime: '20',
      options: ['1', '2'],
      token: QTUM,
      optionIdxs: [0, 1],
      status: OracleStatus.WAIT_RESULT,
      hashId: 'hahaha',
    });
    oracle = new Oracle(input, app);
    expect(oracle.app).toBe(app);
    expect(oracle.amounts.length).toBe(input.amounts.length);
    expect(oracle.amounts[0]).toBe(99);
    expect(oracle.amounts[1]).toBe(100);
    expect(oracle.consensusThreshold).toBe(100);
    expect(oracle.url).toBe('/oracle/hahaha');
    expect(oracle.endTime).toBe('10');
    expect(oracle.options.length).toBe(input.options.length);

    expect(oracle.isUpcoming).toBeTruthy();
    expect(oracle.unconfirmed).toBeTruthy();
    expect(oracle.isPending).not.toBeTruthy();
    expect(oracle.isArchived).not.toBeTruthy();
    expect(oracle.isOpenResultSetting).not.toBeTruthy();
    expect(oracle.phase).toBe(RESULT_SETTING);
  });

  it('Constructor unconfirmed oracle', async () => {
    const input = observable({
      txid: '0',
      amounts: [decimalToSatoshi('99'), decimalToSatoshi('100')],
      consensusThreshold: decimalToSatoshi('100'),
      address: undefined,
      topicAddress: undefined,
      resultSetEndTime: '10',
      endTime: '20',
      options: ['1', '2'],
      token: QTUM,
      optionIdxs: [0, 1],
      status: OracleStatus.CREATED,
      hashId: 'hahaha',
    });
    oracle = new Oracle(input, app);
    expect(oracle.app).toBe(app);
    expect(oracle.amounts.length).toBe(input.amounts.length);
    expect(oracle.amounts[0]).toBe(99);
    expect(oracle.amounts[1]).toBe(100);
    expect(oracle.consensusThreshold).toBe(100);
    expect(oracle.url).toBe('/oracle/hahaha');
    expect(oracle.endTime).toBe('20');
    expect(oracle.options.length).toBe(input.options.length);

    expect(oracle.isUpcoming).not.toBeTruthy();
    expect(oracle.unconfirmed).toBeTruthy();
    expect(oracle.isPending).toBeTruthy();
    expect(oracle.isArchived).not.toBeTruthy();
    expect(oracle.isOpenResultSetting).not.toBeTruthy();
    expect(oracle.phase).toBe(BETTING);
  });

  it('Constructor Open Result Setting Oracle', async () => {
    const input = observable({
      txid: '0',
      amounts: [decimalToSatoshi('99'), decimalToSatoshi('100')],
      consensusThreshold: decimalToSatoshi('100'),
      address: undefined,
      topicAddress: '4044f951857f2885d66d29a475235dacdaddea84',
      resultSetEndTime: '10',
      endTime: '20',
      options: ['1', '2'],
      token: QTUM,
      optionIdxs: [0, 1],
      status: OracleStatus.OPEN_RESULT_SET,
      hashId: 'hahaha',
    });
    oracle = new Oracle(input, app);
    expect(oracle.app).toBe(app);
    expect(oracle.amounts.length).toBe(input.amounts.length);
    expect(oracle.amounts[0]).toBe(99);
    expect(oracle.amounts[1]).toBe(100);
    expect(oracle.consensusThreshold).toBe(100);
    expect(oracle.url).toBe('/oracle/4044f951857f2885d66d29a475235dacdaddea84/undefined/0');
    expect(oracle.phase).toBe(RESULT_SETTING);
    expect(oracle.endTime).toBe('10');
    expect(oracle.options.length).toBe(input.options.length);

    expect(oracle.isUpcoming).not.toBeTruthy();
    expect(oracle.unconfirmed).not.toBeTruthy();
    expect(oracle.isPending).not.toBeTruthy();
    expect(oracle.isArchived).not.toBeTruthy();
    expect(oracle.isOpenResultSetting).toBeTruthy();
  });

  it('Archived Voting Oracle', async () => {
    const input = observable({
      txid: '0',
      amounts: [decimalToSatoshi('99'), decimalToSatoshi('100')],
      consensusThreshold: decimalToSatoshi('100'),
      address: undefined,
      topicAddress: '4044f951857f2885d66d29a475235dacdaddea84',
      resultSetEndTime: '10',
      endTime: '20',
      options: ['1', '2'],
      token: BOT,
      optionIdxs: [1],
      status: OracleStatus.WITHDRAW,
      hashId: 'hahaha',
    });
    oracle = new Oracle(input, app);
    expect(oracle.app).toBe(app);
    expect(oracle.amounts.length).toBe(input.amounts.length);
    expect(oracle.amounts[0]).toBe(99);
    expect(oracle.amounts[1]).toBe(100);
    expect(oracle.consensusThreshold).toBe(100);
    expect(oracle.url).toBe('/oracle/4044f951857f2885d66d29a475235dacdaddea84/undefined/0');
    expect(oracle.phase).toBe(VOTING);
    expect(oracle.endTime).toBe('20');
    expect(oracle.options.length).toBe(input.options.length);

    expect(oracle.isUpcoming).not.toBeTruthy();
    expect(oracle.unconfirmed).not.toBeTruthy();
    expect(oracle.isPending).not.toBeTruthy();
    expect(oracle.isArchived).toBeTruthy();
    expect(oracle.isOpenResultSetting).not.toBeTruthy();
  });
});
