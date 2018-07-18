import { observable, computed, action, runInAction, reaction } from 'mobx';
import _ from 'lodash';

import axios from '../network/httpRequest';
import { createTopic } from '../network/graphMutation';
import Routes from '../network/routes';
import { decimalToSatoshi } from '../helpers/utility';
import { defaults } from '../config/app';

export default class CreateEventStore {
  @observable title = ''
  @observable createEventDialogVisible = false
  @observable addressValidated = undefined
  @observable averageBlockTime = undefined
  @observable creator = ''
  @observable txSentDialogOpen = false
  @observable lastTransaction = { txid: 'TODO' }

  @computed get creators() {
    return this.app.wallet.addresses; // need to modify to have "(0 QTUM, 0 BOT)" at the ends
  }

  constructor(app) {
    this.app = app;
    this.averageBlockTime = defaults.averageBlockTime;
    this.creator = this.app.wallet.lastUsedAddress;
    reaction(
      () => this.lastTransaction,
      () => {
        if (!_.isUndefined(this.lastTransaction)) {
          this.txSentDialogOpen = true;
        }
      }
    );
  }

  @action
  createTopicTx = async (name, results, centralizedOracle, bettingStartTime, bettingEndTime, resultSettingStartTime, resultSettingEndTime, escrowAmount, senderAddress) => {
    try {
      const tx = await createTopic(
        name,
        results,
        centralizedOracle,
        bettingStartTime,
        bettingEndTime,
        resultSettingStartTime,
        resultSettingEndTime,
        decimalToSatoshi(escrowAmount),
        senderAddress
      );
      this.lastTransaction = tx.data.createTopic;
    } catch (error) {
      runInAction(() => {
        this.app.ui.setError(error.message, `${Routes.graphql.http}/createTopicTx`);
      });
    } finally {
      this.createEventDialogVisible = false;
    }
  }

  @action
  createTopicTxFake = async () => {
    this.lastTransaction = { txid: 'TODO: Replace with real one' };
  }

  @action
  validateAddress = async (currentAddress) => {
    try {
      const { data: { result } } = await axios.post(Routes.api.validateAddress, {
        address: currentAddress,
      });
      this.addressValidated = result.isvalid;
    } catch (error) {
      runInAction(() => {
        this.app.ui.setError(error.message, Routes.api.validateAddress);
      });
    }
  }

  @action
  getInsightTotals = async () => {
    try {
      const { data } = await axios.get(Routes.insight.totals);
      this.averageBlockTime = data.time_between_blocks;
    } catch (error) {
      console.error(error.message); // eslint-disable-line
    }
  }

  // For SelectAddressDialog
  @observable isSelectAddressDialogVisible = false;

  @action
  setSelectAddressDialogVisibility = (visibility) => {
    this.isSelectAddressDialogVisible = visibility;
  }
}
