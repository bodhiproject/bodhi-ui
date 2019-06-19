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

const { NAKA, NBOT } = Token;
const { BETTING, VOTING, RESULT_SETTING } = Phases;

describe('MultipleResultsEvent', () => {
  let oracle;
  let input;
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
  });
  beforeEach(() => {
    oracle = null;
    input = {
      txid: '0906a03d4ebb95258731970ef87cfc76b818e37aee35b0b6e17b9f620e0b5287',
      amounts: [decimalToSatoshi('99'), decimalToSatoshi('100')],
      consensusThreshold: decimalToSatoshi('100'),
      address: '02e91962156da21fae38e65038279c020347e4ff',
      topicAddress: '4044f951857f2885d66d29a475235dacdaddea84',
      resultSetEndTime: '10',
      endTime: '20',
      options: ['1', '2'],
      token: NAKA,
      optionIdxs: [0, 1],
      status: OracleStatus.VOTING,
      hashId: null,
    };
  });

  describe('constructor()', () => {
    it('Constructor confirmed betting', async () => {
      oracle = new Oracle(input, app);

      expect(oracle.app).toBe(app);
      expect(oracle.amounts.length).toBe(input.amounts.length);
      expect(oracle.amounts[0]).toBe(99);
      expect(oracle.amounts[1]).toBe(100);
      expect(oracle.consensusThreshold).toBe(100);
      expect(oracle.url).toBe('/oracle/4044f951857f2885d66d29a475235dacdaddea84/02e91962156da21fae38e65038279c020347e4ff/0906a03d4ebb95258731970ef87cfc76b818e37aee35b0b6e17b9f620e0b5287');
      expect(oracle.endTime).toBe('20');
      expect(oracle.options.length).toBe(input.options.length);

      expect(oracle.isPending).not.toBeTruthy();
      expect(oracle.isArchived).not.toBeTruthy();
      expect(oracle.isOpenResultSetting).not.toBeTruthy();
      expect(oracle.phase).toBe(BETTING);
    });

    it('Constructor unconfirmed oracle', async () => {
      input.address = undefined;
      input.topicAddress = undefined;
      input.status = OracleStatus.CREATED;
      input.hashId = '6c6e946e510e739d4a1a6416ff6b48cb';
      oracle = new Oracle(input, app);

      expect(oracle.app).toBe(app);
      expect(oracle.amounts.length).toBe(input.amounts.length);
      expect(oracle.amounts[0]).toBe(99);
      expect(oracle.amounts[1]).toBe(100);
      expect(oracle.consensusThreshold).toBe(100);
      expect(oracle.url).toBe('/oracle/6c6e946e510e739d4a1a6416ff6b48cb');
      expect(oracle.endTime).toBe('20');
      expect(oracle.options.length).toBe(input.options.length);

      expect(oracle.unconfirmed).toBeTruthy();
      expect(oracle.isPending).toBeTruthy();
      expect(oracle.isArchived).not.toBeTruthy();
      expect(oracle.isOpenResultSetting).not.toBeTruthy();
      expect(oracle.phase).toBe(BETTING);
    });

    it('Constructor Open Result Setting Oracle', async () => {
      input.address = undefined;
      input.status = OracleStatus.OPEN_RESULT_SET;
      oracle = new Oracle(input, app);

      expect(oracle.app).toBe(app);
      expect(oracle.amounts.length).toBe(input.amounts.length);
      expect(oracle.amounts[0]).toBe(99);
      expect(oracle.amounts[1]).toBe(100);
      expect(oracle.consensusThreshold).toBe(100);
      expect(oracle.url).toBe('/oracle/4044f951857f2885d66d29a475235dacdaddea84/undefined/0906a03d4ebb95258731970ef87cfc76b818e37aee35b0b6e17b9f620e0b5287');
      expect(oracle.phase).toBe(RESULT_SETTING);
      expect(oracle.endTime).toBe('10');
      expect(oracle.options.length).toBe(input.options.length);

      expect(oracle.unconfirmed).not.toBeTruthy();
      expect(oracle.isPending).not.toBeTruthy();
      expect(oracle.isArchived).not.toBeTruthy();
      expect(oracle.isOpenResultSetting).toBeTruthy();
    });
  });

  describe('isArchived()', () => {
    it('Archived Voting Oracle', async () => {
      input.address = undefined;
      input.token = NBOT;
      input.optionIdxs = [1];
      input.status = OracleStatus.WITHDRAW;
      oracle = new Oracle(input, app);

      expect(oracle.app).toBe(app);
      expect(oracle.amounts.length).toBe(input.amounts.length);
      expect(oracle.amounts[0]).toBe(99);
      expect(oracle.amounts[1]).toBe(100);
      expect(oracle.consensusThreshold).toBe(100);
      expect(oracle.url).toBe('/oracle/4044f951857f2885d66d29a475235dacdaddea84/undefined/0906a03d4ebb95258731970ef87cfc76b818e37aee35b0b6e17b9f620e0b5287');
      expect(oracle.phase).toBe(VOTING);
      expect(oracle.endTime).toBe('20');
      expect(oracle.options.length).toBe(input.options.length);

      expect(oracle.unconfirmed).not.toBeTruthy();
      expect(oracle.isPending).not.toBeTruthy();
      expect(oracle.isArchived).toBeTruthy();
      expect(oracle.isOpenResultSetting).not.toBeTruthy();
    });
  });
});
