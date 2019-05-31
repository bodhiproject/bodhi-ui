import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { CssBaseline, withStyles } from '@material-ui/core';
import {
  BottomBar,
  GlobalDialog,
  GlobalSnackbar,
  InstallNakaWalletPopover,
  TxSentDialog,
  TutorialCarouselDialog,
} from 'components';

import styles from './styles';
import AppRouter from './router';

const App = observer(({ classes, match: { url }, store }) => (
  <div className={classes.root}>
    {!store.loading && (
      <Fragment>
        <div className={classes.container}>
          <AppRouter url={url} />
        </div>
        <BottomBar />

        <TutorialCarouselDialog />
        <GlobalSnackbar />
        <GlobalDialog />
        <TxSentDialog />
        <InstallNakaWalletPopover />
      </Fragment>
    )}
    <CssBaseline />
  </div>
));

export default withStyles(styles)(inject('store')(App));
