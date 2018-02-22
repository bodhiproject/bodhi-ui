import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Layout, LocaleProvider } from 'antd';
import { IntlProvider } from 'react-intl';
import { Debounce } from 'react-throttle';
import { WindowResizeListener } from 'react-window-resize-listener';
import { ThemeProvider } from 'styled-components';
import { ApolloProvider } from 'react-apollo';

import graphClient from '../../network/graphClient';
import authAction from '../../redux/auth/actions';
import appActions from '../../redux/app/actions';
import Topbar from '../Topbar/Topbar';
import CornerClock from '../CornerClock/CornerClock';
import AppRouter from './AppRouter';
import { AppLocale } from '../../index';
import themes from '../../config/themes';
import { themeConfig /* siteConfig */ } from '../../config';
import AppHolder from './commonStyle';
import AppLoad from '../appLoad';
import './global.css';

const { Content } = Layout;
const { logout } = authAction;
const { toggleAll } = appActions;

export class App extends React.PureComponent {
  render() {
    const { url } = this.props.match;
    const currentAppLocale = AppLocale.en;
    return (
      <LocaleProvider locale={currentAppLocale.antd}>
        <IntlProvider locale={currentAppLocale.locale} messages={currentAppLocale.messages}>
          <ThemeProvider theme={themes[themeConfig.theme]}>
            <ApolloProvider client={graphClient}>
              <AppHolder>
                <Layout style={{ height: '100vh' }}>
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
                  <Layout style={{ flexDirection: 'row', overflowX: 'hidden' }}>
                    <Layout
                      className="isoContentMainLayout"
                      style={{
                        height: '100vh',
                      }}
                    >
                      <Content
                        className="isomorphicContent"
                        style={{
                          flexShrink: '0',
                          background: '#f9f9f9',
                        }}
                      >
                        <AppRouter url={url} />
                      </Content>
                    </Layout>
                  </Layout>
                  <CornerClock />
                </Layout>
              </AppHolder>
            </ApolloProvider>
          </ThemeProvider>
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
