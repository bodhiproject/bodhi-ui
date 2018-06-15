import React from 'react';
import { render } from 'react-dom';
import moment from 'moment';
import momentDurationFormat from 'moment-duration-format';
import { AppProvider } from './appProvider';
import { unregister } from './registerServiceWorker';
import { store } from './redux/store';
import xstore from './stores/AppStore';

momentDurationFormat(moment);

render(
  <AppProvider store={store} xstore={xstore} />,
  document.getElementById('root')
);

// Hot Module Replacement API
if (module.hot) {
  console.log('hot reloading...'); // eslint-disable-line
}

// Unregister the service worker since we don't want to cache.
// Necessary for existing users who previously have registered a service worker.
unregister();
