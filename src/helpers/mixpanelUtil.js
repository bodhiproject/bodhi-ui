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

    // Instantiate if not instantiated yet
    if (!mixpanel) {
      mixpanel = Mixpanel.init(AppConfig.analytics.mixpanelToken);
    }

    // Only track in production build
    if (process.env && process.env.NODE_ENV === 'production') {
      mixpanel.track(eventName);
    }
  }

  static appStart() {
    this.track('AppStart');
  }
}
