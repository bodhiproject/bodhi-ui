import React, { PropTypes } from 'react';
import Reboot from 'material-ui/Reboot';
import { connect } from 'react-redux';
import { Debounce } from 'react-throttle';
import { WindowResizeListener } from 'react-window-resize-listener';
import { withStyles } from 'material-ui/styles';

import styles from './styles';
import AppRouter from './router';
import AppLoad from './load';
import GlobalHub from './globalHub';
import appActions from '../../redux/App/actions';
import BottomBar from '../../components/BottomBar/index';
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
        <GlobalHub />
        <AppLoad />
        <TopBar url={url} handler={this.props.handler} />
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
  handler: PropTypes.func.isRequired,
};

export default connect((state) => ({ auth: state.Auth }), { toggleAll })(withStyles(styles)(App));
