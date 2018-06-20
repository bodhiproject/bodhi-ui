import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { IntlProvider } from 'react-intl';
import { MuiThemeProvider } from '@material-ui/core';
import { Provider } from 'react-redux';
import { Route, BrowserRouter } from 'react-router-dom';
import { Provider as MobxProvider, observer } from 'mobx-react';

import App from './scenes/App';
import bodhiTheme from './config/theme';
import graphClient from './network/graphClient';
import '../src/style/styles.less';


/**
 * store === redux store
 * xstore === mobx store
 */
export const AppProvider = observer(({ xstore, store }) => (
  <Provider store={store}>
    <MobxProvider store={xstore}>
      <MuiThemeProvider theme={bodhiTheme}>
        <IntlProvider locale={xstore.ui.locale} messages={xstore.ui.localeMessages}>
          <ApolloProvider client={graphClient}>
            <BrowserRouter>
              <Route
                path="/"
                render={(props) => <App match={props.match} />}
              />
            </BrowserRouter>
          </ApolloProvider>
        </IntlProvider>
      </MuiThemeProvider>
    </MobxProvider>
  </Provider>
));
