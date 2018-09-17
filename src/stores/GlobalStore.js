import { observable, action, reaction } from 'mobx';
import { OracleStatus, Token } from 'constants';
import _ from 'lodash';

import SyncInfo from './models/SyncInfo';
import { querySyncInfo, queryAllTopics, queryAllOracles, queryAllVotes } from '../network/graphql/queries';
import getSubscription, { channels } from '../network/graphql/subscriptions';
import apolloClient from '../network/graphql';


const INIT_VALUES = {
  localWallet: undefined,
  syncPercent: 0,
  syncBlockNum: 0,
  syncBlockTime: '',
  peerNodeCount: 0,
  userData: {
    resultSettingCount: 0,
    finalizeCount: 0,
    withdrawCount: 0,
    totalCount: 0,
  },
};

export default class GlobalStore {
  @observable localWallet = INIT_VALUES.localWallet
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

    // Update the actionable item count when the addresses or block number changes
    reaction(
      () => this.app.wallet.addresses + this.app.global.syncBlockNum,
      () => {
        if (this.syncPercent >= 100) {
          this.getActionableItemCount();
        }
      },
    );

    // Set flag of using a local wallet, eg. Qtum Wallet vs Qrypto
    this.localWallet = Boolean(process.env.LOCAL_WALLET === 'true');
    this.registerQrypto();

    // Call syncInfo once to init the wallet addresses used by other stores
    this.getSyncInfo();
    this.subscribeSyncInfo();
  }

  /**
   * Registers with Qrypto and sets event handler if not using a local wallet.
   */
  registerQrypto = () => {
    if (!this.localWallet) {
      console.log('Registering with Qrypto...'); // eslint-disable-line
      window.addEventListener('message', this.handleQryptoAccountChange, false);
      window.postMessage({ message: { type: 'CONNECT_QRYPTO' } }, '*');
    }
  }

  /**
   * Handles the event when Qrypto posts an account change message.
   * @param {MessageEvent} event Message event to handle.
   */
  handleQryptoAccountChange = (event) => {
    if (event.data.message && event.data.message.type === 'ACCOUNT_CHANGED') {
      if (event.data.message.payload.error) {
        console.error(event.data.message.payload.error); // eslint-disable-line
        return;
      }

      this.app.wallet.onQryptoAccountChange(event.data.message.payload.account);
    }
  }

  /**
   * Handle the syncInfo return of a getSyncInfo or a syncInfo subscription message.
   * @param {object} syncInfo syncInfo object.
   */
  @action
  onSyncInfo = (syncInfo) => {
    if (syncInfo.error) {
      console.error(syncInfo.error.message); // eslint-disable-line no-console
    } else {
      const { percent, blockNum, blockTime, balances, peerNodeCount } = new SyncInfo(syncInfo);
      this.syncPercent = percent;
      this.syncBlockNum = blockNum;
      this.syncBlockTime = blockTime;
      this.peerNodeCount = peerNodeCount || 0;

      // Only use the syncInfo balances if using a local wallet. Qrypto will set the addresses differently.
      if (this.localWallet) {
        this.app.wallet.addresses = balances;
      }
    }
  }

  /**
   * Queries syncInfo by GraphQL call.
   * This is long-polled in the beginning while the server is syncing the blockchain.
   */
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
   * Subscribe to syncInfo subscription.
   * This is meant to be used after the long-polling getSyncInfo is finished.
   * This subscription will return a syncInfo on every new block.
   */
  subscribeSyncInfo = () => {
    const self = this;
    apolloClient.subscribe({
      query: getSubscription(channels.ON_SYNC_INFO),
    }).subscribe({
      next({ data, errors }) {
        if (errors && errors.length > 0) {
          self.onSyncInfo({ error: errors[0] });
        } else {
          self.onSyncInfo(data.onSyncInfo);
        }
      },
      error(err) {
        self.onSyncInfo({ error: err.message });
      },
    });
  }

  /**
   * Gets the actionable item count for all the addresses the user owns.
   * Actionable item count means the number of items the user can take action on.
   * eg. This user can do 4 set results, 10 finalizes, and 5 withdraws
   */
  @action
  getActionableItemCount = async () => {
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
