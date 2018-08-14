import { observable, action, reaction } from 'mobx';
import { OracleStatus, Token } from 'constants';
import _ from 'lodash';

import SyncInfo from './models/SyncInfo';
import { querySyncInfo, queryAllTopics, queryAllOracles, queryAllVotes } from '../network/graphQuery';
import getSubscription, { channels } from '../network/graphSubscription';
import apolloClient from '../network/graphClient';
import AppConfig from '../config/app';


const INIT_VALUES = {
  syncPercent: 0,
  syncBlockNum: 0,
  syncBlockTime: '',
  peerNodeCount: 1,
  userData: {
    resultSettingCount: 0,
    finalizeCount: 0,
    withdrawCount: 0,
    totalCount: 0,
  },
};
let syncInfoInterval;

export default class GlobalStore {
  @observable syncPercent = INIT_VALUES.syncPercent
  @observable syncBlockNum = INIT_VALUES.syncBlockNum
  @observable syncBlockTime = INIT_VALUES.syncBlockTime
  @observable peerNodeCount = INIT_VALUES.peerNodeCount
  userData = observable({
    resultSettingCount: INIT_VALUES.userData.resultSettingCount,
    finalizeCount: INIT_VALUES.userData.finalizeCount,
    withdrawCount: INIT_VALUES.userData.withdrawCount,
    get totalCount() {
      return this.resultSettingCount + this.finalizeCount + this.withdrawCount;
    },
  });

  constructor(app) {
    this.app = app;
    reaction(
      () => this.app.wallet.addresses + this.app.global.syncBlockNum,
      () => {
        this.getUserData();
      }
    );

    // Call syncInfo once to init the wallet addresses used by other stores
    this.getSyncInfo();

    // Start syncInfo long polling
    // We use this to update the percentage of the loading screen
    syncInfoInterval = setInterval(this.getSyncInfo(), AppConfig.intervals.syncInfo);
  }

  @action
  onSyncInfo = (syncInfo) => {
    if (syncInfo.error) {
      console.error(syncInfo.error.message); // eslint-disable-line no-console
    } else {
      const { percent, blockNum, blockTime, balances, peerNodeCount } = new SyncInfo(syncInfo);
      this.syncPercent = percent;
      this.syncBlockNum = blockNum;
      this.syncBlockTime = blockTime;
      this.peerNodeCount = peerNodeCount || 1;
      this.app.wallet.addresses = balances;
    }
  }

  @action
  getSyncInfo = async () => {
    try {
      const includeBalances = this.syncPercent === 0 || this.syncPercent >= 98;
      const syncInfo = await querySyncInfo(includeBalances);
      this.onSyncInfo(syncInfo);
    } catch (error) {
      this.onSyncInfo({ error });
    }
  }

  /**
   * Subscribe to syncInfo subscription
   * This returns only after the initial sync is done, and every new block that is returned.
   */
  subscribeSyncInfo = () => {
    apolloClient.subscribe({
      query: getSubscription(channels.ON_SYNC_INFO),
    }).subscribe({
      next({ data, errors }) {
        if (errors && errors.length > 0) {
          this.onSyncInfo({ error: errors[0] });
        } else {
          this.onSyncInfo(data.onSyncInfo);
        }
      },
      error(err) {
        this.onSyncInfo({ error: err.message });
      },
    });
  }

  @action.bound
  async getUserData() {
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
      this.userData.withdrawCount = topicsForVotes.length;

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
      this.userData.resultSettingCount = oraclesForResultset.length;

      // Get finalize items
      const oracleFinalizeFilters = [{ token: Token.BOT, status: OracleStatus.WAIT_RESULT }];
      const oraclesForFinalize = await queryAllOracles(oracleFinalizeFilters);
      this.userData.finalizeCount = oraclesForFinalize.length;
    } catch (err) {
      console.error(err); // eslint-disable-line
    }
  }
}
