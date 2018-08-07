import { observable, runInAction, action, computed, reaction } from 'mobx';
import graphql from 'graphql.js';
import { SortBy, TransactionType, TransactionStatus, EventWarningType, Token, Phases } from 'constants';
import moment from 'moment';
import _ from 'lodash';
import axios from 'axios';
import NP from 'number-precision';
import { Oracle, Transaction, Topic } from 'models';

import Tracking from '../../helpers/mixpanelUtil';
import { toFixed, decimalToSatoshi, satoshiToDecimal, processTopic } from '../../helpers/utility';
import { createBetTx, createSetResultTx, createVoteTx, createFinalizeResultTx, createWithdrawTx } from '../../network/graphMutation';
import networkRoutes from '../../network/routes';

import { queryAllTransactions, queryAllOracles, queryAllTopics, queryAllVotes } from '../../network/graphQuery';
import { maxTransactionFee } from '../../config/app';
const { BETTING, VOTING, RESULT_SETTING, FINALIZING } = Phases;

const graph = graphql('http://127.0.0.1:8989/graphql', {
  asJSON: true,
});

const gql = (strings, ...vars) => {
  const string = strings.reduce((acc, str, i) => vars[i] ? acc + str + vars[i] : acc + str, '');
  return graph(string)();
};

const INIT = {
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
};

/**
 * TODO: this needs to be split up into different oracle stores
 */
export default class EventStore {
  @observable type = 'oracle'
  @observable loading = INIT.loading
  @observable oracles = []
  @observable amount = INIT.amount // input amount to bet, vote, etc. for each event option
  @observable address = INIT.address
  @observable topicAddress = INIT.topicAddress
  @observable transactions = INIT.transactions
  @observable selectedOptionIdx = INIT.selectedOptionIdx // option selected for a oracle
  @observable txConfirmDialogOpen = INIT.txConfirmDialogOpen
  @observable txSentDialogOpen = INIT.txSentDialogOpen
  @observable buttonDisabled = INIT.buttonDisabled
  @observable warningType = INIT.warningType
  @observable eventWarningMessageId = INIT.eventWarningMessageId
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
  // oracle
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
    return this.event.options[this.selectedOptionIdx] || {};
  }
  @computed get event() {
    if (this.type === 'topic') return this.topic;
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
    if (type === 'topic') {
      // GraphQL calls
      this.escrowAmount = await this.getEscrowAmount();
      const topics = await queryAllTopics([{ address }], undefined, 1, 0);
      const transactions = await queryAllTransactions([{ topicAddress: address }], { field: 'createdTime', direction: SortBy.DESCENDING });

      // API calls
      const { bets, votes } = await this.getBetAndVoteBalances();
      const withdrawableAddresses = await this.getWithdrawableAddresses();
      const oracles = await this.getAllOracles(address);
      runInAction(() => {
        this.topics = topics.map(topic => new Topic(topic, this.app));
        // const { 0: t } = this.topics;
        // console.log('t', t);
        this.transactions = transactions.map(tx => new Transaction(tx, this.app));
        this.oracles = oracles;
        this.betBalances = bets;
        this.voteBalances = votes;
        this.withdrawableAddresses = withdrawableAddresses;
        this.botWinnings = _.sumBy(withdrawableAddresses, a => (
          a.type === TransactionType.WITHDRAW && a.botWon ? a.botWon : 0
        ));
        this.qtumWinnings = _.sumBy(withdrawableAddresses, ({ qtumWon }) => qtumWon);
        this.selectedOptionIdx = this.topic.resultIdx;
        this.loading = false;
      });
      return;
    }
    if (topicAddress === 'null' && address === 'null' && txid) { // unconfirmed
      // Find mutated Oracle based on txid since a mutated Oracle won't have a topicAddress or oracleAddress
      const oracles = await this.getOraclesBeforeConfirmed(txid);
      runInAction(() => {
        this.oracles = oracles;
        this.loading = false;
        this.routeToConfirmedOracle();
      });
    } else {
      const oracles = await this.getAllOracles(topicAddress);
      const transactions = await queryAllTransactions([{ topicAddress }], { field: 'createdTime', direction: SortBy.DESCENDING });
      runInAction(() => {
        this.oracles = oracles;
        this.transactions = transactions.map(tx => new Transaction(tx));
        this.loading = false;
      });
    }

    reaction(
      () => this.oracle.phase,
      () => {
        if (this.oracle.phase === RESULT_SETTING) {
          this.amount = '100';
        }
      },
      { fireImmediately: true } // for when we go to a result setting page directly
    );


    reaction(
      () => this.app.global.syncBlockTime,
      async () => {
        if (topicAddress === 'null' && address === 'null' && txid) {
          // TODO: wip for fixing redirect when oracle switches phases/when an created+unconfirmed oracle becomes confirmed
          const filters = [{ txid }];
          this.oracles = await queryAllOracles(filters);
          if (this.oracles.length > 0) {
            this.routeToConfirmedOracle();
          }
        }
      }
    );

    // when we get a new block or transactions are updated, react to it
    reaction(
      () => this.app.global.syncBlockTime + this.transactions + this.amount + this.selectedOptionIdx,
      () => {
        const { phase, resultSetterQAddress, resultSetStartTime, isOpenResultSetting, consensusThreshold } = this.oracle;
        const { global: { syncBlockTime }, wallet } = this.app;
        const currBlockTime = moment.unix(syncBlockTime);
        const totalQtum = _.sumBy(wallet.addresses, ({ qtum }) => qtum);
        const notEnoughQtum = totalQtum < maxTransactionFee;
        // Already have a pending tx for this Oracle
        const pendingTxs = _.filter(this.transactions, { oracleAddress: this.oracle.address, status: TransactionStatus.PENDING });
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
        if ((phase === BETTING && this.amount > totalQtum + maxTransactionFee) || notEnoughQtum) {
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

        // Trying to vote over the consensus threshold
        const optionAmount = this.selectedOption.amount;
        const maxVote = phase === VOTING ? NP.minus(consensusThreshold, optionAmount) : 0;
        if (phase === VOTING && this.selectedOptionIdx >= 0 && this.amount > maxVote) {
          this.buttonDisabled = true;
          this.amount = String(toFixed(maxVote));
          // TODO: this get's called everytime we change the amount, since we
          // autocorrect it above, this warning never get's shown
          this.warningType = EventWarningType.ERROR;
          this.eventWarningMessageId = 'oracle.maxVoteText';
          return;
        }
        this.buttonDisabled = false;
        this.eventWarningMessageId = '';
        this.warningType = '';
      },
      { fireImmediately: true },
    );
  }

  // TODO: go from /oracle/null/null/:txid -> /oracle/:topicAddress/:address/:txid
  routeToConfirmedOracle = () => {
    // const { topicAddress, address, txid } = this;
    // this.app.router.push(`/oracle/${topicAddress}/${address}/${txid}`);
  }

  @action // used in the VotingOracle onBlur
  fixAmount = () => {
    if (this.oracle.phase !== VOTING) return;
    const [inputAmount, consensusThreshold] = [parseFloat(this.amount, 10), parseFloat(this.oracle.consensusThreshold, 10)];
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
    const { data: { result } } = await axios.post(networkRoutes.api.transactionCost, {
      type: TransactionType.BET,
      token: this.oracle.token,
      amount: Number(this.amount),
      optionIdx: this.selectedOptionIdx,
      topicAddress: this.oracle.topicAddress,
      oracleAddress: this.oracle.address,
      senderAddress: this.app.wallet.lastUsedAddress,
    });
    runInAction(() => {
      this.oracle.txFees = result;
      this.txConfirmDialogOpen = true;
    });
  }

  @action
  prepareSetResult = async () => {
    const { data: { result } } = await axios.post(networkRoutes.api.transactionCost, {
      type: TransactionType.APPROVE_SET_RESULT,
      token: this.oracle.token,
      amount: this.oracle.consensusThreshold,
      optionIdx: this.selectedOptionIdx,
      topicAddress: this.oracle.topicAddress,
      oracleAddress: this.oracle.address,
      senderAddress: this.app.wallet.lastUsedAddress,
    });
    runInAction(() => {
      this.oracle.txFees = result;
      this.txConfirmDialogOpen = true;
    });
  }

  // TODO: this is same logic as this.prepareBet(), maybe combine? idk...
  @action
  prepareVote = async () => {
    const { data: { result } } = await axios.post(networkRoutes.api.transactionCost, {
      type: TransactionType.VOTE,
      token: this.oracle.token,
      amount: Number(this.amount),
      optionIdx: this.selectedOptionIdx,
      topicAddress: this.oracle.topicAddress,
      oracleAddress: this.oracle.address,
      senderAddress: this.app.wallet.lastUsedAddress,
    });
    runInAction(() => {
      this.oracle.txFees = result;
      this.txConfirmDialogOpen = true;
    });
  }

  @action
  bet = async () => {
    const { lastUsedAddress } = this.app.wallet;
    const { selectedOptionIdx, amount } = this;
    const { topicAddress, version, address } = this.oracle;

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

    Tracking.track('oracleDetail-bet');
  }

  @action
  setResult = async () => {
    const { lastUsedAddress } = this.app.wallet;
    const { selectedOptionIdx, amount } = this;
    const { version, topicAddress, address } = this.oracle;

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

    Tracking.track('oracleDetail-set');
  }

  @action
  vote = async () => {
    const { lastUsedAddress } = this.app.wallet;
    const { version, topicAddress, address } = this.oracle;
    const { selectedOptionIdx } = this;
    const amount = decimalToSatoshi(this.amount);

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

    Tracking.track('oracleDetail-vote');
  }

  finalize = async () => {
    const { lastUsedAddress } = this.app.wallet;
    const { version, topicAddress, address } = this.oracle;

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

    Tracking.track('oracleDetail-finalize');
  }

  withdraw = async (senderAddress, type) => {
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
    Tracking.track('topicDetail-withdraw');
  }

  getOraclesBeforeConfirmed = async (txid) => {
    const { allOracles } = await gql`
      query {
        allOracles(filter: { txid: "${txid}" }) {
          txid
          version
          address
          topicAddress
          status
          token
          name
          options
          optionIdxs
          amounts
          resultIdx
          blockNum
          startTime
          endTime
          resultSetStartTime
          resultSetEndTime
          resultSetterAddress
          resultSetterQAddress
          consensusThreshold
          transactions {
            type
            status
          }
        }
      }
    `;
    return _.orderBy(allOracles.map(o => new Oracle(o, this.app)), ['blockNum'], [SortBy.ASCENDING.toLowerCase()]);
  }

  getAllOracles = async (topicAddress) => {
    const { allOracles } = await gql`
      query {
        allOracles(filter: { topicAddress: "${topicAddress}" }) {
          txid
          version
          address
          topicAddress
          status
          token
          name
          options
          optionIdxs
          amounts
          resultIdx
          blockNum
          startTime
          endTime
          resultSetStartTime
          resultSetEndTime
          resultSetterAddress
          resultSetterQAddress
          consensusThreshold
          transactions {
            type
            status
          }
        }
      }
    `;
    return _.orderBy(allOracles.map(o => new Oracle(o, this.app)), ['blockNum'], [SortBy.ASCENDING.toLowerCase()]);
  }

  getBetAndVoteBalances = async () => {
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
    const bets = _.map(_.unzip(betArrays), _.sum);
    const votes = _.map(_.unzip(voteArrays), _.sum);
    return { bets, votes };
  }

  getEscrowAmount = async () => {
    const escrowRes = await axios.post(networkRoutes.api.eventEscrowAmount, {
      senderAddress: this.app.wallet.lastUsedAddress,
    });
    const eventEscrowAmount = satoshiToDecimal(escrowRes.data.result[0]);
    return eventEscrowAmount;
  }

  getWithdrawableAddresses = async () => {
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
    let escrowClaim = 0; // eslint-disable-line
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
        escrowClaim = topic.escrowAmount;
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
    return withdrawableAddresses;
  }

  reset = () => Object.assign(this, INIT)
}
