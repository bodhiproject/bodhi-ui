import { observable, runInAction, action, computed, reaction } from 'mobx';
import moment from 'moment';
import _ from 'lodash';
import axios from 'axios';
import NP from 'number-precision';
import { EventType, SortBy, TransactionType, TransactionStatus, EventWarningType, Token, Phases } from 'constants';
import { Oracle, Transaction, Topic, TransactionCost } from 'models';

import Tracking from '../../helpers/mixpanelUtil';
import { toFixed, decimalToSatoshi, satoshiToDecimal, processTopic } from '../../helpers/utility';
import { createBetTx, createSetResultTx, createVoteTx, createFinalizeResultTx, createWithdrawTx } from '../../network/graphql/mutations';
import networkRoutes from '../../network/routes';
import { queryAllTransactions, queryAllOracles, queryAllTopics, queryAllVotes } from '../../network/graphql/queries';
import { maxTransactionFee } from '../../config/app';

const { UNCONFIRMED, TOPIC, ORACLE } = EventType;
const { BETTING, VOTING, RESULT_SETTING, FINALIZING } = Phases;

const INIT = {
  type: undefined,
  loading: true,
  oracles: [],
  amount: '',
  address: '',
  topicAddress: '',
  transactions: [],
  selectedOptionIdx: -1,
  txConfirmDialogOpen: false,
  txSentDialogOpen: false,
  buttonDisabled: false,
  warningType: '',
  eventWarningMessageId: '',
  escrowClaim: 0,
};

export default class EventStore {
  @observable type = INIT.type // One of EventType: [UNCONFIRMED, TOPIC, ORACLE]
  @observable loading = INIT.loading
  @observable oracles = []
  @observable amount = INIT.amount // Input amount to bet, vote, etc. for each event option
  @observable address = INIT.address
  @observable topicAddress = INIT.topicAddress
  @observable transactions = INIT.transactions
  @observable selectedOptionIdx = INIT.selectedOptionIdx // Current option selected for an Oracle
  @observable txConfirmDialogOpen = INIT.txConfirmDialogOpen
  @observable txSentDialogOpen = INIT.txSentDialogOpen
  @observable buttonDisabled = INIT.buttonDisabled
  @observable warningType = INIT.warningType
  @observable eventWarningMessageId = INIT.eventWarningMessageId
  @observable escrowClaim = INIT.escrowClaim

  // topic
  @observable topics = []
  withdrawableAddresses = []
  betBalances = []
  voteBalances = []

  @computed get totalBetAmount() {
    return _.sum(this.betBalances);
  }
  @computed get totalVoteAmount() {
    return _.sum(this.voteBalances);
  }
  @computed get resultBetAmount() {
    return this.betBalances[this.selectedOptionIdx];
  }
  @computed get resultVoteAmount() {
    return this.voteBalances[this.selectedOptionIdx];
  }
  @computed get topic() {
    return _.find(this.topics, { address: this.address }) || {};
  }
  // For Oracle only
  @computed get unconfirmed() {
    return this.topicAddress === 'null' && this.address === 'null';
  }
  @computed get dOracles() { // [BOT] - VOTING -> PENDING/WAITRESULT -> WITHDRAW
    return this.oracles.filter(({ token }) => token === Token.BOT);
  }
  @computed get cOracle() {
    // [QTUM] - CREATED -> BETTING -> WAITRESULT -> OPENRESULTSET -> PENDING -> WITHDRAW
    // mainly: BETTING & RESULT SETTING phases
    return _.find(this.oracles, { token: Token.QTUM }) || {};
  }
  @computed get oracle() {
    if (this.unconfirmed) return _.find(this.oracles, { txid: this.txid });
    return _.find(this.oracles, { address: this.address }) || {};
  }
  // both
  @computed get selectedOption() {
    return (this.event.options && this.event.options[this.selectedOptionIdx]) || {};
  }
  @computed get event() {
    if (this.type === TOPIC) return this.topic;
    return this.oracle;
  }

  constructor(app) {
    this.app = app;
  }

  @action
  async init({ topicAddress, address, txid, type }) {
    this.reset();
    this.topicAddress = topicAddress;
    this.address = address;
    this.txid = txid;
    this.type = type;

    if (type === UNCONFIRMED) {
      await this.initUnconfirmedOracle();
    } else if (type === TOPIC) {
      await this.initTopic();
    } else {
      await this.initOracle();
    }

    this.setReactions();
  }

  /**
   * Show unconfirmed Oracle page.
   * Find unconfirmed Oracle based on txid since a mutated Oracle won't have a topicAddress or oracleAddress.
   */
  @action
  initUnconfirmedOracle = async () => {
    const res = await queryAllOracles([{ txid: this.txid }], undefined, 1);
    this.oracles = _.map(res, o => new Oracle(o, this.app));
    this.loading = false;
  }

  @action
  initTopic = async () => {
    // GraphQL calls
    await this.queryTopics();
    await this.queryOracles(this.address);
    await this.queryTransactions(this.address);

    // API calls
    await this.getEscrowAmount();
    await this.getBetAndVoteBalances();
    await this.getWithdrawableAddresses();

    this.botWinnings = _.sumBy(this.withdrawableAddresses, a => (
      a.type === TransactionType.WITHDRAW && a.botWon ? a.botWon : 0
    ));
    this.qtumWinnings = _.sumBy(this.withdrawableAddresses, ({ qtumWon }) => qtumWon);
    this.selectedOptionIdx = this.topic.resultIdx;
    this.loading = false;
  }

  @action
  initOracle = async () => {
    // GraphQL calls
    await this.queryOracles(this.topicAddress);
    await this.queryTransactions(this.topicAddress);

    if (this.oracle.phase === RESULT_SETTING) {
      // Set the amount field since we know the amount will be the consensus threshold
      this.amount = this.oracle.consensusThreshold.toString();
    }
    this.loading = false;
  }

  setReactions = () => {
    reaction(
      () => this.app.global.syncBlockNum,
      async () => {
        // Fetch transactions during new block
        switch (this.type) {
          case UNCONFIRMED: {
            this.verifyConfirmedOracle();
            break;
          }
          case TOPIC: {
            this.queryTransactions(this.address);
            break;
          }
          case ORACLE: {
            await this.queryTransactions(this.topicAddress);
            await this.queryOracles(this.topicAddress);
            break;
          }
          default: {
            break;
          }
        }
      }
    );

    // Toggle CTA on new block, transaction change, amount input change, option selected
    reaction(
      () => this.app.global.syncBlockTime + this.transactions + this.amount + this.selectedOptionIdx + this.app.wallet.lastUsedAddress,
      () => {
        if (this.type === TOPIC || this.type === ORACLE) this.disableEventActionsIfNecessary();
      },
      { fireImmediately: true },
    );
  }

  @action
  verifyConfirmedOracle = async () => {
    // TODO: need to implement hashedId on server first so we can fetch the updated Oracle by hashedId as it goes through the approve -> createEvent txs
    // const res = await queryAllOracles([{ txid: this.txid }]);
    // const { topicAddress, address, txid } = res[0];
    // if (address && topicAddress) {
    //   this.app.router.push(`/oracle/${topicAddress}/${address}/${txid}`);
    // }
  }

  @action
  queryTopics = async () => {
    const res = await queryAllTopics([{ address: this.address }], undefined, 1);
    this.topics = res.map(topic => new Topic(topic, this.app));
  }

  @action
  queryOracles = async (address) => {
    const res = await queryAllOracles([{ topicAddress: address }], { field: 'blockNum', direction: SortBy.ASCENDING });
    this.oracles = res.map(oracle => new Oracle(oracle, this.app));
  }

  @action
  queryTransactions = async (address) => {
    const res = await queryAllTransactions(
      [{ topicAddress: address }],
      { field: 'createdTime', direction: SortBy.DESCENDING },
    );
    this.transactions = res.map(tx => new Transaction(tx, this.app));
  }

  @action
  getEscrowAmount = async () => {
    try {
      const res = await axios.post(networkRoutes.api.eventEscrowAmount, {
        senderAddress: this.app.wallet.lastUsedAddress,
      });
      this.escrowAmount = satoshiToDecimal(res.data.result[0]);
    } catch (error) {
      runInAction(() => {
        this.app.ui.setError(error.message, networkRoutes.api.eventEscrowAmount);
      });
    }
  }

  @action
  getBetAndVoteBalances = async () => {
    try {
      const { address: contractAddress, app: { wallet } } = this;

      // Get all votes for this Topic
      const voteFilters = [];
      _.each(wallet.addresses, (item) => {
        voteFilters.push({
          topicAddress: contractAddress,
          voterQAddress: item.address,
        });
      });

      // Filter unique votes
      const allVotes = await queryAllVotes(voteFilters);
      const uniqueVotes = [];
      _.each(allVotes, (vote) => {
        const { voterQAddress, topicAddress } = vote;
        if (!_.find(uniqueVotes, { voterQAddress, topicAddress })) {
          uniqueVotes.push(vote);
        }
      });

      // Call bet and vote balances for each unique vote address and get arrays for each address
      const betArrays = [];
      const voteArrays = [];
      for (let i = 0; i < uniqueVotes.length; i++) {
        const voteObj = uniqueVotes[i];

        const betBalances = await axios.post(networkRoutes.api.betBalances, { // eslint-disable-line
          contractAddress,
          senderAddress: voteObj.voterQAddress,
        });
        betArrays.push(_.map(betBalances.data.result[0], satoshiToDecimal));

        const voteBalances = await axios.post(networkRoutes.api.voteBalances, { // eslint-disable-line
          contractAddress,
          senderAddress: voteObj.voterQAddress,
        });
        voteArrays.push(_.map(voteBalances.data.result[0], satoshiToDecimal));
      }

      // Sum all arrays by index into one array
      this.betBalances = _.map(_.unzip(betArrays), _.sum);
      this.voteBalances = _.map(_.unzip(voteArrays), _.sum);
    } catch (error) {
      runInAction(() => {
        this.app.ui.setError(error.message, `${networkRoutes.api.betBalances} ${networkRoutes.api.voteBalances}`);
      });
    }
  }

  @action
  getWithdrawableAddresses = async () => {
    try {
      const { address: eventAddress, app: { wallet } } = this;
      const withdrawableAddresses = [];

      // Fetch Topic
      const topics = await queryAllTopics([{ address: eventAddress }]);
      let topic;
      if (!_.isEmpty(topics)) {
        topic = processTopic(topics[0]);
      } else {
        throw new Error(`Unable to find topic ${eventAddress}`);
      }

      // Get all winning votes for this Topic
      const voteFilters = [];
      _.each(wallet.addresses, (item) => {
        voteFilters.push({
          topicAddress: topic.address,
          optionIdx: topic.resultIdx,
          voterQAddress: item.address,
        });

        // Add escrow withdraw object if is event creator
        if (item.address === topic.creatorAddress) {
          withdrawableAddresses.push({
            type: TransactionType.WITHDRAW_ESCROW,
            address: item.address,
            botWon: topic.escrowAmount,
            qtumWon: 0,
          });
          this.escrowClaim = topic.escrowAmount;
        }
      });

      // Filter unique votes
      const votes = await queryAllVotes(voteFilters);
      const filtered = [];
      _.each(votes, (vote) => {
        if (!_.find(filtered, {
          voterQAddress: vote.voterQAddress,
          topicAddress: vote.topicAddress,
        })) {
          filtered.push(vote);
        }
      });

      // Calculate winnings for each winning vote
      for (let i = 0; i < filtered.length; i++) {
        const vote = filtered[i];

        const { data: { result } } = await axios.post(networkRoutes.api.winnings, { // eslint-disable-line
          contractAddress: topic.address,
          senderAddress: vote.voterQAddress,
        });
        const botWon = result ? satoshiToDecimal(result['0']) : 0;
        const qtumWon = result ? satoshiToDecimal(result['1']) : 0;

        // return only winning addresses
        if (botWon || qtumWon) {
          withdrawableAddresses.push({
            type: TransactionType.WITHDRAW,
            address: vote.voterQAddress,
            botWon,
            qtumWon,
          });
        }
      }

      this.withdrawableAddresses = withdrawableAddresses;
    } catch (error) {
      runInAction(() => {
        this.app.ui.setError(error.message, networkRoutes.api.winnings);
      });
    }
  }

  /**
   * These checks represent specific cases where we need to disable the CTA and show a warning message.
   * Blocks the user from doing a tx for this event if any of the cases are hit.
   */
  @action
  disableEventActionsIfNecessary = () => {
    const { phase, resultSetterQAddress, resultSetStartTime, isOpenResultSetting, consensusThreshold } = this.oracle;
    const { global: { syncBlockTime }, wallet } = this.app;
    const currBlockTime = moment.unix(syncBlockTime);
    const currentWalletQtum = wallet.lastUsedWallet.qtum;
    const notEnoughQtum = currentWalletQtum < maxTransactionFee;

    // Trying to vote over the consensus threshold
    const amountNum = Number(this.amount);
    if (phase === VOTING && this.amount && this.selectedOptionIdx >= 0) {
      const maxVote = NP.minus(consensusThreshold, this.selectedOption.amount);
      if (amountNum > maxVote) {
        this.buttonDisabled = true;
        this.warningType = EventWarningType.ERROR;
        this.eventWarningMessageId = 'oracle.maxVoteText';
        return;
      }
    }

    // Already have a pending tx for this Oracle
    const pendingTxs = _.filter(
      this.transactions,
      { oracleAddress: this.oracle.address, status: TransactionStatus.PENDING }
    );
    if (pendingTxs.length > 0) {
      this.buttonDisabled = true;
      this.warningType = EventWarningType.HIGHLIGHT;
      this.eventWarningMessageId = 'str.pendingTransactionDisabledMsg';
      return;
    }

    // Has not reached betting start time
    if (phase === BETTING && currBlockTime.isBefore(moment.unix(this.oracle.startTime))) {
      this.buttonDisabled = true;
      this.warningType = EventWarningType.INFO;
      this.eventWarningMessageId = 'oracle.betStartTimeDisabledText';
      return;
    }

    // Has not reached result setting start time
    if ((phase === RESULT_SETTING) && currBlockTime.isBefore(moment.unix(resultSetStartTime))) {
      this.buttonDisabled = true;
      this.warningType = EventWarningType.INFO;
      this.eventWarningMessageId = 'oracle.setStartTimeDisabledText';
      return;
    }

    // User is not the result setter
    if (phase === RESULT_SETTING && !isOpenResultSetting && resultSetterQAddress !== wallet.lastUsedAddress) {
      this.buttonDisabled = true;
      this.warningType = EventWarningType.INFO;
      this.eventWarningMessageId = 'oracle.cOracleDisabledText';
      return;
    }

    // Trying to set result or vote when not enough QTUM or BOT
    const filteredAddress = _.filter(wallet.addresses, { address: wallet.lastUsedAddress });
    const currentBot = filteredAddress.length > 0 ? filteredAddress[0].bot : 0; // # of BOT at currently selected address
    if ((
      (phase === VOTING && currentBot < this.amount)
      || (phase === RESULT_SETTING && currentBot < consensusThreshold)
    ) && notEnoughQtum) {
      this.buttonDisabled = true;
      this.warningType = EventWarningType.ERROR;
      this.eventWarningMessageId = 'str.notEnoughQtumAndBot';
      return;
    }

    // ALL
    // Trying to bet more qtum than you have or you just don't have enough QTUM period
    if ((phase === BETTING && this.amount > currentWalletQtum + maxTransactionFee) || notEnoughQtum) {
      this.buttonDisabled = true;
      this.warningType = EventWarningType.ERROR;
      this.eventWarningMessageId = 'str.notEnoughQtum';
      return;
    }

    // Not enough bot for setting the result or voting
    if ((phase === RESULT_SETTING && currentBot < consensusThreshold)
      || (phase === VOTING && currentBot < this.amount)) {
      this.buttonDisabled = true;
      this.warningType = EventWarningType.ERROR;
      this.eventWarningMessageId = 'str.notEnoughBot';
      return;
    }

    // Did not select a result
    if (phase !== FINALIZING && this.selectedOptionIdx === -1) {
      this.buttonDisabled = true;
      this.warningType = EventWarningType.INFO;
      this.eventWarningMessageId = 'oracle.selectResultDisabledText';
      return;
    }

    // Did not enter an amount
    if ([BETTING, VOTING].includes(phase) && (this.amount <= 0 || Number.isNaN(this.amount))) {
      this.buttonDisabled = true;
      this.warningType = EventWarningType.INFO;
      this.eventWarningMessageId = 'oracle.enterAmountDisabledText';
      return;
    }

    this.buttonDisabled = false;
    this.eventWarningMessageId = '';
    this.warningType = '';
  }

  // Auto-fixes the amount field onBlur if trying to vote over the threshold
  @action
  fixAmount = () => {
    if (this.oracle.phase !== VOTING) return;

    const inputAmount = parseFloat(this.amount, 10);
    const consensusThreshold = parseFloat(this.oracle.consensusThreshold, 10);
    if (inputAmount + Number(this.selectedOption.amount) > consensusThreshold) {
      this.amount = String(toFixed(NP.minus(consensusThreshold, Number(this.selectedOption.amount))));
    }
  }

  // used by confirm tx modal
  confirm = () => {
    const actionToPerform = {
      BETTING: this.bet,
      RESULT_SETTING: this.setResult,
      VOTING: this.vote,
      FINALIZING: this.finalize,
    }[this.oracle.phase];
    if (!_.isUndefined(actionToPerform)) return actionToPerform();
    console.error(`NO ACTION FOR PHASE ${this.oracle.phase}`); // eslint-disable-line
  }

  @action
  prepareBet = async () => {
    try {
      const { data: { result } } = await axios.post(networkRoutes.api.transactionCost, {
        type: TransactionType.BET,
        token: this.oracle.token,
        amount: Number(this.amount),
        optionIdx: this.selectedOptionIdx,
        topicAddress: this.oracle.topicAddress,
        oracleAddress: this.oracle.address,
        senderAddress: this.app.wallet.lastUsedAddress,
      });
      const txFees = _.map(result, (item) => new TransactionCost(item));
      runInAction(() => {
        this.oracle.txFees = txFees;
        this.txConfirmDialogOpen = true;
      });
    } catch (error) {
      runInAction(() => {
        this.app.ui.setError(error.message, networkRoutes.api.transactionCost);
      });
    }
  }

  @action
  prepareSetResult = async () => {
    try {
      const { data: { result } } = await axios.post(networkRoutes.api.transactionCost, {
        type: TransactionType.APPROVE_SET_RESULT,
        token: this.oracle.token,
        amount: this.oracle.consensusThreshold,
        optionIdx: this.selectedOptionIdx,
        topicAddress: this.oracle.topicAddress,
        oracleAddress: this.oracle.address,
        senderAddress: this.app.wallet.lastUsedAddress,
      });
      const txFees = _.map(result, (item) => new TransactionCost(item));
      runInAction(() => {
        this.oracle.txFees = txFees;
        this.txConfirmDialogOpen = true;
      });
    } catch (error) {
      runInAction(() => {
        this.app.ui.setError(error.message, networkRoutes.api.transactionCost);
      });
    }
  }

  @action
  prepareVote = async () => {
    try {
      const { data: { result } } = await axios.post(networkRoutes.api.transactionCost, {
        type: TransactionType.APPROVE_VOTE,
        token: this.oracle.token,
        amount: decimalToSatoshi(this.amount), // Convert to Botoshi
        optionIdx: this.selectedOptionIdx,
        topicAddress: this.oracle.topicAddress,
        oracleAddress: this.oracle.address,
        senderAddress: this.app.wallet.lastUsedAddress,
      });
      const txFees = _.map(result, (item) => new TransactionCost(item));
      runInAction(() => {
        this.oracle.txFees = txFees;
        this.txConfirmDialogOpen = true;
      });
    } catch (error) {
      runInAction(() => {
        this.app.ui.setError(error.message, networkRoutes.api.transactionCost);
      });
    }
  }

  @action
  bet = async () => {
    const { lastUsedAddress } = this.app.wallet;
    const { selectedOptionIdx, amount } = this;
    const { topicAddress, version, address } = this.oracle;
    try {
      const { data: { createBet } } = await createBetTx(version, topicAddress, address, selectedOptionIdx, amount, lastUsedAddress);
      const newTx = { // TODO: add `options` in return from backend
        ...createBet,
        topic: {
          options: this.oracle.options.map(({ name }) => name),
        },
      };

      runInAction(() => {
        this.txConfirmDialogOpen = false;
        this.txSentDialogOpen = true;
        this.transactions.unshift(new Transaction(newTx));
        this.app.pendingTxsSnackbar.init(); // refetch new transactions to display proper notification
      });
    } catch (error) {
      runInAction(() => {
        this.app.ui.setError(error.message, `${networkRoutes.graphql.http}/createBetTx`);
      });
    }

    Tracking.track('oracleDetail-bet');
  }

  @action
  setResult = async () => {
    const { lastUsedAddress } = this.app.wallet;
    const { selectedOptionIdx, amount } = this;
    const { version, topicAddress, address } = this.oracle;
    try {
      const { data: { setResult } } = await createSetResultTx(version, topicAddress, address, selectedOptionIdx, decimalToSatoshi(amount), lastUsedAddress);
      const newTx = { // TODO: add `options` in return from backend
        ...setResult,
        topic: {
          options: this.oracle.options.map(({ name }) => name),
        },
      };

      runInAction(() => {
        this.txConfirmDialogOpen = false;
        this.txSentDialogOpen = true;
        this.transactions.unshift(new Transaction(newTx));
        this.app.pendingTxsSnackbar.init(); // refetch new transactions to display proper notification
      });
    } catch (error) {
      runInAction(() => {
        this.app.ui.setError(error.message, `${networkRoutes.graphql.http}/createSetResultTx`);
      });
    }

    Tracking.track('oracleDetail-set');
  }

  @action
  vote = async () => {
    const { lastUsedAddress } = this.app.wallet;
    const { version, topicAddress, address } = this.oracle;
    const { selectedOptionIdx } = this;
    const amount = decimalToSatoshi(this.amount); // Convert to Botoshi

    try {
      const { data: { createVote } } = await createVoteTx(version, topicAddress, address, selectedOptionIdx, amount, lastUsedAddress);
      const newTx = { // TODO: move this logic to backend, add `options`
        ...createVote,
        topic: {
          options: this.oracle.options.map(({ name }) => name),
        },
      };

      runInAction(() => {
        this.txConfirmDialogOpen = false;
        this.txSentDialogOpen = true;
        this.transactions.unshift(new Transaction(newTx));
        this.app.pendingTxsSnackbar.init(); // refetch new transactions to display proper notification
      });
    } catch (error) {
      runInAction(() => {
        this.app.ui.setError(error.message, `${networkRoutes.graphql.http}/createVoteTx`);
      });
    }

    Tracking.track('oracleDetail-vote');
  }

  finalize = async () => {
    const { lastUsedAddress } = this.app.wallet;
    const { version, topicAddress, address } = this.oracle;
    try {
      const { data: { finalizeResult } } = await createFinalizeResultTx(version, topicAddress, address, lastUsedAddress);
      const newTx = { // TODO: move this logic to backend, add `optionIdx` and `options`
        ...finalizeResult,
        optionIdx: this.oracle.options.filter(opt => !opt.disabled)[0].idx,
        topic: {
          options: this.oracle.options.map(({ name }) => name),
        },
      };

      runInAction(() => {
        this.txConfirmDialogOpen = false;
        this.txSentDialogOpen = true;
        this.transactions.unshift(new Transaction(newTx));
        this.app.pendingTxsSnackbar.init(); // refetch new transactions to display proper notification
      });
    } catch (error) {
      runInAction(() => {
        this.app.ui.setError(error.message, `${networkRoutes.graphql.http}/createFinalizeResultTx`);
      });
    }
    Tracking.track('oracleDetail-finalize');
  }

  withdraw = async (senderAddress, type) => {
    try {
      const { version, address } = this.topic;
      const { data: { withdraw } } = await createWithdrawTx(type, version, address, senderAddress);
      const newTx = { // TODO: move this logic ot teh backend
        ...withdraw,
        optionIdx: this.selectedOptionIdx,
        topic: {
          options: this.topic.options,
        },
      };

      runInAction(() => {
        this.txSentDialogOpen = true;
        this.transactions.unshift(new Transaction(newTx));
        this.app.pendingTxsSnackbar.init(); // refetch new transactions to display proper notification
      });
    } catch (error) {
      runInAction(() => {
        this.app.ui.setError(error.message, `${networkRoutes.graphql.http}/createWithdrawTx`);
      });
    }
    Tracking.track('topicDetail-withdraw');
  }

  reset = () => Object.assign(this, INIT);
}
