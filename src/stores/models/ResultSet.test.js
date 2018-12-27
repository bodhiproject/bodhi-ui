import { map } from 'lodash';
import ResultSet from './ResultSet';

describe('ResultSet Model', () => {
  let resultSet;
  let input;
  let output;
  beforeEach(() => {
    resultSet = null;
    input = [{
      txid: 'c4155bbaccb4561626b90dbdba1e5470ee2e7de886b0b88bc0fb5172dddada84',
      block: {
        blockNum: 227909,
        blockTime: '1539040112',
        __typename: 'Block',
      },
      topicAddress: '81b279cbe6bdee202ff24d65940fd2e8888467e1',
      oracleAddress: 'f9bfadebfb5b3b144b986bbdeade8d7b4c800e99',
      fromAddress: 'qT3UcfexmnSBTfUNpJusSUEAfY5gXdNhYs',
      resultIdx: 1,
      version: 0,
      __typename: 'ResultSet',
    }, {
      txid: '270ff638da7de7c22a5d65ed2d88874d17fccec7f2b81d69615f59b42715ac89',
      block: {
        blockNum: 227962,
        blockTime: '1539048304',
        __typename: 'Block',
      },
      topicAddress: '81b279cbe6bdee202ff24d65940fd2e8888467e1',
      oracleAddress: null,
      fromAddress: 'qT3UcfexmnSBTfUNpJusSUEAfY5gXdNhYs',
      resultIdx: 1,
      version: 0,
      __typename: 'ResultSet',
    }];
    output = [{
      type: 'SETRESULT',
      txid: 'c4155bbaccb4561626b90dbdba1e5470ee2e7de886b0b88bc0fb5172dddada84',
      blockNum: 227909,
      blockTime: '1539040112',
      senderAddress: 'qT3UcfexmnSBTfUNpJusSUEAfY5gXdNhYs',
      topicAddress: '81b279cbe6bdee202ff24d65940fd2e8888467e1',
      oracleAddress: 'f9bfadebfb5b3b144b986bbdeade8d7b4c800e99',
      optionIdx: 1,
      version: 0,
      block: {
        blockNum: 227909,
        blockTime: '1539040112',
        __typename: 'Block',
      },
      fromAddress: 'qT3UcfexmnSBTfUNpJusSUEAfY5gXdNhYs',
      resultIdx: 1,
      __typename: 'ResultSet',
    }, {
      type: 'FINALIZERESULT',
      txid: '270ff638da7de7c22a5d65ed2d88874d17fccec7f2b81d69615f59b42715ac89',
      blockNum: 227962,
      blockTime: '1539048304',
      senderAddress: 'qT3UcfexmnSBTfUNpJusSUEAfY5gXdNhYs',
      topicAddress: '81b279cbe6bdee202ff24d65940fd2e8888467e1',
      oracleAddress: null,
      optionIdx: 1,
      version: 0,
      block: {
        blockNum: 227962,
        blockTime: '1539048304',
        __typename: 'Block',
      },
      fromAddress: 'qT3UcfexmnSBTfUNpJusSUEAfY5gXdNhYs',
      resultIdx: 1,
      __typename: 'ResultSet',
    }];
  });

  describe('constructor()', () => {
    it('Constructor', async () => {
      resultSet = map(input, (resultset) => new ResultSet(resultset));
      expect(resultSet).toEqual(output);
    });
  });
});
