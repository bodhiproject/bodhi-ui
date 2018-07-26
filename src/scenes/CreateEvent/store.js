import { observable, computed, reaction, action, runInAction } from 'mobx';
import _ from 'lodash';
import axios from 'axios';
import moment from 'moment';
import Web3Utils from 'web3-utils';
import { TransactionType, Token } from 'constants';

import { satoshiToDecimal, decimalToSatoshi } from '../../helpers/utility';
import Tracking from '../../helpers/mixpanelUtil';
import Routes from '../../network/routes';
import { maxTransactionFee } from '../../config/app';
import { createTopic } from '../../network/graphMutation';
import Oracle from '../../stores/models/Oracle';


const nowPlus = minutes => moment().add(minutes, 'm').format('YYYY-MM-DDTHH:mm');
const MAX_LEN_RESULT_HEX = 64;
let TIME_GAP_MIN_SEC = 30 * 60;
if (process.env.REACT_APP_ENV === 'dev') {
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
    startTime: nowPlus(15),
    endTime: nowPlus(45),
  },
  resultSetting: {
    startTime: nowPlus(45),
    endTime: nowPlus(75),
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
  averageBlockTime = INIT.averageBlockTime // TODO: maybe move to global store?
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
    const totalQtum = _.sumBy(this.app.wallet.addresses, ({ qtum }) => qtum);
    return totalQtum >= maxTransactionFee;
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
  }

  @action
  open = async () => {
    Tracking.track('dashboard-createEventClick');
    let escrowRes;
    let insightTotalsRes;
    try {
      escrowRes = await axios.post(Routes.api.eventEscrowAmount, {
        senderAddress: this.app.wallet.lastUsedAddress,
      });
      insightTotalsRes = await axios.get(Routes.insight.totals);
    } catch (err) {
      // TODO: HENRY - show an error in a dialog
      console.error('ERROR: ', { // eslint-disable-line
        route: Routes.api.eventEscrowAmount,
        message: err.message,
      });
    }
    runInAction(() => {
      this.prediction.startTime = nowPlus(15);
      this.prediction.endTime = nowPlus(45);
      this.resultSetting.startTime = nowPlus(45);
      this.resultSetting.endTime = nowPlus(75);
      this.escrowAmount = satoshiToDecimal(escrowRes.data.result[0]);
      this.averageBlockTime = insightTotalsRes.data.time_between_blocks;
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
      this.error.title = 'create.required';
    } else if (hexString && hexString.length > MAX_LEN_RESULT_HEX) {
      this.error.title = 'create.nameLong';
    } else {
      this.error.title = '';
    }
  }

  @action
  validateCreator = () => {
    const { app: { wallet }, escrowAmount, creator } = this;
    const checkingAddresses = _.filter(wallet.addresses, { address: creator });
    if (checkingAddresses.length && checkingAddresses[0].bot < escrowAmount) {
      this.error.creator = 'str.notEnoughBot';
    } else if (!creator) {
      this.error.creator = 'create.required';
    } else {
      this.error.creator = '';
    }
  }

  isBeforeNow = (value) => {
    const valueTime = moment(value);
    const now = moment();
    return _.isUndefined(valueTime) || now.unix() > valueTime.unix();
  }

  @action
  validatePredictionStartTime = () => {
    if (this.isBeforeNow(this.prediction.startTime)) {
      this.error.prediction.startTime = 'create.datePast';
    } else {
      this.error.prediction.startTime = '';
    }
  }

  @action
  validatePredictionEndTime = () => {
    const predictionStart = moment(this.prediction.startTime);
    const predictionEnd = moment(this.prediction.endTime);
    if (this.isBeforeNow(this.prediction.endTime)) {
      this.error.prediction.endTime = 'create.datePast';
    } else if (predictionEnd.unix() - predictionStart.unix() < TIME_GAP_MIN_SEC) {
      this.error.prediction.endTime = 'create.validBetEnd';
    } else {
      this.error.prediction.endTime = '';
    }
  }

  @action
  validateResultSettingStartTime = () => {
    const predictionEnd = moment(this.prediction.endTime);
    const resultSettingStart = moment(this.resultSetting.startTime);
    if (this.isBeforeNow(this.resultSetting.startTime)) {
      this.error.resultSetting.startTime = 'create.datePast';
    } else if (predictionEnd.unix() > resultSettingStart.unix()) {
      this.error.resultSetting.startTime = 'create.validResultSetStart';
    } else {
      this.error.resultSetting.startTime = '';
    }
  }

  @action
  validateResultSettingEndTime = () => {
    const resultSettingStart = moment(this.resultSetting.startTime);
    const resultSettingEnd = moment(this.resultSetting.endTime);
    if (this.isBeforeNow(this.resultSetting.endTime)) {
      this.error.resultSetting.endTime = 'create.datePast';
    } else if (resultSettingEnd.unix() - resultSettingStart.unix() < TIME_GAP_MIN_SEC) {
      this.error.resultSetting.endTime = 'create.validResultSetEnd';
    } else {
      this.error.resultSetting.endTime = '';
    }
  }

  @action
  validateOutcome = (i) => {
    const outcome = (this.outcomes[i] || '').toLowerCase();

    // validate not empty
    if (!outcome) {
      this.error.outcomes[i] = 'create.required';
      return;
    }

    // Validate hex length
    const hexString = Web3Utils.toHex(outcome).slice(2); // Remove hex prefix for length validation
    if (hexString.length > MAX_LEN_RESULT_HEX) {
      this.error.outcomes[i] = 'create.resultTooLong';
      return;
    }

    // Validate cannot name Invalid
    if (outcome === 'invalid') {
      this.error.outcomes[i] = 'create.invalidName';
      return;
    }

    // Validate no duplicate outcomes
    const filtered = this.outcomes.filter((item) => (item || '').toLowerCase() === outcome);
    if (filtered.length > 1) {
      this.error.outcomes[i] = 'create.duplicateOutcome';
      return;
    }
    this.error.outcomes[i] = '';
  }

  @action
  validateResultSetter = async () => {
    if (await this.isValidAddress()) {
      this.error.resultSetter = '';
    } else {
      this.error.resultSetter = 'create.required';
    }
  }

  isValidAddress = async () => {
    const { data: { result } } = await axios.post(Routes.api.validateAddress, { address: this.resultSetter });
    return result.isvalid;
  }

  @action
  prepareToCreateEvent = async () => {
    this.validateAll();
    if (!this.isAllValid) return;
    const txInfo = {
      type: TransactionType.APPROVE_CREATE_EVENT,
      token: Token.BOT,
      amount: this.escrowAmount,
      optionIdx: undefined,
      topicAddress: undefined,
      oracleAddress: undefined,
      senderAddress: this.creator,
    };
    const { data: { result } } = await axios.post(Routes.api.transactionCost, txInfo);
    runInAction(() => {
      this.txFees = result;
      this.txConfirmDialogOpen = true;
    });
    // TODO: ANDY - need to do for wallet mobx refactor
    // const { wallet } = this.app;
    // if (wallet.needsToBeUnlocked) {
    //   wallet.unlockDialogOpen = true;
    // } else {
    // }
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
        moment(this.prediction.startTime).utc().unix().toString(),
        moment(this.prediction.endTime).utc().unix().toString(),
        moment(this.resultSetting.startTime).utc().unix().toString(),
        moment(this.resultSetting.endTime).utc().unix().toString(),
        decimalToSatoshi(this.escrowAmount),
        this.creator, // address
      );
      const oracle = { // TODO: we should return this from the backend when making the createTopic api call
        ...data.createTopic,
        optionIdxs: Array.from({ length: this.outcomes.length }, (x, i) => i),
        resultSetStartTime: moment(this.resultSetting.startTime).utc().unix().toString(),
        resultSetEndTime: moment(this.resultSetting.endTime).utc().unix().toString(),
        startTime: moment(this.prediction.startTime).utc().unix().toString(),
        endTime: moment(this.prediction.endTime).utc().unix().toString(),
        options: this.outcomes,
        name: this.title,
        amounts: [],
        token: 'QTUM',
        status: 'CREATED',
        topicAddress: null,
        address: null,
      };
      runInAction(() => {
        this.app.qtumPrediction.list.unshift(new Oracle(oracle, this.app));
        this.txConfirmDialogOpen = false;
        this.txid = oracle.txid;
        this.txSentDialogOpen = true;
      });
    } catch (error) {
      // TODO: HENRY - show an error in a dialog
      console.error('ERROR: ', { // eslint-disable-line
        ...error,
        route: `${Routes.graphql.http}/createTopicTx`,
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
  calculateBlock = (futureDate) => {
    const currentBlock = this.app.global.syncBlockNum;
    const diffSec = moment(futureDate).unix() - moment().unix();
    return Math.round(diffSec / this.averageBlockTime) + currentBlock;
  }
}
