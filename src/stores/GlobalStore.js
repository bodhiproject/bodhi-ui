import { observable, action, reaction, toJS } from 'mobx';
import { OracleStatus, Token } from 'constants';
import { each, find, isEmpty } from 'lodash';
import { Qweb3 } from 'qweb3';

import SyncInfo from './models/SyncInfo';
import { querySyncInfo, queryAllTopics, queryAllOracles, queryAllVotes } from '../network/graphql/queries';
import getSubscription, { channels } from '../network/graphql/subscriptions';
import apolloClient from '../network/graphql';


const INIT_VALUES = {
  localWallet: undefined,
  qweb3: undefined,
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
  @observable qweb3 = INIT_VALUES.qweb3
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
      () => toJS(this.app.wallet.addresses) + this.syncBlockNum,
      () => {
        if (this.syncPercent >= 100) {
          this.getActionableItemCount();
        }
      },
    );
    reaction(
      () => this.syncBlockNum,
      () => {
        if (this.localWallet === false) {
          this.app.wallet.fetchBotBalance(this.app.wallet.currentAddress);
        }
      }
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
      console.log('Trying to register with Qrypto...'); // eslint-disable-line
      window.addEventListener('message', this.handleWindowMessage, false);
      window.postMessage({ message: { type: 'CONNECT_QRYPTO' } }, '*');
    }
  }

  /**
   * Handles all window messages.
   * @param {MessageEvent} event Message to handle.
   */
  handleWindowMessage = (event) => {
    if (event.data.message && event.data.message.type) {
      const types = {
        QRYPTO_INSTALLED_OR_UPDATED: this.handleQryptoInstall,
        ACCOUNT_CHANGED: this.handleQryptoAccountChange,
      };
      const messageAction = types[event.data.message.type];
      if (messageAction) messageAction(event);
    }
  }

  /**
   * Handles the event when Qrypto posts an install or update message.
   */
  handleQryptoInstall = () => {
    window.location.reload();
  }

  /**
   * Handles the event when Qrypto posts an account change message.
   * @param {MessageEvent} event Message to handle.
   */
  @action
  handleQryptoAccountChange = (event) => {
    if (event.data.message.payload.error) {
      console.error(event.data.message.payload.error); // eslint-disable-line
      return;
    }

    // Instantiate qweb3 instance on first callback
    if (!this.qweb3) {
      if (window.qrypto && window.qrypto.rpcProvider) {
        this.qweb3 = new Qweb3(window.qrypto.rpcProvider);
      }
    }

    this.app.wallet.onQryptoAccountChange(event.data.message.payload.account);
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
   * Handles an onApproveSuccess subscription message.
   * @param {object} data Subscription message payload.
   */
  onApproveSuccess = (data) => {
    if (data.error) {
      console.error(data.error.message); // eslint-disable-line no-console
      return;
    }

    if (!this.localWallet) {
      // TODO: execute follow up tx
    }
  }

  /**
   * Subscribe to onApproveSuccess subscription.
   * Receives messages of approve transactions that were successful.
   * This is used so the UI knows to execute a follow-up tx.
   */
  subscribeOnApproveSuccess = () => {
    const self = this;
    apolloClient.subscribe({
      query: getSubscription(channels.ON_APPROVE_SUCCESS),
    }).subscribe({
      next({ data, errors }) {
        if (errors && errors.length > 0) {
          self.onApproveSuccess({ error: errors[0] });
        } else {
          self.onApproveSuccess(data.onApproveSuccess);
        }
      },
      error(err) {
        self.onApproveSuccess({ error: err.message });
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
    // Address is required for the request filters
    if (isEmpty(this.app.wallet.addresses)) {
      this.userData.resultSettingCount = 0;
      this.userData.finalizeCount = 0;
      this.userData.withdrawCount = 0;
      return;
    }

    try {
      const voteFilters = [];
      const topicFilters = [];

      // Get all votes for all your addresses
      each(this.app.wallet.addresses, (item) => {
        voteFilters.push({ voterAddress: item.address });
        topicFilters.push({ status: OracleStatus.WITHDRAW, creatorAddress: item.address });
      });

      // Filter votes
      let votes = await queryAllVotes(voteFilters);
      votes = votes.reduce((accumulator, vote) => {
        const { voterAddress, topicAddress, optionIdx } = vote;
        if (!find(accumulator, { voterAddress, topicAddress, optionIdx })) accumulator.push(vote);
        return accumulator;
      }, []);

      each(votes, ({ topicAddress, optionIdx }) => {
        topicFilters.push({ status: OracleStatus.WITHDRAW, address: topicAddress, resultIdx: optionIdx });
      });
      const topicsForVotes = await queryAllTopics(topicFilters);
      this.userData.withdrawCount = topicsForVotes.length;

      // Get result set items
      const oracleSetFilters = [{ token: Token.QTUM, status: OracleStatus.OPEN_RESULT_SET }];
      each(action.walletAddresses, (item) => {
        oracleSetFilters.push({
          token: Token.QTUM,
          status: OracleStatus.WAIT_RESULT,
          resultSetterAddress: item.address,
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
