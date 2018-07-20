import { observable, computed, reaction, action, runInAction } from 'mobx';
import _ from 'lodash';
import axios from 'axios';

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
  @computed get creators() {
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
      () => this.title,
      () => { // validate title

      }
    );
  }

  @action
  open = async () => {
    Tracking.track('dashboard-createEventClick');
    let res;
    try {
      res = await axios.post(Routes.api.eventEscrowAmount, {
        senderAddress: this.app.wallet.lastUsedAddress,
      });
    } catch (err) {
      // TODO: show an error in a dialog
      console.error('ERROR: ', {
        route: Routes.api.eventEscrowAmount,
        message: err.message,
      });
    }
    runInAction(() => {
      const { data: { result } } = res;
      this.escrowAmount = satoshiToDecimal(result[0]);
      this.isOpen = true;
    });
  }

  validate = () => { }

  prepareToCreateEvent = () => {}

  close = () => Object.assign(this, INIT)
}
