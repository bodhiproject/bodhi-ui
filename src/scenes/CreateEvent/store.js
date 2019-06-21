import { observable, computed, reaction, action, runInAction } from 'mobx';
import { sumBy, map, filter, isUndefined, each } from 'lodash';
import axios from 'axios';
import moment from 'moment';
import { utf8ToHex, isAddress } from 'web3-utils';
import { Routes } from 'constants';
import { defineMessages } from 'react-intl';
import { decimalToSatoshi, satoshiToDecimal } from '../../helpers/utility';
import Tracking from '../../helpers/mixpanelUtil';
import { API } from '../../network/routes';
import { isProduction } from '../../config/app';

const messages = defineMessages({
  createDatePastMsg: {
    id: 'create.datePast',
    defaultMessage: 'Cannot be in the past',
  },
  createValidBetEndMsg: {
    id: 'create.validBetEnd',
    defaultMessage: 'Must be at least 30 minutes after current time',
  },
  createValidResultSetStartMsg: {
    id: 'create.validResultSetStart',
    defaultMessage: 'Must be greater than or equal to Prediction End Time',
  },
  createValidResultSetEndMsg: {
    id: 'create.validResultSetEnd',
    defaultMessage: 'Must be at least 30 minutes after Result Setting Start Time',
  },
  strNotEnoughNbotMsg: {
    id: 'str.notEnoughNbot',
    defaultMessage: "You don't have enough NBOT",
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

const MAX_LEN_EVENTNAME_HEX = 640;
const MAX_LEN_RESULT_HEX = 64;
const TIME_GAP_MIN_SEC = 24 * 60 * 60;
const VALIDATE_TIME_GAP_MIN_SEC = isProduction() ? 30 * 60 : 2 * 60;

const nowPlus = seconds => moment().add(seconds, 's').unix();
const INIT = {
  loaded: false,
  creating: false,
  escrowAmount: undefined,
  arbLengths: [],
  thresholdOptions: [],
  arbOptions: [],
  averageBlockTime: 3,
  txFees: [],
  resultSetterDialogOpen: false,
  title: '',
  creator: '',
  prediction: {
    startTime: moment().unix(),
    endTime: nowPlus(TIME_GAP_MIN_SEC),
  },
  resultSetting: {
    startTime: nowPlus(TIME_GAP_MIN_SEC),
    endTime: nowPlus(TIME_GAP_MIN_SEC * 3),
  },
  outcomes: ['', ''],
  resultSetter: '',
  arbRewardPercent: 10,
  arbOptionSelected: 1,
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
  arbLengths = INIT.arbLengths // array of numbers
  thresholdOptions = INIT.thresholdOptions // array of decimal numbers
  @observable arbOptions = INIT.arbOptions
  averageBlockTime = INIT.averageBlockTime
  @observable txFees = INIT.txFees
  @observable resultSetterDialogOpen = INIT.resultSetterDialogOpen

  // form fields
  @observable loaded = INIT.loaded
  @observable creating = INIT.creating
  @observable title = INIT.title
  @observable creator = INIT.creator // address
  @observable betStartTime = INIT.betStartTime
  @observable betEndTime = INIT.betEndTime
  @observable resultSetStartTime = INIT.resultSetStartTime
  @observable resultSetEndTime = INIT.resultSetEndTime
  @observable prediction = INIT.prediction
  @observable resultSetting = INIT.resultSetting
  @observable outcomes = INIT.outcomes
  @observable resultSetter = INIT.resultSetter // address
  @observable arbRewardPercent = INIT.arbRewardPercent
  @observable arbOptionSelected = INIT.arbOptionSelected
  @observable error = INIT.error

  @computed get hasEnoughFee() {
    const transactionFee = sumBy(this.txFees, ({ gasCost }) => Number(gasCost));
    const { currentWalletAddress } = this.app.wallet;
    return currentWalletAddress
      && (currentWalletAddress.naka >= transactionFee)
      && (currentWalletAddress.nbot >= this.escrowAmount);
  }
  @computed get warning() {
    if (!this.hasEnoughFee) {
      return {
        id: 'str.notEnoughNAKAAndNbot',
        message: 'You don\'t have enough NBOT',
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
  @computed get predictionPeriod() {
    const { prediction: { startTime, endTime } } = this;
    const time = moment(moment.unix(endTime).format('LLL'), 'LLL').diff(moment(moment.unix(startTime).format('LLL'), 'LLL'), 'minutes');
    const year = Math.floor(time / 365 / 24 / 60);
    const day = Math.floor((time / 24 / 60) % 365);
    const hour = Math.floor((time / 60) % 24);
    const min = time % 60;
    let period = '';
    if (year > 0) period += ` ${year} years`;
    if (day > 0) period += ` ${day} days`;
    if (hour > 0) period += ` ${hour} hours`;
    if (min > 0) period += ` ${min} min`;
    return period;
  }
  @computed get resultSettingPeriod() {
    const { resultSetting: { startTime, endTime } } = this;
    const time = moment(moment.unix(endTime).format('LLL'), 'LLL').diff(moment(moment.unix(startTime).format('LLL'), 'LLL'), 'minutes');
    const year = Math.floor(time / 365 / 24 / 60);
    const day = Math.floor((time / 24 / 60) % 365);
    const hour = Math.floor((time / 60) % 24);
    const min = time % 60;
    let period = '';
    if (year > 0) period += ` ${year} years`;
    if (day > 0) period += ` ${day} days`;
    if (hour > 0) period += ` ${hour} hours`;
    if (min > 0) period += ` ${min} min`;
    return period;
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
        if (this.resultSetting.startTime - this.resultSetting.endTime > -2 * TIME_GAP_MIN_SEC) {
          this.resultSetting.endTime = moment.unix(this.resultSetting.startTime).add(2 * TIME_GAP_MIN_SEC, 's').unix();
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
    const { currentBlock } = this;
    const diffSec = futureDateUnix - moment().unix();
    return Math.round(diffSec / this.averageBlockTime) + currentBlock;
  }

  @action
  init = async () => {
    Tracking.track('dashboard-createEventClick');
    this.currentBlock = this.app.global.syncBlockNum;

    // Fetch escrow amount from ConfigManager
    const escrowAmountSuccess = await this.getEscrowAmount();
    if (!escrowAmountSuccess) {
      this.close();
      return;
    }

    // Fetch arbitration lengths from ConfigManager
    const arbLengthsSuccess = await this.getArbitrationLengths();
    if (!arbLengthsSuccess) {
      this.close();
      return;
    }
    // Fetch arbitration lengths from ConfigManager
    const thresholdsSuccess = await this.getConsensusThresholds();
    if (!thresholdsSuccess) {
      this.close();
      return;
    }
    this.constructArbOptions();

    runInAction(async () => {
      this.prediction.startTime = moment().unix();
      this.prediction.endTime = nowPlus(TIME_GAP_MIN_SEC);
      this.resultSetting.startTime = nowPlus(TIME_GAP_MIN_SEC);
      this.resultSetting.endTime = moment.unix(this.resultSetting.startTime).add(TIME_GAP_MIN_SEC * 2, 's').unix();
      this.creator = this.app.wallet.currentAddress;
      this.resultSetter = this.app.wallet.currentAddress;
      this.loaded = true;
    });
  }

  /**
   * Fetches the escrow amount from the API.
   * @return {boolean} True if the API call was successful.
   */
  @action
  getEscrowAmount = async () => {
    try {
      const { data: { result } } = await axios.get(API.EVENT_ESCROW_AMOUNT);
      this.escrowAmount = satoshiToDecimal(result);
      return true;
    } catch (err) {
      this.app.globalDialog.setError(`${err.message}: ${err.response.data.error}`);
    }
    return false;
  }

  /**
   * Fetches the arbitration lengths from the API.
   * @return {boolean} True if the API call was successful.
   */
  @action
  getArbitrationLengths = async () => {
    try {
      const { data: { result } } = await axios.get(API.ARBITRATION_LENGTH);
      // TODO: Change seconds to hours (or minutes?)
      this.arbLengths = result;
      return true;
    } catch (err) {
      this.app.globalDialog.setError(`${err.message}: ${err.response.data.error}`);
    }
    return false;
  }

  /**
   * Fetches the consensus thresholds from the API.
   * @return {boolean} True if the API call was successful.
   */
  @action
  getConsensusThresholds = async () => {
    try {
      const { data: { result } } = await axios.get(API.STARTING_CONSENSUS_THRESHOLD);
      this.thresholdOptions = map(result, satoshiToDecimal);
      return true;
    } catch (err) {
      this.app.globalDialog.setError(`${err.message}: ${err.response.data.error}`);
    }
    return false;
  }

  @action
  constructArbOptions = () => {
    if (this.arbLengths.length !== this.thresholdOptions.length) return;

    const opts = [];
    each(this.arbLengths, (arbLength, index) => {
      opts.push({
        length: arbLength,
        threshold: this.thresholdOptions[index],
      });
    });
    this.arbOptions = opts;
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
  setArbRewardPercent = (percent) => {
    this.arbRewardPercent = percent;
  }

  @action
  setArbOptionSelected = (index) => {
    this.arbOptionSelected = index;
  }

  @action
  validateTitle = () => {
    // Remove hex prefix for length validation
    const hexString = utf8ToHex(this.title || '').slice(2);
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
    if (checkingAddresses.length && checkingAddresses[0].nbot < escrowAmount) {
      this.error.creator = messages.strNotEnoughNbotMsg.id;
    } else if (!creator) {
      this.error.creator = messages.createRequiredMsg.id;
    } else {
      this.error.creator = '';
    }
  }

  isBeforeNow = (valueUnix) => isUndefined(valueUnix) || moment().unix() > valueUnix

  @action
  validatePredictionEndTime = () => {
    if (this.isBeforeNow(this.prediction.endTime)) {
      this.error.prediction.endTime = messages.createDatePastMsg.id;
    } else if (this.prediction.endTime - this.prediction.startTime < VALIDATE_TIME_GAP_MIN_SEC) {
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
    } else if (this.resultSetting.endTime - this.resultSetting.startTime < VALIDATE_TIME_GAP_MIN_SEC) {
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
    const hexString = utf8ToHex(outcome).slice(2); // Remove hex prefix for length validation
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
  validateResultSetter = () => {
    if (!this.resultSetter) {
      this.error.resultSetter = messages.createRequiredMsg.id;
    } else if (!isAddress(this.resultSetter)) {
      this.error.resultSetter = messages.invalidAddress.id;
    } else {
      this.error.resultSetter = '';
    }
  }

  validateAll = () => {
    this.validateTitle();
    this.validateCreator();
    this.validatePredictionEndTime();
    this.validateResultSettingStartTime();
    this.validateResultSettingEndTime();
    each(this.outcomes, (value, key) => {
      this.validateOutcome(key);
    });
    this.validateResultSetter();
  }

  @action
  submit = async ({ ...props }) => {
    const { ui: { toggleHistoryNeedUpdate }, global: { toggleBalanceNeedUpdate } } = this.app;
    this.validateAll();
    if (!this.isAllValid) return;
    const escrowAmountSatoshi = decimalToSatoshi(this.escrowAmount);

    const txid = await this.app.tx.executeCreateEvent({
      senderAddress: this.app.wallet.currentAddress,
      name: this.title,
      results: this.outcomes,
      centralizedOracle: this.resultSetter,
      betEndTime: this.prediction.endTime,
      resultSetStartTime: this.resultSetting.startTime,
      amountSatoshi: escrowAmountSatoshi,
      arbitrationOptionIndex: this.arbOptionSelected,
      arbitrationRewardPercentage: this.arbRewardPercent,
      language: this.app.ui.locale,
    });
    if (!txid) return;
    this.close();
    toggleHistoryNeedUpdate();
    toggleBalanceNeedUpdate();
    props.history.push(Routes.ACTIVITY_HISTORY);
  }

  close = () => Object.assign(this, INIT)
}
