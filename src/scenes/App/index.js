import React, { PropTypes } from 'react';
import Reboot from 'material-ui/Reboot';
import { connect } from 'react-redux';
import { Debounce } from 'react-throttle';
import { WindowResizeListener } from 'react-window-resize-listener';
import { withStyles } from 'material-ui/styles';

import AppRouter from './router';
import AppLoad from './load';
import appActions from '../../redux/app/actions';
import BottomBar from '../../components/BottomBar/index';
import styles from './styles';
import TopBar from '../../components/TopBar/index';

const { toggleAll } = appActions;

export class App extends React.PureComponent {
  render() {
    const { classes } = this.props;
    const { url } = this.props.match;
    return (
      <div className={classes.root}>
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
        <TopBar url={url} />
        <div className={classes.container}>
          <AppRouter url={url} />
        </div>
        <BottomBar />
      </div>
    );
  }
}

App.propTypes = {
  toggleAll: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default connect((state) => ({ auth: state.Auth }), { toggleAll })(withStyles(styles)(App));
