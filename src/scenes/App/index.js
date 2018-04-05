import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Debounce } from 'react-throttle';
import { WindowResizeListener } from 'react-window-resize-listener';
import { CssBaseline, withStyles } from 'material-ui';

import styles from './styles';
import AppRouter from './router';
import GlobalHub from './globalHub';
import Loader from './components/Loader/index';
import appActions from '../../redux/App/actions';
import BottomBar from '../../components/BottomBar/index';
import CreateEvent from '../CreateEvent/index';
import PendingTransactionsSnackbar from '../../components/PendingTransactionsSnackbar/index';
import GlobalSnackbar from '../../components/GlobalSnackbar/index';
import TransactionSentDialog from '../../components/TransactionSentDialog/index';
import WalletUnlockDialog from '../../components/WalletUnlockDialog/index';
import ErrorDialog from '../../components/ErrorDialog/index';


export class App extends React.PureComponent {
  render() {
    const {
      classes,
      txReturn,
    } = this.props;
    const { url } = this.props.match;

    return (
      <div className={classes.root}>
        <CssBaseline />
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
        <div className={classes.container}>
          <AppRouter url={url} langHandler={this.props.langHandler} />
        </div>
        <BottomBar />
        <CreateEvent />
        <PendingTransactionsSnackbar />
        <GlobalSnackbar />
        <TransactionSentDialog txReturn={txReturn} />
        <WalletUnlockDialog />
        <ErrorDialog />
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
