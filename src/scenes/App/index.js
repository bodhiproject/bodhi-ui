import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CssBaseline, withStyles } from 'material-ui';

import styles from './styles';
import AppRouter from './router';
import GlobalHub from './globalHub';
import Loader from './components/Loader/index';
import BottomBar from '../../components/BottomBar/index';
import CreateEvent from '../CreateEvent/index';
import PendingTransactionsSnackbar from '../../components/PendingTransactionsSnackbar/index';
import GlobalSnackbar from '../../components/GlobalSnackbar/index';
import TransactionSentDialog from '../../components/TransactionSentDialog/index';
import WalletUnlockDialog from '../../components/WalletUnlockDialog/index';
import ErrorDialog from '../../components/ErrorDialog/index';
import TxConfirmDialog from '../../components/TxConfirmDialog/index';
import TutorialCarouselDialog from '../../components/TutorialCarouselDialog/index';


@withStyles(styles)
export default class App extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
  }

  render() {
    const { classes, match: { url } } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <GlobalHub />
        <Loader />
        <div className={classes.container}>
          <AppRouter url={url} />
        </div>
        <BottomBar />
        <CreateEvent />
        <PendingTransactionsSnackbar />
        <GlobalSnackbar />
        <TransactionSentDialog />
        <WalletUnlockDialog />
        <ErrorDialog />
        <TxConfirmDialog txDesc="hey" txAmount={10} txToken="QTUM" />
        <TutorialCarouselDialog />
      </div>
    );
  }
}
