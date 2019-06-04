import { observable, runInAction, action, computed, reaction, toJS } from 'mobx';
import moment from 'moment';
import { filter, sum } from 'lodash';
import axios from 'axios';
import NP from 'number-precision';
import { SortBy, EventWarningType, EVENT_STATUS, TransactionStatus } from 'constants';
import { toFixed, satoshiToDecimal, decimalToSatoshi } from '../../helpers/utility';
import { API } from '../../network/routes';
import {
  events,
  transactions,
  mostBets,
  biggestWinners,
  resultSets,
  totalResultBets,
  withdraws,
} from '../../network/graphql/queries';
import { maxTransactionFee } from '../../config/app';

const { BETTING, ORACLE_RESULT_SETTING, OPEN_RESULT_SETTING, ARBITRATION, WITHDRAWING } = EVENT_STATUS;
const INIT = {
  loading: true,
  event: undefined,
  address: '',
  escrowAmount: 0,
  resultBets: [],
  betterBets: [],
  totalInvestment: 0,
  returnRate: 0,
  profitOrLoss: 0,
  resultSetsHistory: [],
  pendingWithdraw: [],
  transactionHistoryItems: [],
  leaderboardBets: [],
  nbotWinnings: 0,
  amount: '',
  selectedOptionIdx: -1,
  buttonDisabled: false,
  warningType: '',
  eventWarningMessageId: '',
  activeStep: 0,
  error: {
    amount: '',
    address: '',
  },
  leaderboardLimit: 5,
  didWithdraw: false,
};

export default class EventStore {
  @observable loading = INIT.loading
  @observable event = INIT.event
  @observable address = INIT.address
  @observable resultBets = INIT.resultBets
  @observable betterBets = INIT.betterBets
  @observable resultSetsHistory = INIT.resultSetsHistory
  @observable transactionHistoryItems = INIT.transactionHistoryItems
  @observable leaderboardBets = INIT.leaderboardBets
  @observable nbotWinnings = INIT.nbotWinnings
  @observable amount = INIT.amount // Input amount to bet, vote, etc
  @observable selectedOptionIdx = INIT.selectedOptionIdx // Current result index selected
  @observable buttonDisabled = INIT.buttonDisabled
  @observable warningType = INIT.warningType
  @observable eventWarningMessageId = INIT.eventWarningMessageId
  @observable activeStep = INIT.activeStep;
  @observable error = INIT.error
  @observable escrowAmount = INIT.escrowAmount
  @observable didWithdraw = INIT.didWithdraw
  @observable pendingWithdraw = INIT.pendingWithdraw
  @observable totalInvestment = INIT.totalInvestment
  @observable returnRate = INIT.returnRate
  @observable profitOrLoss = INIT.profitOrLoss
  leaderboardLimit = INIT.leaderboardLimit

  @computed get eventName() {
    return this.event && this.event.name;
  }

  @computed get isBetting() {
    return this.event && this.event.status === BETTING;
  }

  @computed get isResultSetting() {
    return this.event
      && [ORACLE_RESULT_SETTING, OPEN_RESULT_SETTING].includes(this.event.status);
  }

  @computed get isArbitration() {
    return this.event && this.event.status === ARBITRATION;
  }

  @computed get isWithdrawing() {
    return this.event && this.event.status === WITHDRAWING;
  }

  @computed get maxLeaderBoardSteps() {
    return this.event.status === WITHDRAWING ? 2 : 1;
  }

  @computed get selectedOption() {
    return (this.event.results && this.event.results[this.selectedOptionIdx]) || {};
  }

  @computed get withdrawableAddress() {
    const { currentAddress } = this.app.wallet;
    return {
      address: currentAddress,
      nbotWinnings: this.nbotWinnings,
      escrowAmount: this.event.ownerAddress === currentAddress ? this.escrowAmount : 0,
    };
  }

  @computed get remainingConsensusThreshold() {
    const consensusThreshold = parseFloat(this.event.consensusThreshold, 10);
    return toFixed(NP.minus(
      consensusThreshold,
      Number(this.selectedOption.amount)
    ));
  }

  constructor(app) {
    this.app = app;
  }

  @action
  reset = () => Object.assign(this, INIT);

  @action
  async init({ txid, url }) {
    this.reset();
    this.txid = txid;
    this.url = url;
    this.setReactions();
    await this.initEvent();
  }

  setReactions = () => {
    // Wallet addresses list changed
    reaction(
      () => toJS(this.app.wallet.addresses),
      () => {
        if (this.event.status === WITHDRAWING) this.calculateWinnings();
      }
    );

    // New block
    reaction(
      () => this.app.global.online + toJS(this.app.wallet.addresses),
      async () => {
        if (this.app.global.online) await this.initEvent();
      }
    );

    // Leaderboard tab changed
    reaction(
      () => this.activeStep,
      () => this.updateLeaderBoard(),
    );

    // Tx list, amount, selected option, current wallet address changed
    reaction(
      () => this.transactionHistoryItems
        + this.amount
        + this.selectedOptionIdx
        + this.app.wallet.currentWalletAddress,
      () => this.disableEventActionsIfNecessary(),
      { fireImmediately: true },
    );
  }

  @action
  initEvent = async () => {
    if (!this.url) return;
    const userAddress = this.app.wallet.currentAddress || null;
    const { items } = await events(this.app.graphqlClient, {
      filter: { OR: [{ txid: this.url }, { address: this.url }] },
      includeRoundBets: true,
      userAddress,
    });
    [this.event] = items;
    if (!this.event) return;

    this.address = this.event.address;
    this.escrowAmount = this.event.escrowAmount;
    await this.queryResultSets();
    await this.queryTransactions();
    await this.queryLeaderboard();

    this.disableEventActionsIfNecessary();
    if (this.isResultSetting) {
      // Set the amount field since we know the amount will be the consensus threshold
      this.amount = this.event.consensusThreshold.toString();
    }

    if (this.isWithdrawing) {
      await this.getDidWithdraw();
      await this.queryPendingWithdraw();
      this.selectedOptionIdx = this.event.currentResultIndex;
      await this.queryTotalResultBets();
      await this.calculateWinnings();
    }

    this.loading = false;
  }

  @action
  getDidWithdraw = async () => {
    const address = this.event && this.event.address;
    if (!address || !this.app.wallet.currentAddress) return;

    try {
      const { data } = await axios.get(API.DID_WITHDRAW, {
        params: {
          eventAddress: address,
          address: this.app.wallet.currentAddress,
        },
      });
      this.didWithdraw = data.result;
    } catch (error) {
      runInAction(() => {
        this.app.globalDialog.setError(
          `${error.message} : ${error.response.data.error}`,
          API.DID_WITHDRAW,
        );
      });
    }
  }

  @action
  queryPendingWithdraw = async () => {
    const address = this.event && this.event.address;
    if (!address || !this.app.wallet.currentAddress) return;
    const res = await withdraws(this.app.graphqlClient, {
      filter: { eventAddress: address, txStatus: TransactionStatus.PENDING, winnerAddress: this.app.wallet.currentAddress },
    });
    this.pendingWithdraw = res.items;
  }

  @action
  queryResultSets = async () => {
    const address = this.event && this.event.address;
    if (!address) return;

    const res = await resultSets(this.app.graphqlClient, {
      filter: { eventAddress: address, txStatus: TransactionStatus.SUCCESS },
      orderBy: { field: 'eventRound', direction: SortBy.DESCENDING },
    });
    this.resultSetsHistory = res.items;
  }

  @action
  queryTransactions = async () => {
    const address = this.event && this.event.address;
    if (!address) return;

    const txs = await transactions(this.app.graphqlClient, {
      filter: { eventAddress: address },
      orderBy: { field: 'blockNum', direction: SortBy.DESCENDING },
    });
    const pendings = filter(txs.items, { txStatus: TransactionStatus.PENDING });
    const confirmed = filter(txs.items, { txStatus: TransactionStatus.SUCCESS });
    this.transactionHistoryItems = [...pendings, ...confirmed];
  }

  @action
  queryLeaderboard = async () => {
    const address = this.event && this.event.address;
    if (!address) return;

    const bets = await mostBets(this.app.graphqlClient, {
      filter: { eventAddress: address },
      limit: this.leaderboardLimit,
      skip: 0,
    });
    this.leaderboardBets = bets.items;
  }

  @action
  queryBiggestWinner = async () => {
    const address = this.event && this.event.address;
    if (!address) return;

    const winners = await biggestWinners(this.app.graphqlClient, {
      filter: { eventAddress: address },
      limit: this.leaderboardLimit,
      skip: 0,
    });
    this.leaderboardBets = winners;
  }

  @action
  updateLeaderBoard = async () => {
    if (this.activeStep < 2) {
      await this.queryLeaderboard();
    } else {
      await this.queryBiggestWinner();
    }
  }

  // TODO: fix from TransactionStore
  @action
  addPendingTx(pendingTransaction) {
    this.transactionHistoryItems.unshift(pendingTransaction);
  }

  @action
  queryTotalResultBets = async () => {
    const address = this.event && this.event.address;
    if (!address) return;

    const res = await totalResultBets(this.app.graphqlClient, {
      filter: {
        eventAddress: address,
        betterAddress: this.app.wallet.currentAddress,
      },
    });
    this.resultBets = res.resultBets || [];
    this.betterBets = res.betterBets || [];
    this.totalInvestment = sum(this.betterBets);
  }

  @action
  calculateWinnings = async () => {
    const address = this.event && this.event.address;
    if (!address) return;

    try {
      const { data } = await axios.get(API.CALCULATE_WINNINGS, {
        params: {
          // calcaulateWinnings working event address: 0xe272f0793b97a3606f7a4e1eed2abaded67a9376
          eventAddress: address,
          address: this.app.wallet.currentAddress,
        },
      });
      this.nbotWinnings = satoshiToDecimal(data.result);
      this.returnRate = ((this.nbotWinnings - this.totalInvestment) / this.totalInvestment) * 100;
      this.profitOrLoss = this.nbotWinnings - this.totalInvestment;
    } catch (error) {
      runInAction(() => {
        this.app.globalDialog.setError(
          `${error.message}`,
          API.CALCULATE_WINNINGS,
        );
      });
    }
  }

  /**
   * These checks represent specific cases where we need to disable the CTA and show a warning message.
   * Blocks the user from doing a tx for this event if any of the cases are hit.
   */
  @action
  disableEventActionsIfNecessary = () => {
    if (!this.event) return;
    const { status, centralizedOracle, resultSetStartTime, isOpenResultSetting, consensusThreshold } = this.event;
    const { global: { syncBlockTime }, wallet } = this.app;
    const currBlockTime = moment.unix(syncBlockTime);
    const currentWalletNbot = wallet.currentWalletAddress ? wallet.currentWalletAddress.nbot : 0;
    const notEnoughNbot = currentWalletNbot < maxTransactionFee;

    this.buttonDisabled = false;
    this.warningType = '';
    this.eventWarningMessageId = '';
    this.error = INIT.error;

    // Trying to vote over the consensus threshold - currently not way to trigger
    const amountNum = Number(this.amount);
    if (status === ARBITRATION && this.amount && this.selectedOptionIdx >= 0) {
      const maxVote = NP.minus(consensusThreshold, this.selectedOption.amount);
      if (amountNum > maxVote) {
        this.buttonDisabled = true;
        this.error.amount = 'oracle.maxVoteText';
        return;
      }
    }

    // Has not reached betting start time
    if (status === BETTING
      && currBlockTime.isBefore(moment.unix(this.event.betStartTime))) {
      this.buttonDisabled = true;
      this.warningType = EventWarningType.INFO;
      this.eventWarningMessageId = 'oracle.betStartTimeDisabledText';
      return;
    }

    // Has not reached result setting start time
    if ((status === ORACLE_RESULT_SETTING)
      && currBlockTime.isBefore(moment.unix(resultSetStartTime))) {
      this.buttonDisabled = true;
      this.warningType = EventWarningType.INFO;
      this.eventWarningMessageId = 'oracle.setStartTimeDisabledText';
      return;
    }

    // User is not the result setter
    if (status === ORACLE_RESULT_SETTING
      && !isOpenResultSetting()
      && centralizedOracle.toLowerCase() !== wallet.currentAddress.toLowerCase()) {
      this.buttonDisabled = true;
      this.warningType = EventWarningType.INFO;
      this.eventWarningMessageId = 'oracle.cOracleDisabledText';
      return;
    }

    // ALL
    // No wallet can be found
    if (wallet.addresses.length === 0) {
      this.buttonDisabled = true;
      this.error.address = 'str.noAddressInWallet';
      return;
    }

    // Trying to set result or vote when not enough NBOT
    const filteredAddress = filter(wallet.addresses, { address: wallet.currentAddress });
    const currentNbot = filteredAddress.length > 0 ? filteredAddress[0].nbot : 0; // # of NBOT at currently selected address
    if ((
      (status === ARBITRATION && currentNbot < this.amount)
      || ((status === ORACLE_RESULT_SETTING || status === OPEN_RESULT_SETTING) && currentNbot < consensusThreshold)
    ) && notEnoughNbot) {
      this.buttonDisabled = true;
      this.error.amount = 'str.notEnoughNbot';
      return;
    }

    // Trying to bet more naka than you have or you just don't have enough NAKA period
    if ((status === BETTING && this.amount > currentWalletNbot + maxTransactionFee)
      || notEnoughNbot) {
      this.buttonDisabled = true;
      this.error.amount = 'str.notEnoughNbot';
      return;
    }

    // Did not select a result
    if (this.selectedOptionIdx === -1) {
      this.buttonDisabled = true;
      this.warningType = EventWarningType.INFO;
      this.eventWarningMessageId = 'oracle.selectResultDisabledText';
      return;
    }

    // Did not enter an amount
    if ([BETTING, ARBITRATION].includes(status) && (!this.amount)) {
      this.buttonDisabled = true;
      this.warningType = EventWarningType.INFO;
      this.eventWarningMessageId = 'oracle.enterAmountDisabledText';
      return;
    }

    // Enter an invalid amount
    if ([BETTING, ARBITRATION].includes(status)
      && (this.amount <= 0 || Number.isNaN(this.amount))) {
      this.buttonDisabled = true;
      this.error.amount = 'str.invalidAmount';
    }
  }

  // Auto-fixes the amount field onBlur if trying to vote over the threshold
  @action
  fixAmount = () => {
    if (this.event.status !== ARBITRATION) return;

    const inputAmount = parseFloat(this.amount, 10);
    const consensusThreshold = parseFloat(this.event.consensusThreshold, 10);
    if (inputAmount + Number(this.selectedOption.amount) > consensusThreshold) {
      this.amount = String(toFixed(NP.minus(
        consensusThreshold,
        Number(this.selectedOption.amount)
      )));
    }
  }

  @action
  setSelectedOption = (selectedOptionIdx) => {
    if (selectedOptionIdx === this.selectedOptionIdx) {
      this.selectedOptionIdx = INIT.selectedOptionIdx;
    } else {
      this.selectedOptionIdx = selectedOptionIdx;
    }
  }

  bet = async () => {
    await this.app.tx.executeBet({
      eventAddr: this.event.address,
      optionIdx: this.selectedOption.idx,
      amount: decimalToSatoshi(this.amount),
      eventRound: this.event.currentRound,
    });
    this.setSelectedOption(INIT.selectedOptionIdx);
  }

  set = async () => {
    await this.app.tx.executeSetResult({
      eventAddr: this.event.address,
      optionIdx: this.selectedOption.idx,
      amount: decimalToSatoshi(this.amount),
      eventRound: this.event.currentRound,
    });
    this.setSelectedOption(INIT.selectedOptionIdx);
  }

  vote = async () => {
    await this.app.tx.executeVote({
      eventAddr: this.event.address,
      optionIdx: this.selectedOption.idx,
      amount: decimalToSatoshi(this.amount),
      eventRound: this.event.currentRound,
    });
    this.setSelectedOption(INIT.selectedOptionIdx);
  }

  withdraw = async () => {
    await this.app.tx.executeWithdraw({
      eventAddress: this.event.address,
      winningAmount: decimalToSatoshi(this.nbotWinnings),
      escrowAmount: decimalToSatoshi(this.escrowAmount),
      version: this.event.version,
    });
  }
}
