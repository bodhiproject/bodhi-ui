import gql from 'graphql-tag';

import client from './graphClient';
import { TYPE, getMutation } from './graphDataStruct';
import GraphParser from './graphParser';

class GraphMutation {
  constructor(mutationName, args, type) {
    this.mutationName = mutationName;
    this.args = args;
    this.type = type;
  }

  build() {
    const mutation = getMutation(this.mutationName);
    return gql`mutation ${mutation}`;
  }

  async execute() {
    const mutation = this.build();
    console.debug(mutation);

    const res = await client.mutate({
      mutation,
      variables: this.args,
      fetchPolicy: 'network-only',
    });
    return GraphParser.getParser(this.type)(res.data[this.mutationName]);
  }
}

export function createTopic(
  version,
  centralizedOracle,
  name,
  results,
  bettingStartTime,
  bettingEndTime,
  resultSettingStartTime,
  resultSettingEndTime,
  senderAddress
) {
  const args = {
    version,
    name,
    options: results,
    resultSetterAddress: centralizedOracle,
    bettingStartTime,
    bettingEndTime,
    resultSettingStartTime,
    resultSettingEndTime,
    senderAddress,
  };

  return new GraphMutation('createTopic', args, TYPE.topic).execute();
}

export function createOracle(
  version,
  centralizedOracle,
  name,
  results,
  bettingStartTime,
  bettingEndTime,
  resultSettingStartTime,
  resultSettingEndTime,
  senderAddress
) {
  const args = {
    version,
    name,
    options: results,
    resultSetterAddress: centralizedOracle,
    bettingStartTime,
    bettingEndTime,
    resultSettingStartTime,
    resultSettingEndTime,
    senderAddress,
  };

  return new GraphMutation('createOracle', args, TYPE.oracle).execute();
}

export function createBetTx(version, oracleAddress, optionIdx, amount, senderAddress) {
  const args = {
    version,
    senderAddress,
    oracleAddress,
    optionIdx,
    amount,
  };

  return new GraphMutation('createBet', args, TYPE.transaction).execute();
}

export function createApproveTx(version, oracleAddress, amount, senderAddress) {
  const args = {
    version,
    senderAddress,
    oracleAddress,
    amount,
  };

  return new GraphMutation('approve', args, TYPE.transaction).execute();
}

export function createSetResultTx(version, oracleAddress, consensusThreshold, resultIdx, senderAddress) {
  const args = {
    version,
    senderAddress,
    oracleAddress,
    consensusThreshold,
    resultIdx,
  };

  return new GraphMutation('setResult', args, TYPE.transaction).execute();
}

export function createVoteTx(version, oracleAddress, optionIdx, amount, senderAddress) {
  const args = {
    version,
    senderAddress,
    oracleAddress,
    optionIdx,
    amount,
  };

  return new GraphMutation('createVote', args, TYPE.transaction).execute();
}

export function createFinalizeResultTx(version, oracleAddress, senderAddress) {
  const args = {
    version,
    senderAddress,
    oracleAddress,
  };

  return new GraphMutation('finalizeResult', args, TYPE.transaction).execute();
}

export function createWithdrawTx(version, topicAddress, senderAddress) {
  const args = {
    version,
    senderAddress,
    topicAddress,
  };

  return new GraphMutation('withdraw', args, TYPE.transaction).execute();
}
