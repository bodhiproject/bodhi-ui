import { observable, computed, reaction, action, runInAction } from 'mobx';
import { sumBy, map, filter, isUndefined, isEmpty, each } from 'lodash';
import axios from 'axios';
import moment from 'moment';
import Web3Utils from 'web3-utils';
import { TransactionType, TransactionStatus, Token } from 'constants';
import { TransactionCost } from 'models';
import { defineMessages } from 'react-intl';

import { decimalToSatoshi, satoshiToDecimal } from '../../helpers/utility';
import Tracking from '../../helpers/mixpanelUtil';
import Routes from '../../network/routes';
import { isProduction, defaults } from '../../config/app';
import getContracts from '../../config/contracts';
import { queryAllTransactions } from '../../network/graphql/queries';

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
  createPendingExists: {
    id: 'create.pendingExists',
    defaultMessage: 'You can only create 1 event at a time. Please wait until your other Event is created.',
  },
  invalidAddress: {
    id: 'create.invalidAddress',
    defaultMessage: 'Invalid address',
  },
});

const MAX_LEN_EVENTNAME_HEX = 640;
const MAX_LEN_RESULT_HEX = 64;
const TIME_DELAY_FROM_NOW_SEC = 15 * 60;
const TIME_GAP_MIN_SEC = isProduction() ? 30 * 60 : 2 * 60;
const nowPlus = seconds => moment().add(seconds, 's').unix();
const INIT = {
  isOpen: false,
  loaded: false,
  escrowAmount: undefined,
  averageBlockTime: '',
  txFees: [],
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
  // if one of these in error is set, the form field will display the associated error message
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
  @observable escrowAmount = INIT.escrowAmount // decimal number
  averageBlockTime = INIT.averageBlockTime
  @observable txFees = INIT.txFees
  @observable resultSetterDialogOpen = INIT.resultSetterDialogOpen

  // form fields
  @observable isOpen = INIT.isOpen
  @observable loaded = INIT.loaded
  @observable title = INIT.title
  @observable creator = INIT.creator // address
  @observable prediction = INIT.prediction
  @observable resultSetting = INIT.resultSetting
  @observable outcomes = INIT.outcomes
  @observable resultSetter = INIT.resultSetter // address
  @observable error = INIT.error

  @computed get hasEnoughFee() {
    const transactionFee = sumBy(this.txFees, ({ gasCost }) => Number(gasCost));
    const { currentWalletAddress } = this.app.wallet;
    return currentWalletAddress
      && (currentWalletAddress.qtum >= transactionFee)
      && (currentWalletAddress.bot >= this.escrowAmount);
  }

  @computed get warning() {
    if (!this.hasEnoughFee) {
      return {
        id: 'str.notEnoughQtumAndBot',
        message: 'You don\'t have enough QTUM or BOT',
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

    // when we add the creator, update the currentWalletAddress
    reaction(
      () => this.creator,
      () => {
        if (this.creator) {
          this.app.wallet.setCurrentWalletAddress(this.creator);
        }
      }
    );
    // make sure there are no errors when closing the result setter dialog
    reaction(
      () => this.resultSetterDialogOpen,
      () => {
        if (!this.resultSetterDialogOpen) {
          this.validateResultSetter();
        }
      }
    );
    // check date valiation when date changed
    reaction(
      () => this.prediction.startTime,
      () => {
        if (this.prediction.startTime - this.prediction.endTime > -TIME_GAP_MIN_SEC) {
          this.prediction.endTime = moment.unix(this.prediction.startTime).add(TIME_GAP_MIN_SEC, 's').unix();
        }
        this.validatePredictionStartTime();
      }
    );
    // check date valiation when date changed
    reaction(
      () => this.prediction.endTime,
      () => {
        if (this.prediction.endTime - this.resultSetting.startTime > -TIME_GAP_MIN_SEC) {
          this.resultSetting.startTime = moment.unix(this.prediction.endTime).unix();
        }
        this.validatePredictionEndTime();
      }
    );
    // check date valiation when date changed
    reaction(
      () => this.resultSetting.startTime,
      () => {
        if (this.resultSetting.startTime - this.resultSetting.endTime > -TIME_GAP_MIN_SEC) {
          this.resultSetting.endTime = moment.unix(this.resultSetting.startTime).add(TIME_GAP_MIN_SEC, 's').unix();
        }
        this.validateResultSettingStartTime();
      }
    );
    // check date valiation when date changed
    reaction(
      () => this.resultSetting.endTime,
      () => {
        this.validateResultSettingEndTime();
      }
    );
  }

  /**
   * Calculates the estimated block based on current block and future date.
   * @param {number} futureDateUnix Future date in Unix format.
   * @return {number} Estimated future block.
   */
  calculateBlock = (futureDateUnix) => {
    const currentBlock = this.app.global.syncBlockNum;
    const diffSec = futureDateUnix - moment().unix();
    return Math.round(diffSec / this.averageBlockTime) + currentBlock;
  }

  @action
  open = async () => {
    Tracking.track('dashboard-createEventClick');
    this.isOpen = true;
    this.loaded = INIT.loaded;
    // Check if there is a current address
    if (isEmpty(this.app.wallet.currentAddress)) {
      this.app.qrypto.openPopover('qrypto.loginToView');
      this.close();
      return;
    }

    // Close if getting pending txs fails
    const hasPendingTxs = await this.hasPendingCreateTxs();
    if (hasPendingTxs) {
      this.close();
      return;
    }

    // Close if unable to get the escrow amount
    const escrowAmountSuccess = await this.getEscrowAmount();
    if (!escrowAmountSuccess) {
      this.close();
      return;
    }

    await this.getAverageBlockTime();

    runInAction(async () => {
      this.prediction.startTime = nowPlus(TIME_DELAY_FROM_NOW_SEC);
      this.prediction.endTime = nowPlus(TIME_DELAY_FROM_NOW_SEC + TIME_GAP_MIN_SEC);
      this.resultSetting.startTime = nowPlus(TIME_DELAY_FROM_NOW_SEC + TIME_GAP_MIN_SEC);
      this.resultSetting.endTime = nowPlus(TIME_DELAY_FROM_NOW_SEC + (TIME_GAP_MIN_SEC * 2));
      this.creator = this.app.wallet.currentAddress;
      this.loaded = true;
      // Determine if user has enough tokens to create an event
      try {
        const { data } = await axios.post(Routes.api.transactionCost, {
          type: TransactionType.APPROVE_CREATE_EVENT,
          senderAddress: this.app.wallet.currentAddress,
          amount: decimalToSatoshi(this.escrowAmount),
          token: Token.BOT,
        });
        this.txFees = map(data, (item) => new TransactionCost(item));
      } catch (error) {
        this.app.components.globalDialog.setError(`${error.message} : ${error.response.data.error}`, Routes.api.transactionCost);
      }
    });
  }

  /**
   * Checks for any pending create event txs for the current wallet address.
   * @return {boolean} True if the current wallet address has pending create txs.
   */
  hasPendingCreateTxs = async () => {
    try {
      const { currentAddress } = this.app.wallet;
      const { PENDING } = TransactionStatus;
      const filters = [
        { status: PENDING, type: TransactionType.APPROVE_CREATE_EVENT, senderAddress: currentAddress },
        { status: PENDING, type: TransactionType.CREATE_EVENT, senderAddress: currentAddress },
      ];
      const pendingCreates = await queryAllTransactions(filters);
      if (pendingCreates.length > 0) {
        this.app.components.globalDialog.setError({
          id: 'create.pendingExists',
          defaultMessage: 'You can only create 1 event at a time. Please wait until your other Event is created.',
        });
        this.close();
        return true;
      }
    } catch (err) {
      this.app.components.globalDialog.setError(err.message, `${Routes.graphql.http}/all-transactions`);
      this.close();
    }
    return false;
  }

  /**
   * Fetches the escrow amount from the API.
   * @return {boolean} True if the API call was successful.
   */
  @action
  getEscrowAmount = async () => {
    try {
      const res = await axios.post(Routes.api.eventEscrowAmount, { senderAddress: this.app.wallet.currentAddress });
      this.escrowAmount = satoshiToDecimal(res.data[0]);
      return true;
    } catch (err) {
      this.app.components.globalDialog.setError(`${err.message} : ${err.response.data.error}`, Routes.api.eventEscrowAmount);
      this.close();
    }
    return false;
  }

  /**
   * Gets the average block time from the Insight API.
   */
  @action
  getAverageBlockTime = async () => {
    try {
      const { data } = await axios.get(Routes.insight.totals);
      this.averageBlockTime = data.time_between_blocks;
    } catch (err) {
      console.error(`${Routes.insight.totals}: ${err.message}`); // eslint-disable-line
      this.averageBlockTime = defaults.averageBlockTime;
    }
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
    const checkingAddresses = filter(wallet.addresses, { address: creator });
    if (checkingAddresses.length && checkingAddresses[0].bot < escrowAmount) {
      this.error.creator = messages.strNotEnoughBotMsg.id;
    } else if (!creator) {
      this.error.creator = messages.createRequiredMsg.id;
    } else {
      this.error.creator = '';
    }
  }

  isBeforeNow = (valueUnix) => isUndefined(valueUnix) || moment().unix() > valueUnix

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
      const { data } = await axios.post(Routes.api.validateAddress, { address: this.resultSetter });
      return data.isvalid;
    } catch (error) {
      runInAction(() => {
        this.app.components.globalDialog.setError(`${error.message} : ${error.response.data.error}`, Routes.api.validateAddress);
      });
    }
  }

  validateAll = () => {
    this.validateTitle();
    this.validateCreator();
    this.validatePredictionStartTime();
    this.validatePredictionEndTime();
    this.validateResultSettingStartTime();
    this.validateResultSettingEndTime();
    each(this.outcomes, (value, key) => {
      this.validateOutcome(key);
    });
    this.validateResultSetter();
  }

  @action
  submit = async () => {
    this.validateAll();
    if (!this.isAllValid) return;

    const { checkAllowance, currentAddress, isAllowanceEnough } = this.app.wallet;
    const allowance = await checkAllowance(currentAddress, getContracts().AddressManager.address);
    const escrowAmountSatoshi = decimalToSatoshi(this.escrowAmount);
    if (isAllowanceEnough(allowance, escrowAmountSatoshi)) {
      await this.app.tx.addCreateEventTx(
        undefined,
        this.app.wallet.currentAddress,
        this.title,
        this.outcomes,
        this.resultSetter,
        this.prediction.startTime.toString(),
        this.prediction.endTime.toString(),
        this.resultSetting.startTime.toString(),
        this.resultSetting.endTime.toString(),
        escrowAmountSatoshi,
        this.app.ui.locale,
      );
    } else {
      await this.app.tx.addApproveCreateEventTx(
        this.title,
        this.outcomes,
        this.resultSetter,
        this.prediction.startTime.toString(),
        this.prediction.endTime.toString(),
        this.resultSetting.startTime.toString(),
        this.resultSetting.endTime.toString(),
        escrowAmountSatoshi,
        this.app.ui.locale,
      );
    }

    this.close();
  }

  close = () => Object.assign(this, INIT)
}
