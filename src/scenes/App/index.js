import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CssBaseline, withStyles } from 'material-ui';

import styles from './styles';
import AppRouter from './router';
import GlobalHub from './globalHub';
import TermsAndConditions from './components/TermsAndConditions/index';
import Loader from './components/Loader/index';
import BottomBar from '../../components/BottomBar/index';
import CreateEvent from '../CreateEvent/index';
import PendingTransactionsSnackbar from '../../components/PendingTransactionsSnackbar/index';
import GlobalSnackbar from '../../components/GlobalSnackbar/index';
import TransactionSentDialog from '../../components/TransactionSentDialog/index';
import WalletUnlockDialog from '../../components/WalletUnlockDialog/index';
import ErrorDialog from '../../components/ErrorDialog/index';


@withStyles(styles)
export default class App extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    langHandler: PropTypes.func.isRequired,
    txReturn: PropTypes.object,
  }

  static defaultProps = {
    txReturn: undefined,
  }

  render() {
    const { classes, txReturn, match: { url } } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <GlobalHub />
        <Loader />
        <TermsAndConditions />
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

