import React, { Fragment } from 'react';

import { CssBaseline, withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

import styles from './styles';
import AppRouter from './router';
import GlobalHub from './globalHub';
import BottomBar from '../../components/BottomBar/index';
import CreateEvent from '../CreateEvent/index';
import PendingTransactionsSnackbar from '../../components/PendingTransactionsSnackbar/index';
import GlobalSnackbar from '../../components/GlobalSnackbar/index';
import TransactionSentDialog from '../../components/TransactionSentDialog/index';
import WalletUnlockDialog from '../../components/WalletUnlockDialog/index';
import ErrorDialog from '../../components/ErrorDialog/index';
import TxConfirmDialog from '../../components/TxConfirmDialog/index';
import TutorialCarouselDialog from '../../components/TutorialCarouselDialog/index';
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
