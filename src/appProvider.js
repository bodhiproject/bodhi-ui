import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { IntlProvider } from 'react-intl';
import { MuiThemeProvider } from '@material-ui/core';
import { Route, BrowserRouter } from 'react-router-dom';
import { Provider as MobxProvider, observer } from 'mobx-react';
import { ThemeProvider } from 'styled-components';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';

import App from './scenes/App';
import bodhiTheme, { theme as styledTheme } from './config/theme';
import graphClient from './network/graphClient';
import '../src/style/styles.less';


/**
 * xstore === mobx store
 */
export const AppProvider = observer(({ xstore }) => (
  <ThemeProvider theme={styledTheme}>
    <MobxProvider store={xstore}>
      <MuiThemeProvider theme={bodhiTheme}>
        <IntlProvider locale={xstore.ui.locale} messages={xstore.ui.localeMessages}>
          <ApolloProvider client={graphClient}>
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
  </ThemeProvider>
));
