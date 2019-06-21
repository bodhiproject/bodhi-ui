import { observable, action, reaction, toJS, computed } from 'mobx';
import { SyncInfo } from 'models';
import logger from 'loglevel';
import { subscribeSyncInfo } from '../network/graphql/subscriptions';
import { wsLink } from '../network/graphql';

const INIT_VALUES = {
  localWallet: false,
  socketOnline: false,
  internetOnline: navigator.onLine,
  eventVersion: 6,
  syncPercent: 0,
  syncBlockNum: 0,
  syncBlockTime: 0,
  userData: {
    resultSettingCount: 0,
    withdrawCount: 0,
    totalCount: 0,
  },
  balanceNeedUpdate: false,
};

export default class GlobalStore {
  @observable localWallet = INIT_VALUES.localWallet
  @observable socketOnline = INIT_VALUES.socketOnline
  @observable internetOnline = INIT_VALUES.internetOnline
  @observable eventVersion = INIT_VALUES.eventVersion
  @observable syncPercent = INIT_VALUES.syncPercent
  @observable syncBlockNum = INIT_VALUES.syncBlockNum
  @observable syncBlockTime = INIT_VALUES.syncBlockTime
  @observable balanceNeedUpdate = INIT_VALUES.balanceNeedUpdate
  userData = observable({
    resultSettingCount: INIT_VALUES.userData.resultSettingCount,
    withdrawCount: INIT_VALUES.userData.withdrawCount,
    get totalCount() {
      return this.resultSettingCount + this.withdrawCount;
    },
  });

  @computed get online() {
    return this.socketOnline && this.internetOnline;
  }

  @action
  toggleBalanceNeedUpdate = () => this.balanceNeedUpdate = !this.balanceNeedUpdate;

  constructor(app) {
    this.app = app;

    reaction(
      () => toJS(this.app.wallet.addresses) + this.syncBlockNum,
      () => {
        if (this.syncPercent >= 100) {
          this.getActionableItemCount();
        }
      },
    );
    reaction(
      () => this.syncBlockNum,
      async () => {
        const { wallet: { currentBalance, currentAddress, getPrevBalance, setPrevBalance, fetchNbotBalance, fetchExchangeRate } } = this.app;
        if (this.balanceNeedUpdate) {
          await fetchNbotBalance(currentAddress);
          fetchExchangeRate();
          if (currentBalance !== getPrevBalance) {
            this.toggleBalanceNeedUpdate();
            setPrevBalance();
          }
        }
      }
    );

    // Call syncInfo once to init the wallet addresses used by other stores
    this.subscribeSyncInfo();

    // Handle websocket connection changes
    wsLink.subscriptionClient.onConnected(this.setOnline, this);
    wsLink.subscriptionClient.onReconnected(this.setOnline, this);
    wsLink.subscriptionClient.onDisconnected(this.setOffline, this);

    // Subscribe to changes
    window.addEventListener('offline', () => {
      this.internetOnline = false;
    });
    window.addEventListener('online', () => {
      this.internetOnline = true;
    });
  }

  setOnline = () => {
    this.socketOnline = true;
  };

  setOffline = () => {
    this.socketOnline = false;
  };

  /**
   * Subscribe to syncInfo subscription.
   * This subscription will return a syncInfo on every new block.
   */
  @action
  subscribeSyncInfo = () => {
    subscribeSyncInfo(this.app.graphqlClient, (err, data) => {
      if (err) {
        logger.error('GlobalStore.subscribeSyncInfo', err);
        return;
      }
      const syncInfo = new SyncInfo(data);
      this.syncPercent = syncInfo.percent;
      this.syncBlockNum = syncInfo.blockNum;
      this.syncBlockTime = syncInfo.blockTime;
    });
  }

  @action
  setEventVersion = (eventVersion) => this.eventVersion = eventVersion;

  /**
   * Gets the actionable item count for all the addresses the user owns.
   * Actionable item count means the number of items the user can take action on.
   * eg. This user can do 4 set results, and 5 withdraws
   */
  @action
  getActionableItemCount = async () => {
    // // Address is required for the request filters
    // if (isEmpty(this.app.wallet.addresses)) {
    //   this.userData.resultSettingCount = 0;
    //   this.userData.withdrawCount = 0;
    //   return;
    // }

    // try {
    //   const voteFilters = [];
    //   const topicFilters = [];

    //   // Get all votes for all your addresses
    //   each(this.app.wallet.addresses, (item) => {
    //     voteFilters.push({ voterAddress: item.address });
    //     topicFilters.push({ status: OracleStatus.WITHDRAW, creatorAddress: item.address, language: this.app.ui.locale });
    //   });

    //   // Filter votes
    //   let votes = await queryAllVotes(voteFilters);
    //   votes = votes.reduce((accumulator, vote) => {
    //     const { voterAddress, topicAddress, optionIdx } = vote;
    //     if (!find(accumulator, { voterAddress, topicAddress, optionIdx })) accumulator.push(vote);
    //     return accumulator;
    //   }, []);

    //   each(votes, ({ topicAddress, optionIdx }) => {
    //     topicFilters.push({ status: OracleStatus.WITHDRAW, address: topicAddress, resultIdx: optionIdx, language: this.app.ui.locale });
    //   });
    //   const withdrawInfo = await queryAllTopics(this.app, topicFilters);
    //   this.userData.withdrawCount = withdrawInfo.totalCount;

    //   // Get result set items
    //   const oracleSetFilters = [{ token: Token.NAKA, status: OracleStatus.OPEN_RESULT_SET, language: this.app.ui.locale }];
    //   oracleSetFilters.push({
    //     token: Token.NAKA,
    //     status: OracleStatus.WAIT_RESULT,
    //     resultSetterAddress: this.app.wallet.currentAddress,
    //     language: this.app.ui.locale,
    //   });
    //   const resultSettingInfo = await queryAllOracles(this.app, oracleSetFilters);
    //   this.userData.resultSettingCount = resultSettingInfo.totalCount;
    // } catch (err) {
    //   console.error(err); // eslint-disable-line
    // }
  }
}
