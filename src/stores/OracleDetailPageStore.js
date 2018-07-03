/* eslint-disable */
import { observable, runInAction, action } from 'mobx';
import graphql from 'graphql.js';

import Oracle from './models/Oracle';

var graph = graphql("http://127.0.0.1:8989/graphql", {
  asJSON: true,
})
var gql = (strings, ...vars) => {
  const string = strings.reduce((acc, str, i) => vars[i] ? acc + str + vars[i] : acc + str, '');
  return graph(string)();
}


export default class {
  @observable loading = true
  @observable oracle = {}
  @observable amount = ''
  @observable address = ''

  constructor(app) {
    this.app = app;
  }

  @action
  async init({ topicAddress, address, txid }) {
    console.log('TP ADDR: ', topicAddress, 'ADDR: ', address, 'TXID: ', txid);
    if (topicAddress === 'null' && address === 'null' && txid) { // unconfirmed
      // Find mutated Oracle based on txid since a mutated Oracle won't have a topicAddress or oracleAddress
      let { allOracles: [ oracle ] } = await gql`
        query {
          allOracles(filter: { txid: "${txid}", status: CREATED }) {
            txid
            version
            address
            topicAddress
            status
            token
            name
            options
            optionIdxs
            amounts
            resultIdx
            blockNum
            startTime
            endTime
            resultSetStartTime
            resultSetEndTime
            resultSetterAddress
            resultSetterQAddress
            consensusThreshold
            transactions {
              type
              status
            }
          }
        }
      `;
      runInAction(() => {
        this.oracle = new Oracle(oracle, this.app);
        this.loading = false;
      });
    } else {
      let { allOracles: [ oracle ] } = await gql`
        query {
          allOracles(filter: { topicAddress: "${topicAddress}" }) {
            txid
            version
            address
            topicAddress
            status
            token
            name
            options
            optionIdxs
            amounts
            resultIdx
            blockNum
            startTime
            endTime
            resultSetStartTime
            resultSetEndTime
            resultSetterAddress
            resultSetterQAddress
            consensusThreshold
            transactions {
              type
              status
            }
          }
        }
      `;
      runInAction(() => {
        this.oracle = new Oracle(oracle, this.app);
        this.loading = false;
      });
    }
  }
}
