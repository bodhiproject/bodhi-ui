import gql from 'graphql-tag';

import { getMutation } from './graphDataStruct';
import GraphParser from './graphParser';
import { TYPE, getMutation } from './graphDataStruct';

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
      mutation: mutation,
      variables: args,
      fetchPolicy: 'network-only',
    });
    return GraphParser.getParser(this.type)(res.data[this.mutationName]);
  }
}

export function createTopic(version, senderAddress, name, options, resultSetterAddress, bettingStartTime, 
  bettingEndTime, resultSettingStartTime, resultSettingEndTime) {
  const args = {
    version,
    senderAddress,
    name,
    options,
    resultSetterAddress,
    bettingStartTime,
    bettingEndTime,
    resultSettingStartTime,
    resultSettingEndTime,
  };

  return new GraphMutation('createTopic', args, TYPE.topic).execute();
}

export function betTransaction(version, senderAddress, oracleAddress, optionIdx, amount) {
  const args = {
    version,
    senderAddress,
    oracleAddress,
    optionIdx,
    amount,
  };

  return new GraphMutation('createBet', args, TYPE.transaction).execute();
}

export function approveTransaction(version, senderAddress, oracleAddress, amount) {
  const args = {
    version,
    senderAddress,
    oracleAddress,
    amount,
  };

  return new GraphMutation('approve', args, TYPE.transaction).execute();
}

export function setResultTransaction(version, senderAddress, oracleAddress, consensusThreshold, resultIdx) {
  const args = {
    version,
    senderAddress,
    oracleAddress,
    consensusThreshold,
    resultIdx,
  };

  return new GraphMutation('setResult', args, TYPE.transaction).execute();
}

export function voteTransaction(version, senderAddress, oracleAddress, optionIdx, amount) {
  const args = {
    version,
    senderAddress,
    oracleAddress,
    optionIdx,
    amount,
  };

  return new GraphMutation('createVote', args, TYPE.transaction).execute();
}

export function finalizeResultTransaction(version, senderAddress, oracleAddress) {
  const args = {
    version,
    senderAddress,
    oracleAddress,
  };

  return new GraphMutation('finalizeResult', args, TYPE.transaction).execute();
}

export function withdrawTransaction(version, senderAddress, topicAddress) {
  const args = {
    version,
    senderAddress,
    topicAddress,
  };

  return new GraphMutation('withdraw', args, TYPE.transaction).execute();
}
