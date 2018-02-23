import React from 'react';
import ReactDOM from 'react-dom';

import App from './containers/App/App';
import AppProvider from './appProvider';
import { unregister } from './registerServiceWorker';

ReactDOM.render(
  <AppProvider />,
  document.getElementById('root')
);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./appProvider.js', () => {
    const NextAppProvider = AppProvider.default;
    ReactDOM.render(<NextAppProvider />, document.getElementById('root'));
  });
}

// Unregister the service worker since we don't want to cache.
// Necessary for existing users who previously have registered a service worker.
unregister();
