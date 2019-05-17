import { observable, runInAction, action, computed, reaction, toJS } from 'mobx';
import moment from 'moment';
import { sum, find, isUndefined, sumBy, isNull, isEmpty, each, map, unzip, filter, fill, includes, orderBy } from 'lodash';
import axios from 'axios';
import NP from 'number-precision';
import { EventType, SortBy, TransactionType, EventWarningType, Token, Phases, EVENT_STATUS, TransactionStatus } from 'constants';

import { toFixed, decimalToSatoshi, satoshiToDecimal } from '../../helpers/utility';
import networkRoutes from '../../network/routes';
import { events, transactions, queryAllOracles, queryAllTopics, queryAllVotes, queryMostVotes, queryWinners, resultSets } from '../../network/graphql/queries';
import { maxTransactionFee } from '../../config/app';

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
  leaderboardVotes: [],
  amount: '',
  address: '',
  topicAddress: '',
  transactionHistoryItems: [],
  selectedOptionIdx: -1,
  buttonDisabled: false,
  warningType: '',
  eventWarningMessageId: '',
  escrowClaim: 0,
  hashId: '',
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
};

export default class EventStore {
  @observable type = INIT.type // One of EventType: [UNCONFIRMED, TOPIC, ORACLE]
  @observable loading = INIT.loading
  @observable oracles = INIT.oracles
  @observable leaderboardVotes = INIT.leaderboardVotes
  @observable amount = INIT.amount // Input amount to bet, vote, etc. for each event option
  @observable address = INIT.address
  @observable topicAddress = INIT.topicAddress
  @observable transactionHistoryItems = INIT.transactionHistoryItems
  @observable selectedOptionIdx = INIT.selectedOptionIdx // Current option selected for an Oracle
  @observable buttonDisabled = INIT.buttonDisabled
  @observable warningType = INIT.warningType
  @observable eventWarningMessageId = INIT.eventWarningMessageId
  @observable escrowClaim = INIT.escrowClaim
  @observable hashId = INIT.hashId
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
  @computed get topic() {
    return find(this.topics, { address: this.topicAddress }) || {};
  }

  @computed get dOracles() { // [NBOT] - VOTING -> PENDING/WAITRESULT -> WITHDRAW
    return this.oracles.filter(({ token }) => token === Token.NBOT);
  }
  @computed get cOracle() {
    // [NAKA] - CREATED -> BETTING -> WAITRESULT -> OPENRESULTSET -> PENDING -> WITHDRAW
    // mainly: BETTING & RESULT SETTING phases
    return find(this.oracles, { token: Token.NAKA }) || {};
  }

  // both
  @computed get selectedOption() {
    return (this.event.results && this.event.results[this.selectedOptionIdx]) || {};
  }

  constructor(app) {
    this.app = app;
  }

  @action
  async init({ topicAddress, address, txid, type, hashId }) {
    this.reset();
    this.topicAddress = topicAddress;
    this.address = address;
    this.txid = txid;
    this.type = type;
    this.hashId = hashId;

    if (type === TOPIC) {
      await this.initTopic();
    } else {
      await this.initOracle(txid);
    }

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
  initOracle = async (txid) => {
    const { graphqlClient } = this.app;
    console.log('TCL: initOracle -> this.app', this.app);
    const { items } = await events(graphqlClient, { filter: { txid }, includeRoundBets: true }, this.app);
    [this.event] = items;
    console.log('TCL: initOracle -> this.oracles', this.event);
    // GraphQL calls
    // await this.queryTopics();
    await this.queryOracles(txid);
    // await this.queryTransactions(this.topicAddress);
    // await this.queryResultSets(this.address);
    // await this.getAllowanceAmount();
    // await this.queryLeaderboard(Token.NAKA);
    this.disableEventActionsIfNecessary();

    if (this.oracle.phase === RESULT_SETTING) {
      // Set the amount field since we know the amount will be the consensus threshold
      this.amount = this.oracle.consensusThreshold.toString();
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
            case UNCONFIRMED: {
              this.verifyConfirmedOracle();
              break;
            }
            case TOPIC: {
              await this.queryTransactions(this.address);
              this.disableEventActionsIfNecessary();
              await this.updateLeaderBoard();
              await this.queryResultSets(this.address);
              break;
            }
            case ORACLE: {
              // await this.queryTransactions(this.topicAddress);
              // await this.queryOracles(this.topicAddress);
              // await this.getAllowanceAmount();
              // await this.updateLeaderBoard();
              // await this.queryResultSets(this.address);
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
        if (this.type === TOPIC || this.type === ORACLE) {
          this.disableEventActionsIfNecessary();
        }
      },
      { fireImmediately: true },
    );
  }

  @action
  verifyConfirmedOracle = async () => {
    const { oracles } = await queryAllOracles(this.app, [{ hashId: this.hashId }]);
    if (!isNull(oracles[0].topicAddress)) {
      const { topicAddress, address, txid } = oracles[0];
      this.app.router.push(`/oracle/${topicAddress}/${address}/${txid}`);
    }
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
    const resultSetFilter = { eventAddress: address, status: TransactionStatus.SUCCESS };
    const resultSetOrderBy = { field: 'eventRound', direction: SortBy.ASCENDING };
    const res = await resultSets(graphqlClient, { filter: resultSetFilter, orderBy: resultSetOrderBy });
    this.resultSetsHistory = res.item;
  }

  @action
  queryLeaderboard = async (token) => {
    const { votes } = await queryMostVotes([{ topicAddress: this.topicAddress, token }], null, 5, 0);
    this.leaderboardVotes = votes;
  }

  @action
  queryBiggestWinner = async () => {
    const winners = await queryWinners({ filter: { topicAddress: this.topicAddress, optionIdx: this.topic.resultIdx } });
    this.leaderboardVotes = winners;
  }

  @action
  updateLeaderBoard = async () => {
    if (this.activeStep < 2) {
      await this.queryLeaderboard(paras[this.activeStep]);
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
        this.app.components.globalDialog.setError(`${error.message} : ${error.response.data.error}`, networkRoutes.api.eventEscrowAmount);
      });
    }
  }

  @action
  calculateWinnings = async () => {
    await this.getBetAndVoteBalances();
    await this.getWithdrawableAddresses();

    this.nbotWinnings = sumBy(this.withdrawableAddresses, a => (
      a.type === TransactionType.WITHDRAW && a.nbotWon ? a.nbotWon : 0
    ));
    this.nakaWinnings = sumBy(this.withdrawableAddresses, ({ nakaWon }) => nakaWon);
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
        this.app.components.globalDialog.setError(
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
        this.app.components.globalDialog.setError(`${error.message} : ${error.response.data.error}`, networkRoutes.api.winnings);
      });
    }
  }

  /**
   * These checks represent specific cases where we need to disable the CTA and show a warning message.
   * Blocks the user from doing a tx for this event if any of the cases are hit.
   */
  @action
  disableEventActionsIfNecessary = () => {
    const { status, resultSetterAddress, resultSetStartTime, isOpenResultSetting, consensusThreshold } = this.event;
    const { global: { syncBlockTime }, wallet } = this.app;
    const currBlockTime = moment.unix(syncBlockTime);
    const currentWalletNaka = wallet.currentWalletAddress ? wallet.currentWalletAddress.naka : 0;
    const notEnoughNaka = currentWalletNaka < maxTransactionFee;

    this.buttonDisabled = false;
    this.warningType = '';
    this.eventWarningMessageId = '';
    this.error = INIT.error;

    // Trying to vote over the consensus threshold - currently not way to trigger
    const amountNum = Number(this.amount);
    if (status === VOTING && this.amount && this.selectedOptionIdx >= 0) {
      const maxVote = NP.minus(consensusThreshold, this.selectedOption.amount);
      if (amountNum > maxVote) {
        this.buttonDisabled = true;
        this.error.amount = 'oracle.maxVoteText';
        return;
      }
    }

    // Has not reached betting start time
    if (status === BETTING && currBlockTime.isBefore(moment.unix(this.event.startTime))) {
      this.buttonDisabled = true;
      this.warningType = EventWarningType.INFO;
      this.eventWarningMessageId = 'oracle.betStartTimeDisabledText';
      return;
    }

    // Has not reached result setting start time
    if ((status === RESULT_SETTING) && currBlockTime.isBefore(moment.unix(resultSetStartTime))) {
      this.buttonDisabled = true;
      this.warningType = EventWarningType.INFO;
      this.eventWarningMessageId = 'oracle.setStartTimeDisabledText';
      return;
    }

    // User is not the result setter
    if (status === RESULT_SETTING && !isOpenResultSetting && resultSetterAddress !== wallet.currentAddress) {
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

    // Trying to set result or vote when not enough NAKA or NBOT
    const filteredAddress = filter(wallet.addresses, { address: wallet.currentAddress });
    const currentNbot = filteredAddress.length > 0 ? filteredAddress[0].nbot : 0; // # of NBOT at currently selected address
    if ((
      (status === VOTING && currentNbot < this.amount)
      || (status === RESULT_SETTING && currentNbot < consensusThreshold)
    ) && notEnoughNaka) {
      this.buttonDisabled = true;
      this.error.amount = 'str.notEnoughNAKAAndNbot';
      return;
    }

    // Error getting allowance amount
    if (status === VOTING && !this.allowance) {
      this.buttonDisabled = true;
      this.error.address = 'str.errorGettingAllowance';
      return;
    }

    // Trying to bet more naka than you have or you just don't have enough NAKA period
    if ((status === BETTING && this.amount > currentWalletNaka + maxTransactionFee) || notEnoughNaka) {
      this.buttonDisabled = true;
      this.error.amount = 'str.notEnoughNaka';
      return;
    }

    // Not enough nbot for setting the result or voting
    if ((status === RESULT_SETTING && currentNbot < consensusThreshold && this.selectedOptionIdx !== -1)
      || (status === VOTING && currentNbot < this.amount)) {
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
    if ([BETTING, VOTING].includes(status) && (!this.amount)) {
      this.buttonDisabled = true;
      this.warningType = EventWarningType.INFO;
      this.eventWarningMessageId = 'oracle.enterAmountDisabledText';
      return;
    }

    // Enter an invalid amount
    if ([BETTING, VOTING].includes(status) && (this.amount <= 0 || Number.isNaN(this.amount))) {
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

  bet = async () => {
    await this.app.tx.executeBet({ eventAddr: this.event.address, optionIdx: this.selectedOption.idx, amount: decimalToSatoshi(this.amount), eventRound: this.event.currentRound });
  }

  setResult = async () => {
    const { isAllowanceEnough } = this.app.wallet;
    const { topicAddress } = this.oracle;
    const oracleAddress = this.oracle.address;
    const optionIdx = this.selectedOption.idx;
    const amountSatoshi = decimalToSatoshi(this.amount);

    if (this.allowance > 0 && !isAllowanceEnough(this.allowance, amountSatoshi)) {
      // Has allowance less than the consensus threshold, needs to reset
      await this.app.tx.addResetApproveTx(topicAddress, topicAddress, oracleAddress);
    } else if (!isAllowanceEnough(this.allowance, amountSatoshi)) {
      // No previous allowance, approve now
      await this.app.tx.addApproveSetResultTx(topicAddress, oracleAddress, optionIdx, amountSatoshi);
    } else {
      // Has enough allowance, set the result
      await this.app.tx.addSetResultTx(
        undefined,
        this.app.wallet.currentAddress,
        topicAddress,
        oracleAddress,
        optionIdx,
        amountSatoshi,
      );
    }
  }

  vote = async () => {
    const { isAllowanceEnough } = this.app.wallet;
    const { topicAddress } = this.oracle;
    const oracleAddress = this.oracle.address;
    const optionIdx = this.selectedOption.idx;
    const amountSatoshi = decimalToSatoshi(this.amount);

    if (this.allowance > 0 && !isAllowanceEnough(this.allowance, amountSatoshi)) {
      // Has allowance less than the vote amount, needs to reset
      await this.app.tx.addResetApproveTx(topicAddress, topicAddress, oracleAddress);
    } else if (!isAllowanceEnough(this.allowance, amountSatoshi)) {
      // No previous allowance, approve now
      await this.app.tx.addApproveVoteTx(topicAddress, oracleAddress, optionIdx, amountSatoshi);
    } else {
      // Has enough allowance, place vote
      await this.app.tx.addVoteTx(
        undefined,
        this.app.wallet.currentAddress,
        topicAddress,
        oracleAddress,
        optionIdx,
        amountSatoshi,
      );
    }
  }

  withdraw = async (senderAddress, type) => {
    await this.app.tx.addWithdrawTx(type, this.topic.address);
  }

  reset = () => Object.assign(this, INIT);
}
