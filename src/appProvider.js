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

const defaultLocale = (navigator.language || navigator.userLanguage).startsWith('en') ? 'en-US' : 'zh-Hans-CN';

export default class AppProvider extends Component {
  locales = { [AppLocale.en.locale]: AppLocale.en, [AppLocale.zh.locale]: AppLocale.zh }
  state = {
    locale: localStorage.getItem('language') || defaultLocale,
  }

  componentDidMount() {
    moment.locale(this.locales[this.state.locale].momentlocale);
  }

  langHandler = () => {
    const { en, zh } = AppLocale;
    const locale = this.state.locale === en.locale ? zh.locale : en.locale;
    this.setState({ locale });
    moment.locale(this.locales[locale].momentlocale);
    localStorage.setItem('language', locale);
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
                  render={(props) => (<App match={props.match} langHandler={this.langHandler} />)}
                />
              </ConnectedRouter>
            </Provider>
          </ApolloProvider>
        </IntlProvider>
      </MuiThemeProvider>
    );
  }
}
