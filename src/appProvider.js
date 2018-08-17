import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { IntlProvider } from 'react-intl';
import { MuiThemeProvider } from '@material-ui/core';
import { Provider } from 'react-redux';
import { Route, BrowserRouter } from 'react-router-dom';
import { Provider as MobxProvider, observer } from 'mobx-react';
import { ThemeProvider } from 'styled-components';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';

import App from './scenes/App';
import bodhiTheme, { theme as styledTheme } from './config/theme';
import graphqlClient from './network/graphql';
import '../src/style/styles.less';


/**
 * store === redux store
 * xstore === mobx store
 */
export const AppProvider = observer(({ xstore, store }) => (
  <ThemeProvider theme={styledTheme}>
    <Provider store={store}>
      <MobxProvider store={xstore}>
        <MuiThemeProvider theme={bodhiTheme}>
          <IntlProvider locale={xstore.ui.locale} messages={xstore.ui.localeMessages}>
            <ApolloProvider client={graphqlClient}>
              <BrowserRouter>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <Route
                    path="/"
                    render={(props) => <App match={props.match} />}
                  />
                </MuiPickersUtilsProvider>
              </BrowserRouter>
            </ApolloProvider>
          </IntlProvider>
        </MuiThemeProvider>
      </MobxProvider>
    </Provider>
  </ThemeProvider>
));
