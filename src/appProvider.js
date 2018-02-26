import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { ConnectedRouter } from 'react-router-redux';
import { IntlProvider } from 'react-intl';
import { LocaleProvider } from 'antd';
import { MuiThemeProvider } from 'material-ui/styles';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';

import App from './scenes/App/index';
import AppLocale from './languageProvider';
import bodhiTheme from './config/theme';
import graphClient from './network/graphClient';
import { store, history } from './redux/store';

import '../src/style/styles.less';

const currentAppLocale = AppLocale.en;

const AppProvider = () => (
  <MuiThemeProvider theme={bodhiTheme}>
    <LocaleProvider locale={currentAppLocale.antd}>
      <IntlProvider locale={currentAppLocale.locale} messages={currentAppLocale.messages}>
        <ApolloProvider client={graphClient}>
          <Provider store={store}>
            <ConnectedRouter history={history}>
              <Route
                path="/"
                component={App}
              />
            </ConnectedRouter>
          </Provider>
        </ApolloProvider>
      </IntlProvider>
    </LocaleProvider>
  </MuiThemeProvider>
);

export default AppProvider;
