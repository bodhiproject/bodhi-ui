import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo';
import { ConnectedRouter } from 'react-router-redux';
import { IntlProvider } from 'react-intl';
import { LocaleProvider } from 'antd';
import { MuiThemeProvider } from 'material-ui/styles';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import moment from 'moment';
import App from './scenes/App/index';
import AppLocale from './languageProvider';
import bodhiTheme from './config/theme';
import graphClient from './network/graphClient';
import { store, history } from './redux/store';

import '../src/style/styles.less';

export default class AppProvider extends Component {
  locales = [AppLocale.en, AppLocale.zh]
  state = {
    locale: Number(localStorage.getItem('localindex')) || 0,
  }

  componentDidMount() {
    moment.locale(this.locales[this.state.locale].momentlocale);
  }

  langHandler = () => {
    const nextlocale = (this.state.locale + 1) % 2;
    this.setState({
      locale: nextlocale,
    });
    moment.locale(this.locales[nextlocale].momentlocale);
    localStorage.setItem('localindex', nextlocale);
  }

  render() {
    return (
      <MuiThemeProvider theme={bodhiTheme}>
        <LocaleProvider locale={this.locales[this.state.locale].antd}>
          <IntlProvider locale={this.locales[this.state.locale].locale} messages={this.locales[this.state.locale].messages}>
            <ApolloProvider client={graphClient}>
              <Provider store={store}>
                <ConnectedRouter history={history}>
                  <Route
                    path="/"
                    render={(props) => (<App match={props.match} langHandler={this.langHandler} />)}
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
