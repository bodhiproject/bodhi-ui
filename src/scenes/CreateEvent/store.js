import { observable, computed, reaction, action, runInAction } from 'mobx';
import _ from 'lodash';
import axios from 'axios';
import moment from 'moment';

import { satoshiToDecimal } from '../../helpers/utility';
import Tracking from '../../helpers/mixpanelUtil';
import Routes from '../../network/routes';
import { maxTransactionFee } from '../../config/app';


const INIT = {
  isOpen: false,
  escrowAmount: null, // type: number
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
  outcomes: [],
  resultSetter: '',
};

export default class CreateEventStore {
  escrowAmount = ''
  averageBlockTime = '' // TODO: maybe move to global store?
  @observable txConfirmDialogOpen = false
  @observable txSentDialogOpen = false
  // form fields
  @observable isOpen = INIT.open
  @observable title = INIT.title
  @observable creator = INIT.creator // address
  prediction = observable(INIT.prediction)
  resultSetting = observable(INIT.resultSetting)
  @observable outcomes = INIT.outcomes
  @observable resultSetter = INIT.resultSetter // address
  @computed get creatorAddresses() {
    return this.app.wallet.addresses;
  }
  @computed get hasEnoughQtum() {
    const totalQtum = _.sumBy(this.props.walletAddresses, ({ qtum }) => qtum);
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

  // if one of these is set, the form field will display the
  // associated error message
  error = observable({
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
    outcomes: '',
    resultSetter: '',
  })

  constructor(app) {
    this.app = app;
    reaction(
      () => this.creator,
      () => {
        if (this.creator) {
          this.app.wallet.lastUsedAddress = this.creator;
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
      // TODO: show an error in a dialog
      console.error('ERROR: ', {
        route: Routes.api.eventEscrowAmount,
        message: err.message,
      });
    }
    runInAction(() => {
      this.escrowAmount = satoshiToDecimal(escrowRes.data.result[0]);
      this.averageBlockTime = insightTotalsRes.data.time_between_blocks;
      this.isOpen = true;
    });
  }

  validateTitle = () => {
    if (!this.title) {
      this.error.title = 'create.required';
    } else {
      this.error.title = '';
    }
  }

  validateCreator = () => {
    const { creatorAddresses, escrowAmount, creator } = this;
    const checkingAddresses = _.filter(creatorAddresses, { address: creator });
    if (checkingAddresses.length && checkingAddresses[0].bot < escrowAmount) {
      this.error.creator = 'str.notEnoughBot';
    } else if (!creator) {
      this.error.creator = 'create.required';
    } else {
      this.error.creator = '';
    }
  }

  isAfterNow = (value) => {
    const valueTime = moment(value);
    const now = moment();

    return _.isUndefined(valueTime) || now.unix() > valueTime.unix();
    // if (_.isUndefined(valueTime) || now.unix() > valueTime.unix()) {
    //   // return 'create.datePast';
    // }
    // return '';
  }

  validatePredictionStartTime = () => {
    if (this.isAfterNow(this.prediction.starTime)) {
      this.error.prediction.startTime = 'create.datePast';
    } else {
      this.error.prediction.startTime = '';
    }
  }

  validatePredictionEndTime = () => {
    if (this.isAfterNow(this.prediction.endTime)) {
      this.error.prediction.endTime = 'create.datePast';
    } else {
      this.error.prediction.endTime = '';
    }
  }

  validateResultSettingStartTime = () => {
    if (this.isAfterNow(this.resultSetting.starTime)) {
      this.error.resultSetting.starTime = 'create.datePast';
    } else {
      this.error.resultSetting.starTime = '';
    }
  }

  validateResultSettingEndTime = () => {
    if (this.isAfterNow(this.resultSetting.endTime)) {
      this.error.resultSetting.endTime = 'create.datePast';
    } else {
      this.error.resultSetting.endTime = '';
    }
  }

  validateOutcomes = () => {
  }

  validateResultSetter = () => {
  }

  prepareToCreateEvent = () => {}

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
    const diffSec = futureDate.unix() - moment().unix();
    return Math.round(diffSec / this.averageBlockTime) + currentBlock;
  }
}
