import Mixpanel from 'mixpanel';
import _ from 'lodash';

const MIXPANEL_TOKEN = '5c13e6b02fc222c0adae2f1f8cd923b0';

let mixpanel;

export default class Tracking {
  static track(eventName) {
    if (_.isEmpty(eventName)) {
      console.error('Mixpanel eventName cannot be empty');
      return;
    }

    // Instantiate if not instantiated yet
    if (!mixpanel) {
      mixpanel = Mixpanel.init(MIXPANEL_TOKEN);
    }

    // Only track in production build
    if (process.env && process.env.NODE_ENV === 'production') {
      mixpanel.track(eventName);
    }
  }
}
