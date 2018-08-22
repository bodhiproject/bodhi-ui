import { observable, computed, reaction, action, runInAction } from 'mobx';
import _ from 'lodash';
import axios from 'axios';
import moment from 'moment';
import Web3Utils from 'web3-utils';
import { TransactionType, Token } from 'constants';
import { TransactionCost } from 'models';
import { defineMessages } from 'react-intl';

import { decimalToSatoshi, satoshiToDecimal } from '../../helpers/utility';
import Tracking from '../../helpers/mixpanelUtil';
import Routes from '../../network/routes';
import { isProduction, maxTransactionFee, defaults } from '../../config/app';
import { createTopic } from '../../network/graphql/mutations';

const messages = defineMessages({
  createDatePastMsg: {
    id: 'create.datePast',
    defaultMessage: 'Cannot be in the past',
  },
  createValidBetEndMsg: {
    id: 'create.validBetEnd',
    defaultMessage: 'Must be at least 30 minutes after Prediction Start Time',
  },
  createValidResultSetStartMsg: {
    id: 'create.validResultSetStart',
    defaultMessage: 'Must be greater than or equal to Prediction End Time',
  },
  createValidResultSetEndMsg: {
    id: 'create.validResultSetEnd',
    defaultMessage: 'Must be at least 30 minutes after Result Setting Start Time',
  },
  strNotEnoughBotMsg: {
    id: 'str.notEnoughBot',
    defaultMessage: "You don't have enough BOT",
  },
  createRequiredMsg: {
    id: 'create.required',
    defaultMessage: 'Required',
  },
  createResultTooLongMsg: {
    id: 'create.resultTooLong',
    defaultMessage: 'Result name is too long.',
  },
  createInvalidNameMsg: {
    id: 'create.invalidName',
    defaultMessage: "Cannot name the outcome 'Invalid'",
  },
  createDuplicateOutcomeMsg: {
    id: 'create.duplicateOutcome',
    defaultMessage: 'Duplicate outcomes are not allowed.',
  },
  createNameLongMsg: {
    id: 'create.nameLong',
    defaultMessage: 'Event name is too long.',
  },
  invalidAddress: {
    id: 'create.invalidAddress',
    defaultMessage: 'Invalid address',
  },
});

const nowPlus = seconds => moment().add(seconds, 's').unix();
const MAX_LEN_EVENTNAME_HEX = 640;
const MAX_LEN_RESULT_HEX = 64;
const TIME_DELAY_FROM_NOW_SEC = 15 * 60;
let TIME_GAP_MIN_SEC = 30 * 60;
if (!isProduction()) {
  TIME_GAP_MIN_SEC = 2 * 60;
}

const INIT = {
  escrowAmount: '', // type: number
  averageBlockTime: '',
  txFees: [],
  txid: '',
  isOpen: false,
  txConfirmDialogOpen: false,
  txSentDialogOpen: false,
  resultSetterDialogOpen: false,
  title: '',
  creator: '',
  prediction: {
    startTime: nowPlus(TIME_DELAY_FROM_NOW_SEC),
    endTime: nowPlus(TIME_DELAY_FROM_NOW_SEC + TIME_GAP_MIN_SEC),
  },
  resultSetting: {
    startTime: nowPlus(TIME_DELAY_FROM_NOW_SEC + TIME_GAP_MIN_SEC),
    endTime: nowPlus(TIME_DELAY_FROM_NOW_SEC + (TIME_GAP_MIN_SEC * 2)),
  },
  outcomes: ['', ''],
  resultSetter: '',
  // if one of these in error is set, the form
  // field will display the associated error message
  error: {
    title: '',
    creator: '',
    prediction: {
      startTime: '',
      endTime: '',
    },
    resultSetting: {
      startTime: '',
      endTime: '',
    },
    outcomes: ['', ''],
    resultSetter: '',
  },
};


export default class CreateEventStore {
  escrowAmount = INIT.escrowAmount
  averageBlockTime = INIT.averageBlockTime
  txFees = INIT.txFees // used in txConfirmDialog
  txid = INIT.txid // used in txSentDialog
  @observable txConfirmDialogOpen = INIT.txConfirmDialogOpen
  @observable txSentDialogOpen = INIT.txSentDialogOpen
  @observable resultSetterDialogOpen = INIT.resultSetterDialogOpen

  // form fields
  @observable isOpen = INIT.isOpen
  @observable title = INIT.title
  @observable creator = INIT.creator // address
  @observable prediction = INIT.prediction
  @observable resultSetting = INIT.resultSetting
  @observable outcomes = INIT.outcomes
  @observable resultSetter = INIT.resultSetter // address
  @observable error = INIT.error
  @computed get hasEnoughQtum() {
    return this.app.wallet.lastUsedWallet.qtum >= maxTransactionFee;
  }
  @computed get warning() {
    if (!this.hasEnoughQtum) {
      return {
        id: 'str.notEnoughQtum',
        message: 'You don\'t have enough QTUM',
      };
    }
    return {};
  }
  @computed get blockNum() {
    const { prediction, resultSetting } = this;
    return {
      prediction: {
        startTime: this.calculateBlock(prediction.startTime),
        endTime: this.calculateBlock(prediction.endTime),
      },
      resultSetting: {
        startTime: this.calculateBlock(resultSetting.startTime),
        endTime: this.calculateBlock(resultSetting.endTime),
      },
    };
  }
  @computed get isAllValid() {
    const { title, creator, prediction, resultSetting, outcomes, resultSetter } = this.error;
    return (
      // all fields set
      this.title
      && this.outcomes.every(outcome => !!outcome)
      && this.resultSetter
      // no errors
      && !title
      && !creator
      && !prediction.startTime
      && !prediction.endTime
      && !resultSetting.startTime
      && !resultSetting.endTime
      && outcomes.every(outcome => !outcome)
      && !resultSetter
    );
  }

  constructor(app) {
    this.app = app;
    reaction( // when we add the creator, update our last used address
      () => this.creator,
      () => {
        if (this.creator) {
          this.app.wallet.lastUsedAddress = this.creator;
        }
      }
    );
    reaction( // make sure there are no errors when closing the result setter dialog
      () => this.resultSetterDialogOpen,
      () => {
        if (!this.resultSetterDialogOpen) {
          this.validateResultSetter();
        }
      }
    );
    reaction( // check date valiation when date changed
      () => this.prediction.startTime,
      () => {
        if (this.prediction.startTime - this.prediction.endTime > -TIME_GAP_MIN_SEC) {
          this.prediction.endTime = moment.unix(this.prediction.startTime).add(TIME_GAP_MIN_SEC, 's').unix();
        }
        this.validatePredictionStartTime();
      }
    );
    reaction( // check date valiation when date changed
      () => this.prediction.endTime,
      () => {
        if (this.prediction.endTime - this.resultSetting.startTime > -TIME_GAP_MIN_SEC) {
          this.resultSetting.startTime = moment.unix(this.prediction.endTime).unix();
        }
        this.validatePredictionEndTime();
      }
    );
    reaction( // check date valiation when date changed
      () => this.resultSetting.startTime,
      () => {
        if (this.resultSetting.startTime - this.resultSetting.endTime > -TIME_GAP_MIN_SEC) {
          this.resultSetting.endTime = moment.unix(this.resultSetting.startTime).add(TIME_GAP_MIN_SEC, 's').unix();
        }
        this.validateResultSettingStartTime();
      }
    );
    reaction( // check date valiation when date changed
      () => this.resultSetting.endTime,
      () => {
        this.validateResultSettingEndTime();
      }
    );
  }

  @action
  open = async () => {
    Tracking.track('dashboard-createEventClick');

    // Fetch current escrow amount
    let escrowRes;
    try {
      escrowRes = await axios.post(Routes.api.eventEscrowAmount, {
        senderAddress: this.app.wallet.lastUsedAddress,
      });
    } catch (err) {
      console.error('ERROR: ', { // eslint-disable-line
        route: Routes.api.eventEscrowAmount,
        message: err.message,
      });
      runInAction(() => {
        this.app.ui.setError(err.message, Routes.api.eventEscrowAmount);
      });
      return;
    }

    try {
      const res = await axios.get(Routes.insight.totals);
      this.averageBlockTime = res.data.time_between_blocks;
    } catch (err) {
      console.error('ERROR: ', { // eslint-disable-line
        route: Routes.insight.totals,
        message: err.message,
      });
      this.averageBlockTime = defaults.averageBlockTime;
    }

    runInAction(() => {
      this.prediction.startTime = nowPlus(TIME_DELAY_FROM_NOW_SEC);
      this.prediction.endTime = nowPlus(TIME_DELAY_FROM_NOW_SEC + TIME_GAP_MIN_SEC);
      this.resultSetting.startTime = nowPlus(TIME_DELAY_FROM_NOW_SEC + TIME_GAP_MIN_SEC);
      this.resultSetting.endTime = nowPlus(TIME_DELAY_FROM_NOW_SEC + (TIME_GAP_MIN_SEC * 2));
      this.escrowAmount = satoshiToDecimal(escrowRes.data[0]); // eslint-disable-line
      this.creator = this.app.wallet.lastUsedAddress;
      this.isOpen = true;
    });
  }

  @action
  setResultSetter = (address) => {
    this.resultSetter = address;
    this.resultSetterDialogOpen = false;
  }

  @action
  addOutcome = (outcome = '') => {
    this.outcomes.push(outcome);
    this.error.outcomes.push(outcome);
  }

  @action
  validateTitle = () => {
    // Remove hex prefix for length validation
    const hexString = Web3Utils.toHex(this.title || '').slice(2);
    if (!this.title) {
      this.error.title = messages.createRequiredMsg.id;
    } else if (hexString && hexString.length > MAX_LEN_EVENTNAME_HEX) {
      this.error.title = messages.createNameLongMsg.id;
    } else {
      this.error.title = '';
    }
  }

  @action
  validateCreator = () => {
    const { app: { wallet }, escrowAmount, creator } = this;
    const checkingAddresses = _.filter(wallet.addresses, { address: creator });
    if (checkingAddresses.length && checkingAddresses[0].bot < escrowAmount) {
      this.error.creator = messages.strNotEnoughBotMsg.id;
    } else if (!creator) {
      this.error.creator = messages.createRequiredMsg.id;
    } else {
      this.error.creator = '';
    }
  }

  isBeforeNow = (valueUnix) => _.isUndefined(valueUnix) || moment().unix() > valueUnix

  @action
  validatePredictionStartTime = () => {
    if (this.isBeforeNow(this.prediction.startTime)) {
      this.error.prediction.startTime = messages.createDatePastMsg.id;
    } else {
      this.error.prediction.startTime = '';
    }
  }

  @action
  validatePredictionEndTime = () => {
    if (this.isBeforeNow(this.prediction.endTime)) {
      this.error.prediction.endTime = messages.createDatePastMsg.id;
    } else if (this.prediction.endTime - this.prediction.startTime < TIME_GAP_MIN_SEC) {
      this.error.prediction.endTime = messages.createValidBetEndMsg.id;
    } else {
      this.error.prediction.endTime = '';
    }
  }

  @action
  validateResultSettingStartTime = () => {
    if (this.isBeforeNow(this.resultSetting.startTime)) {
      this.error.resultSetting.startTime = messages.createDatePastMsg.id;
    } else if (this.prediction.endTime > this.resultSetting.startTime) {
      this.error.resultSetting.startTime = messages.createValidResultSetStartMsg.id;
    } else {
      this.error.resultSetting.startTime = '';
    }
  }

  @action
  validateResultSettingEndTime = () => {
    if (this.isBeforeNow(this.resultSetting.endTime)) {
      this.error.resultSetting.endTime = messages.createDatePastMsg.id;
    } else if (this.resultSetting.endTime - this.resultSetting.startTime < TIME_GAP_MIN_SEC) {
      this.error.resultSetting.endTime = messages.createValidResultSetEndMsg.id;
    } else {
      this.error.resultSetting.endTime = '';
    }
  }

  @action
  validateOutcome = (i) => {
    const outcome = (this.outcomes[i] || '').toLowerCase();

    // validate not empty
    if (!outcome) {
      this.error.outcomes[i] = messages.createRequiredMsg.id;
      return;
    }

    // Validate hex length
    const hexString = Web3Utils.toHex(outcome).slice(2); // Remove hex prefix for length validation
    if (hexString.length > MAX_LEN_RESULT_HEX) {
      this.error.outcomes[i] = messages.createResultTooLongMsg.id;
      return;
    }

    // Validate cannot name Invalid
    if (outcome === 'invalid') {
      this.error.outcomes[i] = messages.createInvalidNameMsg.id;
      return;
    }

    // Validate no duplicate outcomes
    const filtered = this.outcomes.filter((item) => (item || '').toLowerCase() === outcome);
    if (filtered.length > 1) {
      this.error.outcomes[i] = messages.createDuplicateOutcomeMsg.id;
      return;
    }
    this.error.outcomes[i] = '';
  }

  @action
  validateResultSetter = async () => {
    if (!this.resultSetter) {
      this.error.resultSetter = messages.createRequiredMsg.id;
    } else if (!(await this.isValidAddress())) {
      this.error.resultSetter = messages.invalidAddress.id;
    } else {
      this.error.resultSetter = '';
    }
  }

  isValidAddress = async () => {
    try {
      const { data: { result } } = await axios.post(Routes.api.validateAddress, { address: this.resultSetter });
      return result.isvalid;
    } catch (error) {
      runInAction(() => {
        this.app.ui.setError(error.message, Routes.api.validateAddress);
      });
    }
  }

  @action
  prepareToCreateEvent = async () => {
    this.validateAll();
    if (!this.isAllValid) return;
    try {
      const txInfo = {
        type: TransactionType.APPROVE_CREATE_EVENT,
        token: Token.BOT,
        amount: decimalToSatoshi(this.escrowAmount),
        optionIdx: undefined,
        topicAddress: undefined,
        oracleAddress: undefined,
        senderAddress: this.creator,
      };
      const { data: { result } } = await axios.post(Routes.api.transactionCost, txInfo);
      const txFees = _.map(result, (item) => new TransactionCost(item));
      runInAction(() => {
        this.txFees = txFees;
        this.txConfirmDialogOpen = true;
      });
    } catch (error) {
      runInAction(() => {
        this.app.ui.setError(error.message, Routes.api.transactionCost);
      });
    }
    const { wallet } = this.app;
    if (wallet.needsToBeUnlocked) {
      wallet.unlockDialogOpen = true;
    } else {
      wallet.unlockDialogOpen = false;
    }
  }

  validateAll = () => {
    this.validateTitle();
    this.validateCreator();
    this.validatePredictionStartTime();
    this.validatePredictionEndTime();
    this.validateResultSettingStartTime();
    this.validateResultSettingEndTime();
    for (var i in this.outcomes) { // eslint-disable-line
      this.validateOutcome(i);
    }
    this.validateResultSetter();
  }

  @action
  submit = async () => {
    try {
      const { data } = await createTopic(
        this.title,
        this.outcomes,
        this.resultSetter,
        this.prediction.startTime.toString(),
        this.prediction.endTime.toString(),
        this.resultSetting.startTime.toString(),
        this.resultSetting.endTime.toString(),
        decimalToSatoshi(this.escrowAmount),
        this.creator, // address
      );

      runInAction(() => {
        this.app.qtumPrediction.loadFirst();
        this.app.pendingTxsSnackbar.init(); // Show pending txs snackbar
        this.txConfirmDialogOpen = false;
        this.txid = data.createTopic.txid;
        this.txSentDialogOpen = true;
        this.app.pendingTxsSnackbar.init();
      });
    } catch (error) {
      console.error('ERROR: ', { // eslint-disable-line
        ...error,
        route: `${Routes.graphql.http}/createTopicTx`,
      });
      runInAction(() => {
        this.app.ui.setError(error.message, `${Routes.graphql.http}/createTopicTx`);
      });
    }
  }

  close = () => Object.assign(this, INIT)

  /*
  * Calculates the estimated block based on current block and future date.
  * @param currentBlock {Number} The current block number.
  * @param futureDate {Moment} A moment instance (UTC) of the future date to estimate.
  * @param averageBlockTime {Number} The average block time in seconds.
  * @return {Number} Returns a number of the estimated future block.
  */
  calculateBlock = (futureDateUnix) => {
    const currentBlock = this.app.global.syncBlockNum;
    const diffSec = futureDateUnix - moment().unix();
    return Math.round(diffSec / this.averageBlockTime) + currentBlock;
  }
}
