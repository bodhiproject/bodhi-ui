import gql from 'graphql-tag';
import _ from 'lodash';

import client from './';
import { TYPE, getMutation, isValidEnum } from './schema';
import { isProduction } from '../../config/app';

if (!isProduction()) {
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

    // Post mutation to window
    if (!isProduction()) {
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

export function createBetTx(args) {
  return new GraphMutation('createBet', args, TYPE.transaction).execute();
}

export function createApproveSetResultTx(args) {
  return new GraphMutation('approveSetResult', args, TYPE.transaction).execute();
}

export function createSetResultTx(args) {
  return new GraphMutation('setResult', args, TYPE.transaction).execute();
}

export function createApproveVoteTx(args) {
  return new GraphMutation('approveVote', args, TYPE.transaction).execute();
}

export function createVoteTx(args) {
  return new GraphMutation('createVote', args, TYPE.transaction).execute();
}

export function createFinalizeResultTx(args) {
  return new GraphMutation('finalizeResult', args, TYPE.transaction).execute();
}

export function createWithdrawTx(args) {
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
