import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo';
import { ConnectedRouter } from 'react-router-redux';
import { IntlProvider } from 'react-intl';
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
  defaultLang = (navigator.language || navigator.userLanguage)
  enLang = this.defaultLang.startsWith('en') ? 'en-US' : '';
  zhLang = this.defaultLang.startsWith('zh') ? 'zh-Hans-CN' : '';
  koLang = this.defaultLang.startsWith('ko') ? 'ko-KR' : '';
  defaultLocale = this.enLang || this.zhLang || this.koLang;
  locales = { [AppLocale.en.locale]: AppLocale.en, [AppLocale.zh.locale]: AppLocale.zh, [AppLocale.kr.locale]: AppLocale.kr }
  state = {
    locale: localStorage.getItem('lang') || this.defaultLocale,
  }

  componentDidMount() {
    moment.locale(this.locales[this.state.locale].momentlocale);
  }

  toggleLanguage = (value) => {
    this.setState({ locale: value });
    moment.locale(this.locales[value].momentlocale);
    localStorage.setItem('lang', value);
  }

  render() {
    return (
      <MuiThemeProvider theme={bodhiTheme}>
        <IntlProvider locale={this.locales[this.state.locale].locale} messages={this.locales[this.state.locale].messages}>
          <ApolloProvider client={graphClient}>
            <Provider store={store}>
              <ConnectedRouter history={history}>
                <Route
                  path="/"
                  render={(props) => (<App match={props.match} langHandler={this.toggleLanguage} lang={this.state.locale} />)}
                />
              </ConnectedRouter>
            </Provider>
          </ApolloProvider>
        </IntlProvider>
      </MuiThemeProvider>
    );
  }
}
