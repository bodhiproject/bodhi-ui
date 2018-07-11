import { observable, action, computed } from 'mobx';
import { OracleStatus, Token } from 'constants';
import _ from 'lodash';
import Topic from '../../stores/models/Topic';
import Oracle from '../../stores/models/Oracle';

import { queryAllTopics, queryAllOracles, queryAllVotes } from '../../network/graphQuery';

const INIT_VALUES = {
  myActivitesCount: 0, // INIT_VALUESial loaded state
};


export default class {
  @observable ResultSettingCount = INIT_VALUES.ResultSettingCount
  @observable FinalizeCount = INIT_VALUES.FinalizeCount
  @observable WithdrawCount = INIT_VALUES.WithdrawCount
  @computed get totalCount() {
    return this.ResultSettingCount + this.FinalizeCount + this.WithdrawCount;
  }

  constructor(app) {
    this.app = app;
  }

  @action
  init() {
    this.getCount();
  }

  @action.bound
  async getCount() {
    try {
      const voteFilters = [];
      const topicFilters = [];

      // Get all votes for all your addresses
      _.each(this.app.wallet.addresses, (item) => {
        voteFilters.push({ voterQAddress: item.address });
        topicFilters.push({ status: OracleStatus.WITHDRAW, creatorAddress: item.address });
      });

      // Filter votes
      let votes = await queryAllVotes(voteFilters);
      votes = votes.reduce((accumulator, vote) => {
        const { voterQAddress, topicAddress, optionIdx } = vote;
        if (!_.find(accumulator, { voterQAddress, topicAddress, optionIdx })) accumulator.push(vote);
        return accumulator;
      }, []);

      _.each(votes, ({ topicAddress, optionIdx }) => {
        topicFilters.push({ status: OracleStatus.WITHDRAW, address: topicAddress, resultIdx: optionIdx });
      });
      let topics = await queryAllTopics(topicFilters);
      topics = _.uniqBy(topics, 'txid').map((topic) => new Topic(topic, this.app));
      this.WithdrawCount = topics.length;

      // Get result set items
      const oracleSetFilters = [{ token: Token.QTUM, status: OracleStatus.OPEN_RESULT_SET }];
      _.each(action.walletAddresses, (item) => {
        oracleSetFilters.push({
          token: Token.QTUM,
          status: OracleStatus.WAIT_RESULT,
          resultSetterQAddress: item.address,
        });
      });
      let oracles = await queryAllOracles(oracleSetFilters);
      oracles = _.uniqBy(oracles, 'txid').map((oracle) => new Oracle(oracle, this.app));
      this.ResultSettingCount = oracles.length;

      // Get finalize items
      const oracleFinalizeFilters = [{ token: Token.BOT, status: OracleStatus.WAIT_RESULT }];
      const oraclesForFinalize = await queryAllOracles(oracleFinalizeFilters);
      oracles = _.uniqBy(oraclesForFinalize, 'txid').map((o) => new Oracle(o, this.app));
      this.FinalizeCount = oracles.length;
    } catch (err) {
      console.error(err); // eslint-disable-line
    }
  }
}
