/* eslint-disable */
import { observable, runInAction, action, computed, reaction } from 'mobx';
import graphql from 'graphql.js';
import { SortBy, OracleStatus, TransactionType, TransactionStatus, EventWarningType, Token } from 'constants';
import moment from 'moment';
import _ from 'lodash';
import axios from 'axios';
import Tracking from '../helpers/mixpanelUtil';
import { toFixed } from '../helpers/utility';
import { createBetTx } from '../network/graphMutation';
import Routes from '../network/routes';

import Oracle from './models/Oracle';
import { queryAllTransactions } from '../network/graphQuery';
import { maxTransactionFee } from '../config/app';

var graph = graphql("http://127.0.0.1:8989/graphql", {
  asJSON: true,
})
var gql = (strings, ...vars) => {
  const string = strings.reduce((acc, str, i) => vars[i] ? acc + str + vars[i] : acc + str, '');
  return graph(string)();
}

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
    return this.oracles.filter(({ token }) => token == Token.BOT);
  }
  @computed get cOracle() {
    // [QTUM] - CREATED -> BETTING -> WAITRESULT -> OPENRESULTSET -> PENDING -> WITHDRAW
    // mainly: BETTING & RESULT SETTING phases
    return _.find(this.oracles, { token: Token.QTUM });
  }
  @computed get oracle() {
    if (this.unconfirmed) return _.find(this.oracles, { txid: this.txid })
    return _.find(this.oracles, { address: this.address }) || {}
  }

  constructor(app) {
    this.app = app;
  }

  confirm = () => {
    const action = {
      BETTING: this.bet,
      RESULT_SETTING: this.setResult,
      VOTING: this.vote,
      FINALIZING: this.finalize,
    }[this.oracle.phase];
    if (_.isUndefined(action)) console.error('NO ACTION');
    action();
  }

  @action
  async init({ topicAddress, address, txid }) {
    // console.log('A: ', address)
    this.topicAddress = topicAddress;
    this.address = address;
    this.txid = txid;
    console.log('TP ADDR: ', topicAddress, 'ADDR: ', address, 'TXID: ', txid);
    if (topicAddress === 'null' && address === 'null' && txid) { // unconfirmed
      // Find mutated Oracle based on txid since a mutated Oracle won't have a topicAddress or oracleAddress
      let { allOracles } = await gql`
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
        // this.dOracles = _.orderBy(allOracles
        //   .filter(({ token }) => token === Token.Bot)
        //   .map(o => new Oracle(o, this.app))
        // ['blockNum'], [SortBy.Ascending.toLowerCase()])
        this.oracles = _.orderBy(allOracles.map(o => new Oracle(o, this.app)), ['blockNum'], [SortBy.Ascending.toLowerCase()])
        // console.log('dOracles: ', this.dOracles);
        // this.oracle = new Oracle(oracle, this.app);
        // this.transactions = transactions;
        this.loading = false;
      });
    } else {
      let { allOracles } = await gql`
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
        // console.log('ALL ORACLES: ', allOracles);
        // this.dOracles = _.orderBy(_.filter(allOracles, { token: Token.Bot }), ['blockNum'], [SortBy.Ascending.toLowerCase()]);
        // this.dOracles = _.orderBy(allOracles
        //   .filter(({ token }) => token === Token.Bot)
        //   .map(o => new Oracle(o, this.app))
        // ['blockNum'], [SortBy.Ascending.toLowerCase()])
        this.oracles = _.orderBy(allOracles.map(o => new Oracle(o, this.app)), ['blockNum'], [SortBy.ASCENDING.toLowerCase()])
        // this.oracle = new Oracle(oracle, this.app);
        this.transactions = transactions;
        this.loading = false;
      });
    }
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

        if (phase == 'BETTING' && currBlockTime.isBefore(moment.unix(this.oracle.startTime))) {
          this.buttonDisabled = true;
          this.warningType = EventWarningType.INFO;
          this.eventWarningMessageId = 'oracle.betStartTimeDisabledText';
          return;
        }


        // Has not reached result setting start time
        if ((phase == 'RESULT_SETTING')
          && currBlockTime.isBefore(moment.unix(this.oracle.resultSetStartTime))) {
          this.buttonDisabled = true;
          this.warningType = EventWarningType.INFO;
          this.eventWarningMessageId = 'oracle.setStartTimeDisabledText';
          return;
        }

        // User is not the result setter
        if (phase == 'RESULT_SETTING' && resultSetterQAddress !== wallet.lastUsedAddress) {
          this.buttonDisabled = true;
          this.warningType = EventWarningType.INFO;
          this.eventWarningMessageId = 'oracle.cOracleDisabledText';
          return;
        }

        // Trying to set result or vote when not enough QTUM or BOT
        const filteredAddress = _.filter(wallet.addresses, { address: wallet.lastUsedAddress });
        const currentBot = filteredAddress.length > 0 ? filteredAddress[0].bot : 0; // # of BOT at currently selected address
        if ((
          (phase == 'VOTING' && currentBot < this.amount)
          || (phase == 'RESULT_SETTING' && currentBot < this.oracle.consensusThreshold)
        ) && notEnoughQtum) {
          this.buttonDisabled = true;
          this.warningType = EventWarningType.ERROR;
          this.eventWarningMessageId = 'str.notEnoughQtumAndBot';
          return;
        }

        // ALL
        // Trying to bet more qtum than you have or you just don't have enough QTUM period
        if ((phase == 'BETTING' && this.amount > totalQtum + maxTransactionFee) || notEnoughQtum) {
          this.buttonDisabled = true;
          this.warningType = EventWarningType.ERROR;
          this.eventWarningMessageId = 'str.notEnoughQtum';
          return;
        }


        // Not enough bot for setting the result or voting
        if ((phase == 'RESULT_SETTING' && currentBot < this.oracle.consensusThreshold)
          || (phase == 'VOTING' && currentBot < this.amount)) {
          this.buttonDisabled = true;
          this.warningType = EventWarningType.ERROR;
          this.eventWarningMessageId = 'str.notEnoughBot';
          return;
        }

        // Did not select a result
        if (phase != 'FINALIZING' && this.selectedOptionIdx == -1) {
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
        const optionAmount = this.oracle.selectedOption.amount;
        const maxVote = phase == 'VOTING' ? NP.minus(this.oracle.consensusThreshold, optionAmount) : 0;
        if (phase == 'VOTING' && this.selectedOptionIdx >= 0 && this.amount > maxVote) {
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
    )
  }

  prepareBet = async () => {
    const txType = {
      type: TransactionType.BET,
      token: this.oracle.token,
      amount: Number(this.amount),
      // amount: this.consensusThreshold, // RESULT SETTING
      optionIdx: this.selectedOptionIdx,
      topicAddress: this.oracle.topicAddress,
      oracleAddress: this.oracle.address,
      senderAddress: this.app.wallet.lastUsedAddress,
    }
    const { data: { result } } = await axios.post(Routes.api.transactionCost, txType);
    runInAction(() => {
      // console.log('RES: ', result);
      this.oracle.txFees = result;
      this.confirmDialogOpen = true;
    });
  }

  prepareSetResult = async () => {
  }

  prepareVote = async () => {
  }

  @action
  bet = async () => {
    // const { createBetTx, lastUsedAddress } = this.props;
    const { lastUsedAddress } = this.app.wallet;
    const { topicAddress, oracle, selectedOptionIdx, amount } = this.app.oraclePage;

    console.log('ORACLE VERSION: ', oracle.version);

    await createBetTx(
      oracle.version,
      topicAddress,
      oracle.address,
      selectedOptionIdx,
      amount, // should already be a string
      lastUsedAddress,
    );

    const transactions = await queryAllTransactions([{ topicAddress }], { field: 'createdTime', direction: SortBy.Descending });
    runInAction(() => {
      this.app.oraclePage.confirmDialogOpen = false;
      this.transactions = transactions;
    });

    Tracking.track('oracleDetail-bet');
  }

  // setResult = () => {
  //   const { createSetResultTx, lastUsedAddress } = this.props;
  //   const { oracle, currentOptionIdx } = this.state;

  //   createSetResultTx(
  //     oracle.version,
  //     oracle.topicAddress,
  //     oracle.address,
  //     currentOptionIdx,
  //     oracle.consensusThreshold,
  //     lastUsedAddress,
  //   );

  //   Tracking.track('oracleDetail-set');
  // }

  // vote = (amount) => {
  //   const { createVoteTx, lastUsedAddress } = this.props;
  //   const { oracle, currentOptionIdx } = this.state;

  //   createVoteTx(
  //     oracle.version,
  //     oracle.topicAddress,
  //     oracle.address,
  //     currentOptionIdx,
  //     amount,
  //     lastUsedAddress,
  //   );

  //   Tracking.track('oracleDetail-vote');
  // }

  // finalizeResult = () => {
  //   const { createFinalizeResultTx, lastUsedAddress } = this.props;
  //   const { oracle } = this.state;

  //   createFinalizeResultTx(oracle.version, oracle.topicAddress, oracle.address, lastUsedAddress);

  //   Tracking.track('oracleDetail-finalize');
  // }

  @action
  reset = () => Object.assign(this, INIT)
}
