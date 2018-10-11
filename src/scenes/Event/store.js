import { observable, runInAction, action, computed, reaction, toJS } from 'mobx';
import moment from 'moment';
import { sum, find, isUndefined, sumBy, isNull, isEmpty, each, map, unzip, filter, fill, includes } from 'lodash';
import axios from 'axios';
import NP from 'number-precision';
import { EventType, SortBy, TransactionType, EventWarningType, Token, Phases } from 'constants';

import { toFixed, decimalToSatoshi, satoshiToDecimal } from '../../helpers/utility';
import networkRoutes from '../../network/routes';
import { queryAllTransactions, queryAllOracles, queryAllTopics, queryAllVotes } from '../../network/graphql/queries';
import { maxTransactionFee } from '../../config/app';

const { UNCONFIRMED, TOPIC, ORACLE } = EventType;
const { BETTING, VOTING, RESULT_SETTING, FINALIZING } = Phases;

const INIT = {
  type: undefined,
  loading: true,
  oracles: [],
  topics: [],
  amount: '',
  address: '',
  topicAddress: '',
  transactions: [],
  selectedOptionIdx: -1,
  buttonDisabled: false,
  warningType: '',
  eventWarningMessageId: '',
  escrowClaim: 0,
  hashId: '',
  allowance: undefined,
  qtumWinnings: 0,
  botWinnings: 0,
  withdrawableAddresses: [],
  error: {
    amount: '',
    address: '',
  },
};

export default class EventStore {
  @observable type = INIT.type // One of EventType: [UNCONFIRMED, TOPIC, ORACLE]
  @observable loading = INIT.loading
  @observable oracles = INIT.oracles
  @observable amount = INIT.amount // Input amount to bet, vote, etc. for each event option
  @observable address = INIT.address
  @observable topicAddress = INIT.topicAddress
  @observable transactions = INIT.transactions
  @observable selectedOptionIdx = INIT.selectedOptionIdx // Current option selected for an Oracle
  @observable buttonDisabled = INIT.buttonDisabled
  @observable warningType = INIT.warningType
  @observable eventWarningMessageId = INIT.eventWarningMessageId
  @observable escrowClaim = INIT.escrowClaim
  @observable hashId = INIT.hashId
  @observable allowance = INIT.allowance; // In Botoshi

  @observable error = INIT.error

  // topic
  @observable topics = INIT.topics
  @observable qtumWinnings = INIT.qtumWinnings
  @observable botWinnings = INIT.botWinnings
  @observable withdrawableAddresses = INIT.withdrawableAddresses
  betBalances = []
  voteBalances = []

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
    return find(this.topics, { address: this.address }) || {};
  }
  // For Oracle only
  @computed get unconfirmed() {
    return isUndefined(this.topicAddress) && isUndefined(this.address);
  }
  @computed get dOracles() { // [BOT] - VOTING -> PENDING/WAITRESULT -> WITHDRAW
    return this.oracles.filter(({ token }) => token === Token.BOT);
  }
  @computed get cOracle() {
    // [QTUM] - CREATED -> BETTING -> WAITRESULT -> OPENRESULTSET -> PENDING -> WITHDRAW
    // mainly: BETTING & RESULT SETTING phases
    return find(this.oracles, { token: Token.QTUM }) || {};
  }
  @computed get oracle() {
    if (this.unconfirmed) {
      return find(this.oracles, { hashId: this.hashId });
    }
    return find(this.oracles, { address: this.address }) || {};
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
  async init({ topicAddress, address, txid, type, hashId }) {
    this.reset();
    this.topicAddress = topicAddress;
    this.address = address;
    this.txid = txid;
    this.type = type;
    this.hashId = hashId;

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
    this.oracles = await queryAllOracles(this.app, [{ hashId: this.hashId }], undefined, 1);
    this.loading = false;
  }

  @action
  initTopic = async () => {
    this.topicAddress = this.address;

    // GraphQL calls
    await this.queryTopics();
    await this.queryOracles(this.address);
    await this.queryTransactions(this.address);

    // API calls
    await this.getEscrowAmount();
    await this.calculateWinnings();

    this.selectedOptionIdx = this.topic.resultIdx;
    this.loading = false;
  }

  @action
  initOracle = async () => {
    // GraphQL calls
    await this.queryOracles(this.topicAddress);
    await this.queryTransactions(this.topicAddress);
    await this.getAllowanceAmount();

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

    // Current wallet address changed
    reaction(
      () => this.app.wallet.currentAddress,
      () => this.getAllowanceAmount(),
    );

    // New block
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
            await this.queryTransactions(this.address);
            this.disableEventActionsIfNecessary();
            break;
          }
          case ORACLE: {
            await this.queryTransactions(this.topicAddress);
            await this.queryOracles(this.topicAddress);
            await this.getAllowanceAmount();
            this.disableEventActionsIfNecessary();
            break;
          }
          default: {
            break;
          }
        }
      }
    );

    // Tx, amount, selected option, current wallet address, or allowance changes
    reaction(
      () => this.transactions + this.amount + this.selectedOptionIdx + this.app.wallet.currentWalletAddress + this.allowance,
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
    const res = await queryAllOracles(this.app, [{ hashId: this.hashId }]);
    if (!isNull(res[0].topicAddress)) {
      const { topicAddress, address, txid } = res[0];
      this.app.router.push(`/oracle/${topicAddress}/${address}/${txid}`);
    }
  }

  @action
  queryTopics = async () => this.topics = await queryAllTopics(this.app, [{ address: this.address }], undefined, 1);

  @action
  queryOracles = async (address) => this.oracles = await queryAllOracles(this.app, [{ topicAddress: address }], { field: 'blockNum', direction: SortBy.ASCENDING });

  @action
  queryTransactions = async (address) => {
    this.transactions = await queryAllTransactions(
      [{ topicAddress: address }],
      { field: 'createdTime', direction: SortBy.DESCENDING },
    );
  }

  @action
  addPendingTx(pendingTransaction) {
    this.transactions.unshift(pendingTransaction);
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

  /**
   * Gets the allowance amount for result setting and voting oracles.
   * The allowance is the current amount of BOT approved for transfer.
   */
  @action
  getAllowanceAmount = async () => {
    if (includes([RESULT_SETTING, VOTING], this.oracle.phase)) {
      this.allowance = await this.app.wallet.checkAllowance(this.app.wallet.currentAddress, this.topicAddress);
    }
  }

  @action
  calculateWinnings = async () => {
    await this.getBetAndVoteBalances();
    await this.getWithdrawableAddresses();

    this.botWinnings = sumBy(this.withdrawableAddresses, a => (
      a.type === TransactionType.WITHDRAW && a.botWon ? a.botWon : 0
    ));
    this.qtumWinnings = sumBy(this.withdrawableAddresses, ({ qtumWon }) => qtumWon);
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
      const topics = await queryAllTopics(this.app, [{ address: eventAddress }]);
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
            botWon: topic.escrowAmount,
            qtumWon: 0,
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
        const botWon = data ? satoshiToDecimal(data[0]) : 0;
        const qtumWon = data ? satoshiToDecimal(data[1]) : 0;

        // return only winning addresses
        if (botWon || qtumWon) {
          withdrawableAddresses.push({
            type: TransactionType.WITHDRAW,
            address: vote.voterAddress,
            botWon,
            qtumWon,
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
    const { phase, resultSetterAddress, resultSetStartTime, isOpenResultSetting, consensusThreshold } = this.oracle;
    const { global: { syncBlockTime }, wallet } = this.app;
    const currBlockTime = moment.unix(syncBlockTime);
    const currentWalletQtum = wallet.currentWalletAddress ? wallet.currentWalletAddress.qtum : 0;
    const notEnoughQtum = currentWalletQtum < maxTransactionFee;

    this.buttonDisabled = false;
    this.warningType = '';
    this.eventWarningMessageId = '';
    this.error = INIT.error;

    // Trying to vote over the consensus threshold - currently not way to trigger
    const amountNum = Number(this.amount);
    if (phase === VOTING && this.amount && this.selectedOptionIdx >= 0) {
      const maxVote = NP.minus(consensusThreshold, this.selectedOption.amount);
      if (amountNum > maxVote) {
        this.buttonDisabled = true;
        this.error.amount = 'oracle.maxVoteText';
        return;
      }
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
    if (phase === RESULT_SETTING && !isOpenResultSetting && resultSetterAddress !== wallet.currentAddress) {
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

    // Trying to set result or vote when not enough QTUM or BOT
    const filteredAddress = filter(wallet.addresses, { address: wallet.currentAddress });
    const currentBot = filteredAddress.length > 0 ? filteredAddress[0].bot : 0; // # of BOT at currently selected address
    if ((
      (phase === VOTING && currentBot < this.amount)
      || (phase === RESULT_SETTING && currentBot < consensusThreshold)
    ) && notEnoughQtum) {
      this.buttonDisabled = true;
      this.error.amount = 'str.notEnoughQtumAndBot';
      return;
    }

    // Error getting allowance amount
    if (phase === VOTING && !this.allowance) {
      this.buttonDisabled = true;
      this.error.address = 'str.errorGettingAllowance';
      return;
    }

    // Trying to bet more qtum than you have or you just don't have enough QTUM period
    if ((phase === BETTING && this.amount > currentWalletQtum + maxTransactionFee) || notEnoughQtum) {
      this.buttonDisabled = true;
      this.error.amount = 'str.notEnoughQtum';
      return;
    }

    // Not enough bot for setting the result or voting
    if ((phase === RESULT_SETTING && currentBot < consensusThreshold && this.selectedOptionIdx !== -1)
      || (phase === VOTING && currentBot < this.amount)) {
      this.buttonDisabled = true;
      this.error.amount = 'str.notEnoughBot';
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
    if ([BETTING, VOTING].includes(phase) && (!this.amount)) {
      this.buttonDisabled = true;
      this.warningType = EventWarningType.INFO;
      this.eventWarningMessageId = 'oracle.enterAmountDisabledText';
      return;
    }

    // Enter an invalid amount
    if ([BETTING, VOTING].includes(phase) && (this.amount <= 0 || Number.isNaN(this.amount))) {
      this.buttonDisabled = true;
      this.error.amount = 'str.invalidAmount';
    }
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

  bet = async () => {
    await this.app.tx.addBetTx(this.oracle.topicAddress, this.oracle.address, this.selectedOption.idx, this.amount);
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

  finalize = async () => {
    await this.app.tx.addFinalizeResultTx(this.oracle.topicAddress, this.oracle.address);
  }

  withdraw = async (senderAddress, type) => {
    await this.app.tx.addWithdrawTx(type, this.topic.address);
  }

  reset = () => Object.assign(this, INIT);
}
