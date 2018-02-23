import React from 'react';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { LocaleProvider } from 'antd';
import { IntlProvider } from 'react-intl';
import { ApolloProvider } from 'react-apollo';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import App from './containers/App/App';
import AppLocale from './languageProvider';
import graphClient from './network/graphClient';
import { store, history } from './redux/store';

import '../src/style/styles.less';

const currentAppLocale = AppLocale.en;
const theme = createMuiTheme();

const AppProvider = () => (
  <MuiThemeProvider theme={theme}>
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
