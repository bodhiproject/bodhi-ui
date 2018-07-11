import { observable, action, computed, reaction } from 'mobx';
import { OracleStatus, Token } from 'constants';
import _ from 'lodash';

import { queryAllTopics, queryAllOracles, queryAllVotes } from '../../network/graphQuery';

const INIT_VALUES = {
  ResultSettingCount: 0,
  FinalizeCount: 0,
  WithdrawCount: 0,
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
    reaction(
      () => this.app.wallet.addresses + this.app.global.syncBlockNum,
      () => {
        this.init();
      }
    );
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
      const topicsForVotes = await queryAllTopics(topicFilters);
      this.WithdrawCount = topicsForVotes.length;

      // Get result set items
      const oracleSetFilters = [{ token: Token.QTUM, status: OracleStatus.OPEN_RESULT_SET }];
      _.each(action.walletAddresses, (item) => {
        oracleSetFilters.push({
          token: Token.QTUM,
          status: OracleStatus.WAIT_RESULT,
          resultSetterQAddress: item.address,
        });
      });
      const oraclesForResultset = await queryAllOracles(oracleSetFilters);
      this.ResultSettingCount = oraclesForResultset.length;

      // Get finalize items
      const oracleFinalizeFilters = [{ token: Token.BOT, status: OracleStatus.WAIT_RESULT }];
      const oraclesForFinalize = await queryAllOracles(oracleFinalizeFilters);
      this.FinalizeCount = oraclesForFinalize.length;
    } catch (err) {
      console.error(err); // eslint-disable-line
    }
  }
}
