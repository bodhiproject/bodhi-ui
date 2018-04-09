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

const language = (navigator.languages && navigator.languages[0]) ||
                     navigator.language ||
                     navigator.userLanguage;
let browserLang = 'mandarin';
if (language.includes('en')) {
  browserLang = 'english';
}

export default class AppProvider extends Component {
  locales = { english: AppLocale.en, mandarin: AppLocale.zh }
  state = {
    locale: localStorage.getItem('language') || browserLang,
  }

  componentDidMount() {
    moment.locale(this.locales[this.state.locale].momentlocale);
  }

  langHandler = () => {
    const locale = this.state.locale === 'english' ? 'mandarin' : 'english';
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
