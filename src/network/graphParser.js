import _ from 'lodash';

class GraphParser {
  static getParser(requestName) {
    const PARSER_MAPPINGS = {
      Topic: this.parseTopic,
      Oracle: this.parseOracle,
      Vote: this.parseVote,
      SyncInfo: this.parseSyncInfo,
      Transaction: this.parseTransaction,
    };
    return PARSER_MAPPINGS[requestName];
  }

  static parseTopic(data) {
    return data.map((entry) => ({
      txid: entry.txid,
      version: entry.version,
      address: entry.address,
      name: entry.name,
      options: entry.options,
      status: entry.status,
      resultIdx: entry.resultIdx,
      qtumAmount: entry.qtumAmount,
      botAmount: entry.botAmount,
      escrowAmount: entry.escrowAmount,
      oracles: entry.oracles,
      blockNum: entry.blockNum,
      creatorAddress: entry.creatorAddress,
      transactions: entry.transactions,
    }));
  }

  static parseOracle(data) {
    return data.map((entry) => ({
      txid: entry.txid,
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
      transactions: entry.transactions,
    }));
  }

  static parseVote(data) {
    return data.map((entry) => ({
      txid: entry.txid,
      version: entry.version,
      blockNum: entry.blockNum,
      voterAddress: entry.voterAddress,
      voterQAddress: entry.voterQAddress,
      topicAddress: entry.topicAddress,
      oracleAddress: entry.oracleAddress,
      optionIdx: entry.optionIdx,
      amount: entry.amount,
    }));
  }

  static parseSyncInfo(data) {
    return _.pick(data, [
      'syncBlockNum',
      'syncBlockTime',
      'syncPercent',
      'addressBalances',
    ]);
  }

  static parseTransaction(data) {
    return data.map((entry) => ({
      type: entry.type,
      txid: entry.txid,
      status: entry.status,
      createdTime: entry.createdTime,
      blockNum: entry.blockNum,
      blockTime: entry.blockTime,
      gasLimit: entry.gasLimit,
      gasPrice: entry.gasPrice,
      gasUsed: entry.gasUsed,
      version: entry.version,
      senderAddress: entry.senderAddress,
      receiverAddress: entry.receiverAddress,
      topicAddress: entry.topicAddress,
      oracleAddress: entry.oracleAddress,
      name: entry.name,
      optionIdx: entry.optionIdx,
      token: entry.token,
      amount: entry.amount,
      topic: entry.topic,
    }));
  }
}

export default GraphParser;
