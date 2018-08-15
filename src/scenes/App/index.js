import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { CssBaseline, withStyles } from '@material-ui/core';

import styles from './styles';
import AppRouter from './router';
import BottomBar from '../../components/BottomBar';
import CreateEventFormDialog from '../CreateEvent';
import PendingTxsSnackbar from '../../components/PendingTxsSnackbar';
import GlobalSnackbar from '../../components/GlobalSnackbar';
import WalletUnlockDialog from '../../components/WalletUnlockDialog';
import ErrorDialog from '../../components/ErrorDialog';
import TutorialCarouselDialog from '../../components/TutorialCarouselDialog';
import Loader from './components/Loader';


const App = observer(({ classes, match: { url }, store }) => (
  <div className={classes.root}>
    <Loader />
    {!store.loading && (
      <Fragment>
        <div className={classes.container}>
          <AppRouter url={url} />
        </div>
        <BottomBar />
        <CreateEventFormDialog />
        <PendingTxsSnackbar />
        <GlobalSnackbar />
        <WalletUnlockDialog />
        <ErrorDialog />
        <TutorialCarouselDialog />
      </Fragment>
    )}
    <CssBaseline />
  </div>
));

export default withStyles(styles)(inject('store')(App));
