import _ from 'lodash';

class GraphParser {
  static getParser(requestName) {
    const PARSER_MAPPINGS = {
      Topic: this.parseTopic,
      Oracle: this.parseOracle,
      SyncInfo: this.parseSyncInfo,
    };
    return PARSER_MAPPINGS[requestName];
  }

  static parseTopic(data) {
    return data.map((entry) => ({
      version: entry.version,
      address: entry.address,
      name: entry.name,
      options: entry.options,
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
      version: entry.version,
      token: entry.token,
      address: entry.address,
      topicAddress: entry.topicAddress,
      status: entry.status,
      name: entry.name,
      options: entry.options,
      optionIdxs: entry.optionIdxs,
      resultIdx: entry.resultIdx,
      amounts: entry.amounts,
      startTime: entry.startTime,
      endTime: entry.endTime,
      resultSetStartTime: entry.resultSetStartTime,
      resultSetEndTime: entry.resultSetEndTime,
      resultSetterAddress: entry.resultSetterAddress,
      resultSetterQAddress: entry.resultSetterQAddress,
      consensusThreshold: entry.consensusThreshold,
      blockNum: entry.blockNum,
    }));
  }

  static parseSyncInfo(data) {
    return _.pick(data, [
      'syncBlockNum',
      'syncBlockTime',
      'chainBlockNum',
    ]);
  }
}

export default GraphParser;
