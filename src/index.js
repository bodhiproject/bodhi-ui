import React from 'react';
import ReactDOM from 'react-dom';

import App from './containers/App/App';
import Router from './router';
import { unregister } from './registerServiceWorker';

ReactDOM.render(
  <Router />,
  document.getElementById('root')
);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./router.js', () => {
    const Next = Router.default;
    ReactDOM.render(<Next />, document.getElementById('root'));
  });
}

// Unregister the service worker since we don't want to cache.
// Necessary for existing users who previously have registered a service worker.
unregister();
