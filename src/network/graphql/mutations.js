import gql from 'graphql-tag';
import { each, isFinite } from 'lodash';
import { Transaction } from 'models';

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
    each(this.schema.mapping, (key) => {
      const value = this.args[key];
      if (isValidEnum(key, value) || isFinite(value)) {
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

/**
 * Executes a transaction mutation.
 * @param {string} mutationName Name of the mutation.
 * @param {object} args Arguments for the mutation.
 */
export async function createTransaction(mutationName, args) {
  const res = await new GraphMutation(mutationName, args, TYPE.transaction).execute();
  const { data: { [mutationName]: tx } } = res;
  return new Transaction(tx);
}
