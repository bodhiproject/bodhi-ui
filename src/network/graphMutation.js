import gql from 'graphql-tag';
import _ from 'lodash';

import client from './graphClient';
import { TYPE, getMutation, isValidEnum } from './graphSchema';

if (process.env.REACT_APP_ENV === 'dev') {
  window.mutations = '';
}

class GraphMutation {
  constructor(mutationName, args) {
    this.mutationName = mutationName;
    this.schema = getMutation(mutationName);
    this.args = args;
  }

  constructMapping() {
    let mappingStr = '';
    _.each(this.schema.mapping, (key) => {
      const value = this.args[key];
      if (isValidEnum(key, value) || _.isFinite(value)) {
        // Enums require values without quotes
        mappingStr = mappingStr.concat(`${key}: ${value}\n`);
      } else {
        mappingStr = mappingStr.concat(`${key}: ${JSON.stringify(value)}\n`);
      }
    });

    return mappingStr;
  }

  build() {
    const mutation = `
      mutation {
        ${this.mutationName}(
          ${this.constructMapping()}
        ) {
          ${this.schema.return}
        }
      }
    `;

    return mutation;
  }

  async execute() {
    const mutation = this.build();
    if (process.env.REACT_APP_ENV === 'dev') {
      window.mutations += `\n${mutation}`;
    }

    const res = await client.mutate({
      mutation: gql`${mutation}`,
      fetchPolicy: 'no-cache',
    });
    return res;
  }
}

export function createTopic(
  name,
  results,
  centralizedOracle,
  bettingStartTime,
  bettingEndTime,
  resultSettingStartTime,
  resultSettingEndTime,
  escrowAmount,
  senderAddress
) {
  const args = {
    name,
    options: results,
    resultSetterAddress: centralizedOracle,
    bettingStartTime,
    bettingEndTime,
    resultSettingStartTime,
    resultSettingEndTime,
    amount: escrowAmount,
    senderAddress,
  };

  return new GraphMutation('createTopic', args, TYPE.topic).execute();
}

export function createBetTx(version, topicAddress, oracleAddress, optionIdx, amount, senderAddress) {
  const args = {
    version,
    topicAddress,
    oracleAddress,
    optionIdx,
    amount,
    senderAddress,
  };

  return new GraphMutation('createBet', args, TYPE.transaction).execute();
}

export function createSetResultTx(version, topicAddress, oracleAddress, optionIdx, amount, senderAddress) {
  const args = {
    version,
    topicAddress,
    oracleAddress,
    optionIdx,
    amount,
    senderAddress,
  };

  return new GraphMutation('setResult', args, TYPE.transaction).execute();
}

export function createVoteTx(version, topicAddress, oracleAddress, optionIdx, amount, senderAddress) {
  const args = {
    version,
    topicAddress,
    oracleAddress,
    optionIdx,
    amount,
    senderAddress,
  };

  return new GraphMutation('createVote', args, TYPE.transaction).execute();
}

export function createFinalizeResultTx(version, topicAddress, oracleAddress, senderAddress) {
  const args = {
    version,
    topicAddress,
    oracleAddress,
    senderAddress,
  };

  return new GraphMutation('finalizeResult', args, TYPE.transaction).execute();
}

export function createWithdrawTx(type, version, topicAddress, senderAddress) {
  const args = {
    type,
    version,
    senderAddress,
    topicAddress,
  };

  return new GraphMutation('withdraw', args, TYPE.transaction).execute();
}

export function createTransferTx(senderAddress, receiverAddress, token, amount) {
  const args = {
    senderAddress,
    receiverAddress,
    token,
    amount,
  };

  return new GraphMutation('transfer', args, TYPE.transaction).execute();
}
