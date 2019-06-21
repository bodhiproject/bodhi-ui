import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { CssBaseline, withStyles } from '@material-ui/core';
import { injectIntl, defineMessages } from 'react-intl';
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

const messages = defineMessages({
  bodhiPredictionMarket: {
    id: 'str.bodhiPredictionMarket',
    defaultMessage: 'Bodhi Prediction Market',
  },
});

const App = injectIntl(observer(({ classes, intl, match: { url }, store, store: { ui } }) => (
  <div className={classes.root}>
    {!store.loading && (
      <Fragment>
        <div className={classes.container}>
          <AppRouter url={url} />
        </div>
        <BottomBar />
        {
          // eslint-disable-next-line
          <audio style={{ visibility: 'hidden' }} src="/music/bgm.mp3" />
        }
        <Helmet>
          <title>{intl.formatMessage(messages.bodhiPredictionMarket)}</title>
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
)));

export default withStyles(styles)(inject('store')(App));
