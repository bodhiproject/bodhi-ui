import React from 'react';
import { render } from 'react-dom';
import moment from 'moment';
import momentDurationFormat from 'moment-duration-format';
import AppProvider from './appProvider';
import { unregister } from './registerServiceWorker'

momentDurationFormat(moment);

render(
  <AppProvider />,
  document.getElementById('root')
);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./appProvider.js', () => {
    const NextAppProvider = AppProvider.default;
    render(
      <NextAppProvider />,
      document.getElementById('root')
    );
  });
}

// Unregister the service worker since we don't want to cache.
// Necessary for existing users who previously have registered a service worker.
unregister();
