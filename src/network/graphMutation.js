import gql from 'graphql-tag';

import { getMutation } from './graphDataStruct';
import GraphParser from './graphParser';

class GraphMutation {
  constructor(mutation, args, queryName) {
    this.mutation = mutation;
    this.args = args;
    this.queryName = queryName;
  }

  build() {
    return gql`mutation ${this.mutation}`;
  }

  async execute() {
    const mutation = this.build();
    console.debug(mutation);

    const res = await client.mutate({
      mutation: mutation,
      variables: args,
      fetchPolicy: 'network-only',
    });
    return GraphParser.getParser(this.queryName)(res.data[this.queryName]);
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

  const mutation = new GraphMutation(getMutation('createTopic'), args, 'allTopics');
  return mutation.execute();
}

export function betTransaction(version, senderAddress, oracleAddress, optionIdx, amount) {
  const args = {
    version,
    senderAddress,
    oracleAddress,
    optionIdx,
    amount,
  };

  const mutation = new GraphMutation(getMutation('betTransaction'), args, 'transaction');
  return mutation.execute();
}

export function approveTransaction(version, senderAddress, oracleAddress, amount) {
  const args = {
    version,
    senderAddress,
    oracleAddress,
    amount,
  };

  const mutation = new GraphMutation(getMutation('approveTransaction'), args, 'transaction');
  return mutation.execute();
}

export function setResultTransaction(version, senderAddress, oracleAddress, consensusThreshold, resultIdx) {
  const args = {
    version,
    senderAddress,
    oracleAddress,
    consensusThreshold,
    resultIdx,
  };

  const mutation = new GraphMutation(getMutation('setResultTransaction'), args, 'transaction');
  return mutation.execute();
}

export function voteTransaction(version, senderAddress, oracleAddress, optionIdx, amount) {
  const args = {
    version,
    senderAddress,
    oracleAddress,
    optionIdx,
    amount,
  };

  const mutation = new GraphMutation(getMutation('voteTransaction'), args, 'transaction');
  return mutation.execute();
}

export function finalizeResultTransaction(version, senderAddress, oracleAddress) {
  const args = {
    version,
    senderAddress,
    oracleAddress,
  };

  const mutation = new GraphMutation(getMutation('finalizeResultTransaction'), args, 'transaction');
  return mutation.execute();
}

export function withdrawTransaction(version, senderAddress, topicAddress) {
  const args = {
    version,
    senderAddress,
    topicAddress,
  };

  const mutation = new GraphMutation(getMutation('withdrawTransaction'), args, 'transaction');
  return mutation.execute();
}
