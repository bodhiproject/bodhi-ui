import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { CssBaseline, withStyles } from '@material-ui/core';
import {
  BottomBar,
  GlobalDialog,
  GlobalSnackbar,
  InstallNakaWalletPopover,
  TutorialCarouselDialog,
  NoWalletPrompt,
} from 'components';
import { Routes } from 'constants';
import { Helmet } from 'react-helmet';

import styles from './styles';
import AppRouter from './router';

const App = observer(({ classes, match: { url }, store, store: { ui } }) => (
  <div className={classes.root}>
    {!store.loading && (
      <Fragment>
        <div className={classes.container}>
          <AppRouter url={url} />
        </div>
        <BottomBar />
        <Helmet>
          <title>Bodhi Prediction Market</title>
        </Helmet>
        {ui.location === Routes.PREDICTION && <TutorialCarouselDialog />}
        <GlobalSnackbar />
        <GlobalDialog />
        <InstallNakaWalletPopover />
        <NoWalletPrompt />
      </Fragment>
    )}
    <CssBaseline />
  </div>
));

export default withStyles(styles)(inject('store')(App));
