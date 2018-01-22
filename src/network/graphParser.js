import _ from 'lodash';

class GraphParser {
  static getParser(requestName) {
    const PARSER_MAPPINGS = {
      allTopics: this.parseTopic,
      allOracles: this.parseOracle,
      syncInfo: this.parseSyncInfo,
    };
    return PARSER_MAPPINGS[requestName];
  }

  static parseTopic(data) {
    return data.map((entry) => ({
      address: entry.address,
      creatorAddress: entry.creatorAddress,
      name: entry.name,
      options: entry.options,
      bettingEndBlock: entry.blockNum,
      status: entry.status,
      resultIdx: entry.resultIdx,
      qtumAmount: entry.qtumAmount,
      botAmount: entry.botAmount,
      oracles: entry.oracles,
      blockNum: entry.blockNum,
    }));
  }

  static parseOracle(data) {
    return data.map((entry) => ({
      token: entry.token,
      address: entry.address,
      topicAddress: entry.topicAddress,
      status: entry.status,
      name: entry.name,
      options: entry.options,
      optionIdxs: entry.optionIdxs,
      resultIdx: entry.resultIdx,
      amounts: entry.amounts,
      startBlock: entry.startBlock,
      endBlock: entry.endBlock,
      blockNum: entry.blockNum,
      resultSetStartBlock: entry.resultSetStartBlock,
      resultSetEndBlock: entry.resultSetEndBlock,
      resultSetterAddress: entry.resultSetterAddress,
      resultSetterQAddress: entry.resultSetterQAddress,
      consensusThreshold: entry.consensusThreshold,
    }));
  }

  static parseSyncInfo(data) {
    return _.pick(data, ['syncBlockNum', 'chainBlockNum']);
  }
}

export default GraphParser;
