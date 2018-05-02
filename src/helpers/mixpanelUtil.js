import mixpanel from 'mixpanel-browser/src/loader-module';
import _ from 'lodash';

const MIXPANEL_TOKEN = '5c13e6b02fc222c0adae2f1f8cd923b0';

let initialized = false;

export default class Tracking {
  static track(eventName) {
    if (_.isEmpty(eventName)) {
      console.error('Mixpanel eventName cannot be empty'); // eslint-disable-line
      return;
    }

    // Instantiate if not instantiated yet
    if (!initialized) {
      mixpanel.init(MIXPANEL_TOKEN);
      initialized = true;
    }

    // Only track in production build
    if (process.env && process.env.NODE_ENV === 'production') {
      mixpanel.track(eventName, { id: getTrackingId() });
    }
  }
}

function getTrackingId() {
  const { OS_HOSTNAME, OS_USERNAME, OS_PLATFORM, OS_ARCH } = process.env;
  return `${OS_HOSTNAME}.${OS_USERNAME}.${OS_PLATFORM}.${OS_ARCH}`;
}
