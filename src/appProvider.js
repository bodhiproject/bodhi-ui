import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { IntlProvider } from 'react-intl';
import { MuiThemeProvider } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { Route, Router } from 'react-router-dom';
import { Provider as MobxProvider, observer } from 'mobx-react';
import { ThemeProvider } from 'styled-components';
import createBrowserHistory from 'history/createBrowserHistory';
import { syncHistoryWithStore } from 'mobx-react-router';
import App from './scenes/App';
import bodhiTheme, { theme as styledTheme } from './config/theme';
import { isProduction } from './config/app';
import graphqlClient from './network/graphql';
import createStore from './stores/AppStore';
import '../src/style/styles.less';

// Init MobX Store with GraphQL client
const store = createStore(graphqlClient);
if (!isProduction()) window.store = store; // Add store to window for debugging

// Sync history with store's router
const browserHistory = createBrowserHistory();
const history = syncHistoryWithStore(browserHistory, store.router);

export const AppProvider = observer(() => (
  <ThemeProvider theme={styledTheme}>
    <MobxProvider store={store}>
      <MuiThemeProvider theme={bodhiTheme}>
        <IntlProvider locale={store.ui.locale} messages={store.ui.localeMessages}>
          <ApolloProvider client={graphqlClient}>
            <Router history={history}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <Route
                  path="/"
                  render={(props) => <App match={props.match} />}
                />
              </MuiPickersUtilsProvider>
            </Router>
          </ApolloProvider>
        </IntlProvider>
      </MuiThemeProvider>
    </MobxProvider>
  </ThemeProvider>
));
