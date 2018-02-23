import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Debounce } from 'react-throttle';
import { WindowResizeListener } from 'react-window-resize-listener';
import Reboot from 'material-ui/Reboot';

import authAction from '../../redux/auth/actions';
import appActions from '../../redux/app/actions';
import Topbar from '../Topbar/Topbar';
import CornerClock from '../CornerClock/CornerClock';
import AppRouter from './AppRouter';
import AppLoad from '../appLoad';

const { logout } = authAction;
const { toggleAll } = appActions;

export class App extends React.PureComponent {
  render() {
    const { url } = this.props.match;

    return (
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
