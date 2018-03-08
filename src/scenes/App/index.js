import React from 'react';
import PropTypes from 'prop-types';
import Reboot from 'material-ui/Reboot';
import { connect } from 'react-redux';
import { Debounce } from 'react-throttle';
import { WindowResizeListener } from 'react-window-resize-listener';
import { withStyles } from 'material-ui/styles';

import styles from './styles';
import AppRouter from './router';
import GlobalHub from './globalHub';
import Loader from './components/Loader/index';
import appActions from '../../redux/App/actions';
import BottomBar from '../../components/BottomBar/index';
import NavBar from '../../components/NavBar/index';
import TransactionSentDialog from '../../components/TransactionSentDialog/index';

const { toggleAll } = appActions;

export class App extends React.PureComponent {
  render() {
    const { classes, txReturn } = this.props;
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
        <Loader />
        <NavBar langHandler={this.props.langHandler} />
        <div className={classes.container}>
          <AppRouter url={url} />
          <TransactionSentDialog txReturn={txReturn} />
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
  langHandler: PropTypes.func.isRequired,
  txReturn: PropTypes.object,
};

App.defaultProps = {
  txReturn: undefined,
};

const mapStateToProps = (state) => ({
  txReturn: state.Graphql.get('txReturn'),
});

function mapDispatchToProps(dispatch) {
  return {
    toggleAll: () => dispatch(appActions.toggleAll()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(App));
