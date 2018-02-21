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

export function createTopicTransaction(version, senderAddress, name, options, resultSetterAddress, bettingStartTime,
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

  const mutation = new GraphMutation(getMutation('createTopicTransaction'), args, 'allTopics');
  return mutation.execute();
}
