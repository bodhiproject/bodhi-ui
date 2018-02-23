import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { LocaleProvider } from 'antd';
import { IntlProvider } from 'react-intl';
import { Debounce } from 'react-throttle';
import { WindowResizeListener } from 'react-window-resize-listener';
import { ApolloProvider } from 'react-apollo';
import Reboot from 'material-ui/Reboot';

import graphClient from '../../network/graphClient';
import authAction from '../../redux/auth/actions';
import appActions from '../../redux/app/actions';
import Topbar from '../Topbar/Topbar';
import CornerClock from '../CornerClock/CornerClock';
import AppRouter from './AppRouter';
import AppLocale from '../../languageProvider';
import AppLoad from '../appLoad';

const { logout } = authAction;
const { toggleAll } = appActions;
const currentAppLocale = AppLocale.en;

export class App extends React.PureComponent {
  render() {
    const { url } = this.props.match;

    return (
      <LocaleProvider locale={currentAppLocale.antd}>
        <IntlProvider locale={currentAppLocale.locale} messages={currentAppLocale.messages}>
          <ApolloProvider client={graphClient}>
            <div className="root">
              <Reboot />
              <Debounce time="1000" handler="onResize">
                <WindowResizeListener
                  onResize={(windowSize) =>
                    this.props.toggleAll(
                      windowSize.windowWidth,
                      windowSize.windowHeight
                    )}
                />
              </Debounce>
              <AppLoad />
              <Topbar url={url} />
              <div className="container">
                <AppRouter url={url} />
              </div>
              <CornerClock />
            </div>
          </ApolloProvider>
        </IntlProvider>
      </LocaleProvider>
    );
  }
}

App.propTypes = {
  toggleAll: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

export default connect(
  (state) => ({
    auth: state.Auth,
  }),
  { logout, toggleAll }
)(App);
