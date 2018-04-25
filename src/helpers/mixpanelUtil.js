import Mixpanel from 'mixpanel';
import _ from 'lodash';

import AppConfig from '../config/app';

let mixpanel;

export default class Tracking {
  static track(eventName) {
    if (_.isEmpty(eventName)) {
      console.error('Mixpanel eventName cannot be empty');
      return;
    }

    if (!mixpanel) {
      mixpanel = Mixpanel.init(AppConfig.analytics.mixpanelToken);
    }
    mixpanel.track(eventName);
  }

  static appStart() {
    this.track('AppStart');
  }
}
