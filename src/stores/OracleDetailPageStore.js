import { observable, runInAction, action, computed, reaction } from 'mobx';
import graphql from 'graphql.js';
import { SortBy, TransactionType, TransactionStatus, EventWarningType, Token, Phases } from 'constants';
import moment from 'moment';
import _ from 'lodash';
import axios from 'axios';
import NP from 'number-precision';

import Tracking from '../helpers/mixpanelUtil';
import { toFixed, decimalToSatoshi } from '../helpers/utility';
import { createBetTx, createSetResultTx, createVoteTx, createFinalizeResultTx } from '../network/graphMutation';
import networkRoutes from '../network/routes';

import Oracle from './models/Oracle';
import Transaction from './models/Transaction';
import { queryAllTransactions } from '../network/graphQuery';
import { maxTransactionFee } from '../config/app';
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

export default class {
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
      const oracles = await this.getOraclesBeforeConfirmed(txid);
      runInAction(() => {
        this.oracles = oracles;
        this.loading = false;
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
          // const oraclez = await this.getOraclesBeforeConfirmed(txid);
          // console.log('orc: ', oraclez);
          // const oracles = await this.getAllOracles(oraclez[0].topicAddress);
          // console.log('oracles: ', oracles);
          // if (oracles.length > 0) {
          //   const latestOracle = oracles[0];

          //   const { topicAddress: tpcAddress, address: addr, txid: id } = latestOracle;
          //   console.log('topicAddress: ', tpcAddress);
          //   console.log('address: ', addr);
          //   console.log('txid: ', id);
          //   // construct url for oracle or topic
          //   let url;
          //   if (latestOracle.status !== OracleStatus.WITHDRAW) {
          //     url = `/oracle/${latestOracle.topicAddress}/${latestOracle.address}/${latestOracle.txid}`;
          //   } else {
          //     url = `/topic/${latestOracle.topicAddress}`;
          //   }
          //   console.log('URL: ', url);
          //   // window.location = url;
          // }
        }
        if (topicAddress) { // when a oracle goes from FINALIZING -> WITHDRAWING
          this.oracles = await this.getAllOracles(topicAddress);
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

  getOraclesBeforeConfirmed = async (txid) => {
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

  @action
  reset = () => Object.assign(this, INIT)
}
