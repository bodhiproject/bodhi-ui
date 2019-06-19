import { observable, runInAction, action, computed, reaction, toJS } from 'mobx';
import { sum, isUndefined } from 'lodash';
import axios from 'axios';
import NP from 'number-precision';
import { EventWarningType, EVENT_STATUS, TransactionStatus, Routes } from 'constants';
import { toFixed, satoshiToDecimal, decimalToSatoshi } from '../../helpers/utility';
import { API } from '../../network/routes';
import {
  events,
  totalResultBets,
  withdraws,
} from '../../network/graphql/queries';
import { maxTransactionFee } from '../../config/app';

const { PRE_BETTING, BETTING, PRE_RESULT_SETTING, ORACLE_RESULT_SETTING, OPEN_RESULT_SETTING, ARBITRATION, WITHDRAWING } = EVENT_STATUS;
const INIT = {
  loading: true,
  event: undefined,
  address: '',
  escrowAmount: 0,
  totalBets: [],
  betterBets: [],
  totalVotes: [],
  betterVotes: [],
  totalInvestment: 0,
  returnRate: 0,
  profitOrLoss: 0,
  pendingWithdraw: [],
  nbotWinnings: undefined, // number
  amount: '',
  selectedOptionIdx: -1,
  buttonDisabled: false,
  warningType: '',
  eventWarningMessageId: '',
  error: {
    amount: '',
    address: '',
  },
  didWithdraw: undefined, // boolean
};

export default class EventStore {
  @observable loading = INIT.loading
  @observable event = INIT.event
  @observable address = INIT.address
  @observable totalBets = INIT.totalBets
  @observable betterBets = INIT.betterBets
  @observable totalVotes = INIT.totalVotes
  @observable betterVotes = INIT.betterVotes
  @observable nbotWinnings = INIT.nbotWinnings
  @observable amount = INIT.amount // Input amount to bet, vote, etc
  @observable selectedOptionIdx = INIT.selectedOptionIdx // Current result index selected
  @observable buttonDisabled = INIT.buttonDisabled
  @observable warningType = INIT.warningType
  @observable eventWarningMessageId = INIT.eventWarningMessageId
  @observable error = INIT.error
  @observable escrowAmount = INIT.escrowAmount
  @observable didWithdraw = INIT.didWithdraw
  @observable pendingWithdraw = INIT.pendingWithdraw
  @observable totalInvestment = INIT.totalInvestment
  @observable returnRate = INIT.returnRate
  @observable profitOrLoss = INIT.profitOrLoss

  @computed get eventName() {
    return this.event && this.event.name;
  }

  @computed get isBetting() {
    return this.event && [PRE_BETTING, BETTING].includes(this.event.status);
  }

  @computed get isResultSetting() {
    return this.event
      && [PRE_RESULT_SETTING, ORACLE_RESULT_SETTING, OPEN_RESULT_SETTING].includes(this.event.status);
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
    const resultIndex = this.event && this.event.currentResultIndex;
    const profitCut = this.event && this.event.arbitrationRewardPercentage;
    if (this.betterBets.length === 0 ||
      this.betterVotes.length === 0 ||
      this.totalBets.length === 0 ||
      this.totalVotes.length === 0) return {};
    const betterBetsSum = sum(this.betterBets);
    const betterVotesSum = sum(this.betterVotes);
    const totalBetsSum = sum(this.totalBets);
    const totalVotesSum = sum(this.totalVotes);
    let totalWinningBets;
    let totalLosingBets;
    let arbitrationShare;
    let betShare;
    let betterBetsReturn;
    if (resultIndex === 0) {
      betterBetsReturn = betterBetsSum;
      arbitrationShare = 0;
    } else {
      totalWinningBets = this.totalBets[resultIndex];
      totalLosingBets = totalBetsSum - totalWinningBets;
      arbitrationShare = (totalLosingBets * profitCut) / 100;
      betShare = totalLosingBets - arbitrationShare;
      betterBetsReturn = this.betterBets[resultIndex] + ((betShare * this.betterBets[resultIndex]) / this.totalBets[resultIndex]) || 0;
    }

    const totalWinningVotes = this.totalVotes[resultIndex];
    const totalLosingVotes = totalVotesSum - totalWinningVotes;
    const totalVotesShare = totalLosingVotes + arbitrationShare;
    const betterVotesReturn = this.betterVotes[resultIndex] + ((totalVotesShare * this.betterVotes[resultIndex]) / this.totalVotes[resultIndex]) || 0;
    const betterEscrow = this.event.ownerAddress === currentAddress ? this.escrowAmount : 0;
    const totalInvestment = betterBetsSum + betterVotesSum + betterEscrow;
    return {
      address: currentAddress,
      escrow: betterEscrow,
      yourTotalBets: betterBetsSum,
      yourTotalBetsReturn: betterBetsReturn,
      yourTotalBetsReturnRate: (betterBetsReturn / betterBetsSum) * 100,
      yourTotalVotes: betterVotesSum,
      yourTotalVotesReturn: betterVotesReturn,
      yourTotalVotesReturnRate: (betterVotesReturn / betterVotesSum) * 100,
      yourTotalReturn: betterBetsReturn + betterVotesReturn + betterEscrow,
      yourWinningInvestment: this.betterBets[resultIndex] + this.betterVotes[resultIndex],
      yourTotalReturnRate: ((betterBetsReturn + betterVotesReturn + betterEscrow) / totalInvestment) * 100,
    };
  }

  @computed get remainingConsensusThreshold() {
    const consensusThreshold = parseFloat(this.event.consensusThreshold, 10);
    return toFixed(NP.minus(
      consensusThreshold,
      Number(this.selectedOption.amount)
    ), true);
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
      async () => {
        if (this.event && this.event.status === WITHDRAWING) {
          await this.queryTotalResultBets();
          await this.calculateWinnings();
          await this.getDidWithdraw();
        }
      }
    );

    // New block
    reaction(
      () => this.app.global.online,
      async () => {
        if (this.app.global.online) await this.initEvent();
      }
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
    // Update on new block
    reaction(
      () => this.app.global.syncBlockNum,
      async () => {
        if (this.app.history.pendingTransactions.length !== 0 && this.app.ui.location === Routes.EVENT) {
          await this.initEvent();
        }
      },
    );
  }

  @action
  initEvent = async () => {
    if (!this.url) return;
    const roundBetsAddress = this.app.wallet.currentAddress || null;
    const { items } = await events(this.app.graphqlClient, {
      filter: { OR: [{ txid: this.url }, { address: this.url }] },
      includeRoundBets: true,
      roundBetsAddress,
    });
    [this.event] = items;
    if (!this.event) return;
    this.address = this.event.address;
    this.escrowAmount = this.event.escrowAmount;

    this.disableEventActionsIfNecessary();
    if (this.isResultSetting) {
      // Set the amount field since we know the amount will be the consensus threshold
      this.amount = this.event.consensusThreshold.toString();
    }

    if (this.isWithdrawing) {
      await this.getDidWithdraw();
      await this.queryPendingWithdraw();
      if (!this.event) return;
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

    // If we have already called didWithdraw before,
    // only call it again every 5 blocks.
    if (!isUndefined(this.didWithdraw) && this.app.global.syncBlockNum % 5 !== 0) {
      return;
    }

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
  addPendingTx(pendingTransaction) {
    this.app.history.transactions.unshift(pendingTransaction);
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

    this.totalBets = res.totalBets || [];
    this.betterBets = res.betterBets || [];
    this.totalVotes = res.totalVotes || [];
    this.betterVotes = res.betterVotes || [];
    this.totalInvestment = sum(this.betterBets);
  }

  @action
  calculateWinnings = async () => {
    const address = this.event && this.event.address;
    if (!address || !this.app.wallet.currentAddress) return;

    // If we have already called calculateWinnings before,
    // only call it again every 5 blocks.
    if (!isUndefined(this.nbotWinnings) && this.app.global.syncBlockNum % 5 !== 0) {
      return;
    }

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
    const { status, centralizedOracle, isOpenResultSetting, consensusThreshold } = this.event;
    const { wallet } = this.app;
    const currentWalletNbot = wallet.currentWalletAddress ? wallet.currentWalletAddress.nbot : -1; // when no wallet, still can click on action buttons

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
    if (status === PRE_BETTING) {
      this.buttonDisabled = true;
      this.warningType = EventWarningType.INFO;
      this.eventWarningMessageId = 'oracle.betStartTimeDisabledText';
      return;
    }

    // Has not reached result setting start time
    if (status === PRE_RESULT_SETTING) {
      this.buttonDisabled = true;
      this.warningType = EventWarningType.INFO;
      this.eventWarningMessageId = 'oracle.setStartTimeDisabledText';
      return;
    }

    // User is not the result setter
    if (ORACLE_RESULT_SETTING === status
      && !isOpenResultSetting()
      && centralizedOracle.toLowerCase() !== wallet.currentAddress.toLowerCase()) {
      this.buttonDisabled = true;
      this.warningType = EventWarningType.INFO;
      this.eventWarningMessageId = 'oracle.cOracleDisabledText';
      return;
    }

    // Trying to bet, set result or vote when not enough NBOT
    if (currentWalletNbot >= 0 && (
      (status === BETTING && Number(this.amount) + maxTransactionFee > currentWalletNbot)
      || (status === ARBITRATION && Number(this.amount) + maxTransactionFee > currentWalletNbot)
      || ((status === ORACLE_RESULT_SETTING || status === OPEN_RESULT_SETTING) && currentWalletNbot < consensusThreshold + maxTransactionFee)
    )) {
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
      this.amount = String(NP.minus(
        consensusThreshold,
        Number(this.selectedOption.amount)
      ).toFixed(8));
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
    const { naka: { checkLoginAndPopup }, ui: { toggleHistoryNeedUpdate }, global: { toggleBalanceNeedUpdate } } = this.app;
    if (!checkLoginAndPopup()) return;

    await this.app.tx.executeBet({
      eventAddr: this.event.address,
      optionIdx: this.selectedOption.idx,
      amount: decimalToSatoshi(this.amount),
      eventRound: this.event.currentRound,
    });
    this.setSelectedOption(INIT.selectedOptionIdx);
    toggleBalanceNeedUpdate();
    toggleHistoryNeedUpdate();
  }

  set = async () => {
    const { naka: { checkLoginAndPopup }, ui: { toggleHistoryNeedUpdate }, global: { toggleBalanceNeedUpdate } } = this.app;
    if (!checkLoginAndPopup()) return;

    await this.app.tx.executeSetResult({
      eventAddr: this.event.address,
      optionIdx: this.selectedOption.idx,
      amount: decimalToSatoshi(this.amount),
      eventRound: this.event.currentRound,
    });
    this.setSelectedOption(INIT.selectedOptionIdx);
    toggleBalanceNeedUpdate();
    toggleHistoryNeedUpdate();
  }

  vote = async () => {
    const { naka: { checkLoginAndPopup }, ui: { toggleHistoryNeedUpdate }, global: { toggleBalanceNeedUpdate } } = this.app;
    if (!checkLoginAndPopup()) return;

    await this.app.tx.executeVote({
      eventAddr: this.event.address,
      optionIdx: this.selectedOption.idx,
      amount: decimalToSatoshi(this.amount),
      eventRound: this.event.currentRound,
    });
    this.setSelectedOption(INIT.selectedOptionIdx);
    toggleBalanceNeedUpdate();
    toggleHistoryNeedUpdate();
  }

  withdraw = async () => {
    const { naka: { checkLoginAndPopup }, ui: { toggleHistoryNeedUpdate }, global: { toggleBalanceNeedUpdate } } = this.app;
    if (!checkLoginAndPopup()) return;
    await this.app.tx.executeWithdraw({
      eventAddress: this.event.address,
      winningAmount: decimalToSatoshi(this.nbotWinnings),
      escrowAmount: decimalToSatoshi(this.escrowAmount),
      version: this.event.version,
    });
    toggleBalanceNeedUpdate();
    toggleHistoryNeedUpdate();
  }
}
