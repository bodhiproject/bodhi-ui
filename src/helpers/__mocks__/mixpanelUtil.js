import _ from 'lodash';

let initialized = false;

export default class Tracking {
  static track(eventName) {
    if (_.isEmpty(eventName)) {
      console.error('Mixpanel eventName cannot be empty'); // eslint-disable-line
      return;
    }

    // Instantiate if not instantiated yet
    if (!initialized) {
      initialized = true;
    }
  }
}
