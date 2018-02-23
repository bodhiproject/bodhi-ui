import React from 'react';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';

import App from './containers/App/App';
import { store, history } from './redux/store';

import '../src/style/styles.less';

const Router = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Route
        path="/"
        component={App}
      />
    </ConnectedRouter>
  </Provider>
);

export default Router;
