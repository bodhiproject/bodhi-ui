import { observable, runInAction, action, computed, reaction, toJS } from 'mobx';
import moment from 'moment';
import { sum, find, isUndefined, sumBy, isNull, isEmpty, each, map, unzip, filter, fill, includes, orderBy } from 'lodash';
import axios from 'axios';
import NP from 'number-precision';
import { EventType, SortBy, TransactionType, EventWarningType, Token, Phases, EVENT_STATUS, TransactionStatus } from 'constants';

import { toFixed, decimalToSatoshi, satoshiToDecimal } from '../../helpers/utility';
import networkRoutes, { API } from '../../network/routes';
import { events, transactions, queryAllOracles, queryAllTopics, queryAllVotes, mostBets, biggestWinners, resultSets } from '../../network/graphql/queries';
import { maxTransactionFee } from '../../config/app';
import getContracts from '../../config/contracts';


const { UNCONFIRMED, TOPIC, ORACLE } = EventType;
const { VOTING, RESULT_SETTING } = Phases;
const { CREATED, BETTING, ORACLE_RESULT_SETTING, OPEN_RESULT_SETTING, ARBITRATION, WITHDRAWING } = EVENT_STATUS;
const paras = [Token.NAKA, Token.NBOT];
const INIT = {
  type: undefined,
  loading: true,
  oracles: [],
  topics: [],
  resultSetsHistory: [],
  leaderboardBets: [],
  amount: '',
  address: '',
  topicAddress: '',
  transactionHistoryItems: [],
  selectedOptionIdx: -1,
  buttonDisabled: false,
  warningType: '',
  eventWarningMessageId: '',
  escrowClaim: 0,
  allowance: undefined,
  nakaWinnings: 0,
  nbotWinnings: 0,
  withdrawableAddresses: [],
  activeStep: 0,
  event: undefined,
  error: {
    amount: '',
    address: '',
  },
  currentArbitrationEndTime: undefined,
};

export default class EventStore {
  @observable type = INIT.type // One of EventType: [UNCONFIRMED, TOPIC, ORACLE]
  @observable loading = INIT.loading
  @observable oracles = INIT.oracles
  @observable leaderboardBets = INIT.leaderboardBets
  @observable amount = INIT.amount // Input amount to bet, vote, etc. for each event option
  @observable address = INIT.address
  @observable topicAddress = INIT.topicAddress
  @observable transactionHistoryItems = INIT.transactionHistoryItems
  @observable selectedOptionIdx = INIT.selectedOptionIdx // Current option selected for an Oracle
  @observable buttonDisabled = INIT.buttonDisabled
  @observable warningType = INIT.warningType
  @observable eventWarningMessageId = INIT.eventWarningMessageId
  @observable escrowClaim = INIT.escrowClaim
  @observable allowance = INIT.allowance; // In Botoshi
  @observable activeStep = INIT.activeStep;
  @observable error = INIT.error
  @observable event = INIT.event
  // topic
  @observable topics = INIT.topics
  @observable nakaWinnings = INIT.nakaWinnings
  @observable nbotWinnings = INIT.nbotWinnings
  @observable withdrawableAddresses = INIT.withdrawableAddresses
  @observable resultSetsHistory = INIT.resultSetsHistory
  @observable currentArbitrationEndTime = INIT.currentArbitrationEndTime
  betBalances = []
  voteBalances = []
  leaderboardLimit = 5

  @computed get amountDecimal() {
    return satoshiToDecimal(this.allowance);
  }
  @computed get totalBetAmount() {
    return sum(this.betBalances);
  }
  @computed get totalVoteAmount() {
    return sum(this.voteBalances);
  }
  @computed get resultBetAmount() {
    return this.betBalances[this.selectedOptionIdx];
  }
  @computed get resultVoteAmount() {
    return this.voteBalances[this.selectedOptionIdx];
  }

  @computed get isResultSetting() {
    return this.event && [ORACLE_RESULT_SETTING, OPEN_RESULT_SETTING].includes(this.event.status);
  }

  @computed get isArbitration() {
    return this.event && this.event.status === ARBITRATION;
  }

  @computed get buttonExtendProps() {
    if (!this.event) return {};
    if (this.event.currentRound === 0) {
      if ([ORACLE_RESULT_SETTING, OPEN_RESULT_SETTING].includes(this.event.status)) {
        return { buttonFunc: this.set, localeId: 'str.setResult', localeDefaultMessage: 'Set Result', type: 'setResult' };
      }
      return { buttonFunc: this.bet, localeId: 'bottomButtonText.placeBet', localeDefaultMessage: 'Place Bet', type: 'bet' };
    }
    if (this.event.status === WITHDRAWING) {
      return { buttonFunc: this.withdraw, localeId: 'str.withdraw', localeDefaultMessage: 'withdraw', type: 'withdraw' };
    }
    return { buttonFunc: this.vote, localeId: 'str.vote', localeDefaultMessage: 'vote', type: 'vote' };
  }
  @computed get topic() {
    return find(this.topics, { address: this.topicAddress }) || {};
  }

  @computed get maxLeaderBoardSteps() {
    return this.event.status === WITHDRAWING ? 2 : 1;
  }

  // both
  @computed get selectedOption() {
    return (this.event.results && this.event.results[this.selectedOptionIdx]) || {};
  }

  constructor(app) {
    this.app = app;
  }

  @action
  async init({ txid, type, url }) {
    this.reset();
    this.txid = txid;
    this.type = type;
    this.url = url;
    await this.initEvent(url);
    this.setReactions();
  }


  @action
  initTopic = async () => {
    this.topicAddress = this.address;

    // GraphQL calls
    await this.queryTopics();
    await this.queryOracles(this.address);
    await this.queryTransactions(this.address);
    await this.queryResultSets(this.address);

    // API calls
    await this.getEscrowAmount();
    await this.calculateWinnings();
    this.disableEventActionsIfNecessary();
    await this.queryLeaderboard(Token.NAKA);
    this.selectedOptionIdx = this.topic.resultIdx;
    this.loading = false;
  }

  @action
  initEvent = async (url) => {
    const { graphqlClient } = this.app;
    const { items } = await events(graphqlClient, { filter: {
      OR: [
        { txid: url },
        { address: url },
      ] },
    includeRoundBets: true });
    [this.event] = items;
    this.address = this.event.address;
    // GraphQL calls
    // await this.queryTopics();
    // await this.queryOracles(txid);
    // await this.getAllowanceAmount();
    // await this.queryLeaderboard(Token.NAKA);
    if (this.event) {
      await this.queryLeaderboard();
      await this.queryTransactions(this.event.address);
      await this.queryResultSets(this.event.address);
    }
    this.disableEventActionsIfNecessary();
    this.selectedOptionIdx = 1;
    if ([ORACLE_RESULT_SETTING, OPEN_RESULT_SETTING].includes(this.event.status)) {
      // Set the amount field since we know the amount will be the consensus threshold
      this.amount = satoshiToDecimal(this.event.consensusThreshold.toString());
    }
    if (this.event.status === WITHDRAWING) {
      this.selectedOptionIdx = this.event.currentResultIndex;
      await this.calculateWinnings();
    }

    this.loading = false;
  }

  setReactions = () => {
    // Wallet addresses list changed
    reaction(
      () => toJS(this.app.wallet.addresses),
      () => {
        if (this.type === TOPIC) {
          this.calculateWinnings();
        }
      }
    );

    // Leaderboard tab changed
    reaction(
      () => this.activeStep,
      () => this.updateLeaderBoard(),
    );

    // New block
    reaction(
      () => this.app.global.syncBlockNum + this.app.global.online,
      async () => {
        // Fetch transactions during new block
        if (this.app.global.online) {
          switch (this.type) {
            case TOPIC: {
              await this.queryTransactions(this.event.address);
              this.disableEventActionsIfNecessary();
              // await this.updateLeaderBoard();
              await this.queryResultSets(this.event.address);
              break;
            }
            case ORACLE: {
              await this.initEvent(this.url);
              // await this.queryOracles(this.topicAddress);
              // await this.getAllowanceAmount();
              // await this.updateLeaderBoard();
              // this.disableEventActionsIfNecessary();
              break;
            }
            default: {
              break;
            }
          }
        }
      }
    );

    // Tx, amount, selected option, current wallet address, or allowance changes
    reaction(
      () => this.transactionHistoryItems + this.amount + this.selectedOptionIdx + this.app.wallet.currentWalletAddress + this.allowance,
      () => {
        this.disableEventActionsIfNecessary();
      },
      { fireImmediately: true },
    );
  }

  @action
  queryTopics = async () => {
    const { topics } = await queryAllTopics(this.app, [{ address: this.topicAddress }], undefined, 1);
    this.topics = topics;
  }

  @action
  queryOracles = async (address) => {
    const { oracles } = await queryAllOracles(this.app, [{ topicAddress: address }], { field: 'blockNum', direction: SortBy.ASCENDING });
    this.oracles = oracles;
  }

  @action
  queryResultSets = async (address) => {
    const { graphqlClient } = this.app;
    const resultSetFilter = { eventAddress: address, txStatus: TransactionStatus.SUCCESS };
    const resultSetOrderBy = { field: 'eventRound', direction: SortBy.ASCENDING };
    const res = await resultSets(graphqlClient, { filter: resultSetFilter, orderBy: resultSetOrderBy });
    this.resultSetsHistory = res.items;
  }

  @action
  queryLeaderboard = async () => {
    const bets = await mostBets(this.app.graphqlClient, { filter: { eventAddress: this.event.address }, limit: this.leaderboardLimit, skip: 0 });
    this.leaderboardBets = bets.items;
  }

  @action
  queryBiggestWinner = async () => {
    const winners = await biggestWinners(this.app.graphqlClient, { filter: { eventAddress: this.event.address }, limit: this.leaderboardLimit, skip: 0 });
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

  @action
  queryTransactions = async (address) => {
    const { graphqlClient } = this.app;
    const txFilter = { eventAddress: address };
    const txOrderBy = { field: 'blockNum', direction: SortBy.DESCENDING };
    const txs = await transactions(graphqlClient, { filter: txFilter, orderBy: txOrderBy });
    const pendings = filter(txs.items, { txStatus: TransactionStatus.PENDING });
    const confirmed = filter(txs.items, { txStatus: TransactionStatus.SUCCESS });
    this.transactionHistoryItems = [...pendings, ...confirmed];
  }

  @action
  addPendingTx(pendingTransaction) {
    this.transactionHistoryItems.unshift(pendingTransaction);
  }

  @action
  getEscrowAmount = async () => {
    try {
      const { data } = await axios.post(networkRoutes.api.eventEscrowAmount, {
        senderAddress: this.app.wallet.currentAddress,
      });
      this.escrowAmount = satoshiToDecimal(data[0]);
    } catch (error) {
      runInAction(() => {
        this.app.globalDialog.setError(`${error.message} : ${error.response.data.error}`, networkRoutes.api.eventEscrowAmount);
      });
    }
  }

  @action
  calculateWinnings = async () => {
    const { data } = await axios.get(API.CALCULATE_WINNINGS, {
      params: { eventAddress: this.address, address: this.app.wallet.currentAddress },
    });
    this.nbotWinnings = data.result;
  }

  @action
  getBetAndVoteBalances = async () => {
    // Address is needed to get bet and vote balances
    if (isEmpty(this.app.wallet.addresses)) {
      this.betBalances = fill(Array(this.topic.options.length), 0);
      this.voteBalances = fill(Array(this.topic.options.length), 0);
      return;
    }

    try {
      const { address: contractAddress, app: { wallet } } = this;

      // Get all votes for this Topic
      const voteFilters = [];
      each(wallet.addresses, (item) => {
        voteFilters.push({
          topicAddress: contractAddress,
          voterAddress: item.address,
        });
      });

      // Filter unique votes
      const allVotes = await queryAllVotes(voteFilters);
      const uniqueVotes = [];
      each(allVotes, (vote) => {
        const { voterAddress, topicAddress } = vote;
        if (!find(uniqueVotes, { voterAddress, topicAddress })) {
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
          senderAddress: voteObj.voterAddress,
        });
        betArrays.push(map(betBalances.data[0], satoshiToDecimal));

        const voteBalances = await axios.post(networkRoutes.api.voteBalances, { // eslint-disable-line
          contractAddress,
          senderAddress: voteObj.voterAddress,
        });
        voteArrays.push(map(voteBalances.data[0], satoshiToDecimal));
      }

      // Sum all arrays by index into one array
      this.betBalances = map(unzip(betArrays), sum);
      this.voteBalances = map(unzip(voteArrays), sum);
    } catch (error) {
      runInAction(() => {
        this.app.globalDialog.setError(
          `${error.message} : ${error.response.data.error}`,
          `${networkRoutes.api.betBalances} ${networkRoutes.api.voteBalances}`,
        );
      });
    }
  }

  @action
  getWithdrawableAddresses = async () => {
    // Address is needed to get withdrawable addresses
    if (isEmpty(this.app.wallet.addresses)) {
      this.withdrawableAddresses = [];
      return;
    }

    try {
      const { address: eventAddress, app: { wallet } } = this;
      const withdrawableAddresses = [];

      // Fetch Topic
      const { topics } = await queryAllTopics(this.app, [{ address: eventAddress }]);
      let topic;
      if (!isEmpty(topics)) {
        [topic] = topics;
      } else {
        throw new Error(`Unable to find topic ${eventAddress}`);
      }

      // Get all winning votes for this Topic
      const voteFilters = [];
      each(wallet.addresses, (item) => {
        voteFilters.push({
          topicAddress: topic.address,
          optionIdx: topic.resultIdx,
          voterAddress: item.address,
        });

        // Add escrow withdraw object if is event creator
        if (item.address === topic.creatorAddress) {
          withdrawableAddresses.push({
            type: TransactionType.WITHDRAW_ESCROW,
            address: item.address,
            nbotWon: topic.escrowAmount,
            nakaWon: 0,
          });
          this.escrowClaim = topic.escrowAmount;
        }
      });

      // Filter unique votes
      const votes = await queryAllVotes(voteFilters);
      const filtered = [];
      each(votes, (vote) => {
        if (!find(filtered, {
          voterAddress: vote.voterAddress,
          topicAddress: vote.topicAddress,
        })) {
          filtered.push(vote);
        }
      });

      // Calculate winnings for each winning vote
      for (let i = 0; i < filtered.length; i++) {
        const vote = filtered[i];

        const { data } = await axios.post(networkRoutes.api.winnings, { // eslint-disable-line
          contractAddress: topic.address,
          senderAddress: vote.voterAddress,
        });
        const nbotWon = data ? satoshiToDecimal(data[0]) : 0;
        const nakaWon = data ? satoshiToDecimal(data[1]) : 0;

        // return only winning addresses
        if (nbotWon || nakaWon) {
          withdrawableAddresses.push({
            type: TransactionType.WITHDRAW,
            address: vote.voterAddress,
            nbotWon,
            nakaWon,
          });
        }
      }

      this.withdrawableAddresses = withdrawableAddresses;
    } catch (error) {
      runInAction(() => {
        this.app.globalDialog.setError(`${error.message} : ${error.response.data.error}`, networkRoutes.api.winnings);
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
    if (status === BETTING && currBlockTime.isBefore(moment.unix(this.event.betStartTime))) {
      this.buttonDisabled = true;
      this.warningType = EventWarningType.INFO;
      this.eventWarningMessageId = 'oracle.betStartTimeDisabledText';
      return;
    }

    // Has not reached result setting start time
    if ((status === ORACLE_RESULT_SETTING) && currBlockTime.isBefore(moment.unix(resultSetStartTime))) {
      this.buttonDisabled = true;
      this.warningType = EventWarningType.INFO;
      this.eventWarningMessageId = 'oracle.setStartTimeDisabledText';
      return;
    }

    // User is not the result setter
    if (status === ORACLE_RESULT_SETTING && !isOpenResultSetting() && centralizedOracle.toLowerCase() !== wallet.currentAddress.toLowerCase()) {
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
    if ((status === BETTING && this.amount > currentWalletNbot + maxTransactionFee) || notEnoughNbot) {
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
    if ([BETTING, ARBITRATION].includes(status) && (this.amount <= 0 || Number.isNaN(this.amount))) {
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
      this.amount = String(toFixed(NP.minus(consensusThreshold, Number(this.selectedOption.amount))));
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
    await this.app.tx.executeBet({ eventAddr: this.event.address, optionIdx: this.selectedOption.idx, amount: decimalToSatoshi(this.amount), eventRound: this.event.currentRound });
  }

  set = async () => {
    await this.app.tx.executeSetResult({ eventAddr: this.event.address, optionIdx: this.selectedOption.idx, amount: decimalToSatoshi(this.amount), eventRound: this.event.currentRound });
  }

  vote = async () => {
    await this.app.tx.executeVote({ eventAddr: this.event.address, optionIdx: this.selectedOption.idx, amount: decimalToSatoshi(this.amount), eventRound: this.event.currentRound });
  }

  withdraw = async () => {
    // TODO: finish when withdraw is done
    await this.app.tx.executeWithdraw({});
  }

  reset = () => Object.assign(this, INIT);
}
