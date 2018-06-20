import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { CssBaseline, withStyles } from '@material-ui/core';

import styles from './styles';
import AppRouter from './router';
import GlobalHub from './globalHub';
import BottomBar from '../../components/BottomBar';
import CreateEvent from '../CreateEvent';
import PendingTransactionsSnackbar from '../../components/PendingTransactionsSnackbar';
import GlobalSnackbar from '../../components/GlobalSnackbar';
import TransactionSentDialog from '../../components/TransactionSentDialog';
import WalletUnlockDialog from '../../components/WalletUnlockDialog';
import ErrorDialog from '../../components/ErrorDialog';
import TxConfirmDialog from '../../components/TxConfirmDialog';
import TutorialCarouselDialog from '../../components/TutorialCarouselDialog';
import Loader from './components/Loader';


const App = observer(({ classes, match: { url }, store }) => (
  <div className={classes.root}>
    <GlobalHub />
    <Loader />
    {!store.loading && (
      <Fragment>
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
      </Fragment>
    )}
    <CssBaseline />
  </div>
));

export default withStyles(styles)(inject('store')(App));
