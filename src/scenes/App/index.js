import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { CssBaseline, withStyles } from '@material-ui/core';
import { BottomBar, ErrorDialog, ExecuteTxDialog, GlobalSnackbar, PendingTxsSnackbar, TutorialCarouselDialog, WalletUnlockDialog } from 'components';

import styles from './styles';
import AppRouter from './router';
import CreateEventFormDialog from '../CreateEvent';


const App = observer(({ classes, match: { url }, store }) => (
  <div className={classes.root}>
    {!store.loading && (
      <Fragment>
        <div className={classes.container}>
          <AppRouter url={url} />
        </div>
        <BottomBar />
        <PendingTxsSnackbar />
        <GlobalSnackbar />
        <CreateEventFormDialog />
        <ExecuteTxDialog />
        <WalletUnlockDialog />
        <ErrorDialog />
        <TutorialCarouselDialog />
      </Fragment>
    )}
    <CssBaseline />
  </div>
));

export default withStyles(styles)(inject('store')(App));
