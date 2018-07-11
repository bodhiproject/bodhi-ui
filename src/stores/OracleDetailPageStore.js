import { observable, runInAction, action, computed, reaction } from 'mobx';
import graphql from 'graphql.js';
import { SortBy, TransactionType, TransactionStatus, EventWarningType, Token } from 'constants';
import moment from 'moment';
import _ from 'lodash';
import axios from 'axios';
import NP from 'number-precision';

import Tracking from '../helpers/mixpanelUtil';
import { toFixed } from '../helpers/utility';
import { createBetTx, createSetResultTx, createVoteTx, createFinalizeResultTx } from '../network/graphMutation';
import networkRoutes from '../network/routes';

import Oracle from './models/Oracle';
import { queryAllTransactions } from '../network/graphQuery';
import { maxTransactionFee } from '../config/app';

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
  confirmDialogOpen: false,
  buttonDisabled: false,
  warningType: '',
  eventWarningMessageId: '',
};

export default class {
  @observable loading = INIT.loading
  @observable oracles = []
  @observable amount = INIT.amount // input amount to bet, vote, etc. for each event option
  @observable address = INIT.address
  @observable topicAddress = INIT.topicAddress
  @observable transactions = INIT.transactions
  @observable selectedOptionIdx = INIT.selectedOptionIdx // option selected for a oracle
  @observable confirmDialogOpen = INIT.confirmDialogOpen
  @observable buttonDisabled = INIT.buttonDisabled // TODO: in INIT
  @observable warningType = INIT.warningType
  @observable eventWarningMessageId = INIT.eventWarningMessageId
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
  @computed get selectedOption() {
    return this.oracle.options[this.selectedOptionIdx] || {};
  }


  constructor(app) {
    this.app = app;
  }

  @action
  async init({ topicAddress, address, txid }) {
    this.topicAddress = topicAddress;
    this.address = address;
    this.txid = txid;
    if (topicAddress === 'null' && address === 'null' && txid) { // unconfirmed
      // Find mutated Oracle based on txid since a mutated Oracle won't have a topicAddress or oracleAddress
      const { allOracles } = await gql`
        query {
          allOracles(filter: { txid: "${txid}", status: CREATED }) {
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
      runInAction(() => {
        this.oracles = _.orderBy(allOracles.map(o => new Oracle(o, this.app)), ['blockNum'], [SortBy.ASCENDING.toLowerCase()]);
        this.loading = false;
      });
    } else {
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
      const transactions = await queryAllTransactions([{ topicAddress }], { field: 'createdTime', direction: SortBy.DESCENDING });
      runInAction(() => {
        this.oracles = _.orderBy(allOracles.map(o => new Oracle(o, this.app)), ['blockNum'], [SortBy.ASCENDING.toLowerCase()]);
        this.transactions = transactions;
        this.loading = false;
      });
    }

    // when we get a new block or transactions are updated, react to it
    reaction(
      () => this.app.global.syncBlockTime + this.transactions,
      () => {
        const { phase, resultSetterQAddress } = this.oracle;
        const { global: { syncBlockTime }, wallet } = this.app;
        const currBlockTime = moment.unix(syncBlockTime);
        const totalQtum = _.sumBy(wallet.addresses, ({ qtum }) => qtum);
        const notEnoughQtum = totalQtum < maxTransactionFee;
        // console.log('SYNC B TIEM: ', syncBlockTime);
        // Already have a pending tx for this Oracle
        const pendingTxs = _.filter(this.transactions, { oracleAddress: this.oracle.address, status: TransactionStatus.PENDING });
        if (pendingTxs.length > 0) {
          this.buttonDisabled = true;
          this.warningType = EventWarningType.HIGHLIGHT;
          this.eventWarningMessageId = 'str.pendingTransactionDisabledMsg';
          return;
        }

        if (phase === 'BETTING' && currBlockTime.isBefore(moment.unix(this.oracle.startTime))) {
          this.buttonDisabled = true;
          this.warningType = EventWarningType.INFO;
          this.eventWarningMessageId = 'oracle.betStartTimeDisabledText';
          return;
        }


        // Has not reached result setting start time
        if ((phase === 'RESULT_SETTING')
          && currBlockTime.isBefore(moment.unix(this.oracle.resultSetStartTime))) {
          this.buttonDisabled = true;
          this.warningType = EventWarningType.INFO;
          this.eventWarningMessageId = 'oracle.setStartTimeDisabledText';
          return;
        }

        // User is not the result setter
        if (phase === 'RESULT_SETTING' && resultSetterQAddress !== wallet.lastUsedAddress) {
          this.buttonDisabled = true;
          this.warningType = EventWarningType.INFO;
          this.eventWarningMessageId = 'oracle.cOracleDisabledText';
          return;
        }

        // Trying to set result or vote when not enough QTUM or BOT
        const filteredAddress = _.filter(wallet.addresses, { address: wallet.lastUsedAddress });
        const currentBot = filteredAddress.length > 0 ? filteredAddress[0].bot : 0; // # of BOT at currently selected address
        if ((
          (phase === 'VOTING' && currentBot < this.amount)
          || (phase === 'RESULT_SETTING' && currentBot < this.oracle.consensusThreshold)
        ) && notEnoughQtum) {
          this.buttonDisabled = true;
          this.warningType = EventWarningType.ERROR;
          this.eventWarningMessageId = 'str.notEnoughQtumAndBot';
          return;
        }

        // ALL
        // Trying to bet more qtum than you have or you just don't have enough QTUM period
        if ((phase === 'BETTING' && this.amount > totalQtum + maxTransactionFee) || notEnoughQtum) {
          this.buttonDisabled = true;
          this.warningType = EventWarningType.ERROR;
          this.eventWarningMessageId = 'str.notEnoughQtum';
          return;
        }


        // Not enough bot for setting the result or voting
        if ((phase === 'RESULT_SETTING' && currentBot < this.oracle.consensusThreshold)
          || (phase === 'VOTING' && currentBot < this.amount)) {
          this.buttonDisabled = true;
          this.warningType = EventWarningType.ERROR;
          this.eventWarningMessageId = 'str.notEnoughBot';
          return;
        }

        // Did not select a result
        if (phase !== 'FINALIZING' && this.selectedOptionIdx === -1) {
          this.buttonDisabled = true;
          this.warningType = EventWarningType.INFO;
          this.eventWarningMessageId = 'oracle.selectResultDisabledText';
          return;
        }

        // Did not enter an amount
        if (['BETTING', 'VOTING'].includes(phase) && (this.amount <= 0 || Number.isNaN(this.amount))) {
          this.buttonDisabled = true;
          this.warningType = EventWarningType.INFO;
          this.eventWarningMessageId = 'oracle.enterAmountDisabledText';
          return;
        }

        // Trying to vote over the consensus threshold
        const optionAmount = this.selectedOption.amount;
        const maxVote = phase === 'VOTING' ? NP.minus(this.oracle.consensusThreshold, optionAmount) : 0;
        if (phase === 'VOTING' && this.selectedOptionIdx >= 0 && this.amount > maxVote) {
          this.buttonDisabled = true;
          this.amount = toFixed(maxVote);
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

  // used by confirm tx modal
  confirm = () => {
    const actionToPerform = {
      BETTING: this.bet,
      RESULT_SETTING: this.setResult,
      VOTING: this.vote,
      FINALIZING: this.finalize,
    }[this.oracle.phase];
    if (_.isUndefined(action)) console.error(`NO ACTION FOR PHASE ${this.oracle.phase}`); // eslint-disable-line
    actionToPerform();
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
      this.confirmDialogOpen = true;
    });
  }

  @action
  prepareSetResult = async () => {
    const { data: { result } } = await axios.post(networkRoutes.api.transactionCost, {
      type: TransactionType.APPROVESETRESULT,
      token: this.oracle.token,
      amount: this.oracle.consensusThreshold,
      optionIdx: this.selectedOptionIdx,
      topicAddress: this.oracle.topicAddress,
      oracleAddress: this.oracle.address,
      senderAddress: this.app.wallet.lastUsedAddress,
    });
    runInAction(() => {
      this.oracle.txFees = result;
      this.confirmDialogOpen = true;
    });
  }

  // TODO: this is same logic as this.prepareBet(), maybe combine? idk...
  @action
  prepareVote = async () => {
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
      this.confirmDialogOpen = true;
    });
  }

  @action
  bet = async () => {
    const { lastUsedAddress } = this.app.wallet;
    const { selectedOptionIdx, amount } = this;
    const { topicAddress, version, address } = this.option;

    await createBetTx(version, topicAddress, address, selectedOptionIdx, amount, lastUsedAddress);

    const transactions = await queryAllTransactions([{ topicAddress }], { field: 'createdTime', direction: SortBy.DESCENDING });
    runInAction(() => {
      this.app.oraclePage.confirmDialogOpen = false;
      this.transactions = transactions;
    });

    Tracking.track('oracleDetail-bet');
  }

  @action
  setResult = async () => {
    const { lastUsedAddress } = this.app.wallet;
    const { selectedOptionIdx } = this;
    const { version, topicAddress, address, consensusThreshold } = this.oracle;

    await createSetResultTx(version, topicAddress, address, selectedOptionIdx, consensusThreshold, lastUsedAddress);

    const transactions = await queryAllTransactions([{ topicAddress }], { field: 'createdTime', direction: SortBy.DESCENDING });
    runInAction(() => {
      this.app.oraclePage.confirmDialogOpen = false;
      this.transactions = transactions;
    });

    Tracking.track('oracleDetail-set');
  }

  @action
  vote = async () => {
    const { lastUsedAddress } = this.app.wallet;
    const { version, topicAddress, address } = this.oracle;
    const { amount, selectedOptionIdx } = this;

    await createVoteTx(version, topicAddress, address, selectedOptionIdx, amount, lastUsedAddress);

    const transactions = await queryAllTransactions([{ topicAddress }], { field: 'createdTime', direction: SortBy.DESCENDING });
    runInAction(() => {
      this.app.oraclePage.confirmDialogOpen = false;
      this.transactions = transactions;
    });

    Tracking.track('oracleDetail-vote');
  }

  finalize = async () => {
    const { lastUsedAddress } = this.app.wallet;
    const { version, topicAddress, address } = this.oracle;

    await createFinalizeResultTx(version, topicAddress, address, lastUsedAddress);

    const transactions = await queryAllTransactions([{ topicAddress }], { field: 'createdTime', direction: SortBy.DESCENDING });
    runInAction(() => {
      this.app.oraclePage.confirmDialogOpen = false;
      this.transactions = transactions;
    });

    Tracking.track('oracleDetail-finalize');
  }

  @action
  reset = () => Object.assign(this, INIT)
}
