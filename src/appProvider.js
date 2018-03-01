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

const defaultidx = localStorage.getItem('localindex') || 0;
const locales = [AppLocale.en, AppLocale.zh];
class AppProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = { locale: defaultidx };
    this.handler = this.handler.bind(this);
  }

  handler() {
    this.setState({
      locale: (this.state.locale + 1) % 2,
    });
    localStorage.setItem('localindex', (this.state.locale + 1) % 2);
  }

  render() {
    return (
      <MuiThemeProvider theme={bodhiTheme}>
        <LocaleProvider locale={locales[this.state.locale].antd}>
          <IntlProvider locale={locales[this.state.locale].locale} messages={locales[this.state.locale].messages}>
            <ApolloProvider client={graphClient}>
              <Provider store={store}>
                <ConnectedRouter history={history}>
                  <Route
                    path="/"
                    render={(props) => (<App match={props.match} handler={this.handler} />)}
                  />
                </ConnectedRouter>
              </Provider>
            </ApolloProvider>
          </IntlProvider>
        </LocaleProvider>
      </MuiThemeProvider>
    );
  }
}

export default AppProvider;
