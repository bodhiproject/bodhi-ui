import { inject, observer } from 'mobx-react';
import React from 'react';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { withStyles, Paper, Button, Typography, Grid } from '@material-ui/core';
import { Routes } from 'constants';
import { Card, SeeAllButton } from 'components';
import MobileStepper from './carousel';
import styles from './styles';
import { satoshiToDecimal, toFixed, shortenText } from '../../../helpers/utility';
import InfiniteScroll from '../../../components/InfiniteScroll';

const messages = defineMessages({
  mostNBOT: {
    id: 'leaderboard.mostNBOT',
    defaultMessage: 'Who bet the most NBOT',
  },
  biggestWinner: {
    id: 'leaderboard.biggestWinners',
    defaultMessage: 'Biggest Winners',
  },
  returnRatio: {
    id: 'leaderboard.returnRatio',
    defaultMessage: 'Return Ratio',
  },
  strYou: {
    id: 'str.you',
    defaultMessage: 'You',
  },
});

@withStyles(styles, { withTheme: true })
@injectIntl
@inject('store')
@observer
export default class Leaderboard extends React.Component {
  handleNext = () => {
    const { leaderboard } = this.props.store;
    leaderboard.activeStep += 1;
  };

  handleBack = () => {
    const { leaderboard } = this.props.store;
    leaderboard.activeStep -= 1;
  };

  renderHeader = () => {
    const { classes } = this.props;
    return (
      <Grid container className={classes.grid} justify="flex-start">
        <Grid item xs={1}>
          <FormattedMessage id="leaderboard.ranking" defaultMessage="Ranking" />
        </Grid>
        <Grid item xs={8}>
          <FormattedMessage id="leaderboard.address" defaultMessage="Address" />
        </Grid>
        <Grid item xs={3}>
          <FormattedMessage id="leaderboard.amount" defaultMessage="Amount" />
        </Grid>
      </Grid>
    );
  }

  renderEntry = (row, index) => {
    const { classes, intl, store: { naka: { account }, leaderboard: { activeStep }, ui: { location } } } = this.props;
    const { userAddress, investments, winnings, returnRatio } = row;
    if (!userAddress) return;
    let amount;
    if (activeStep === 0) amount = toFixed(satoshiToDecimal(investments), true);
    else if (location === Routes.LEADERBOARD) amount = `${(returnRatio * 100).toFixed(2)}%`;
    else amount = toFixed(satoshiToDecimal(winnings), true);
    const ranking = (index <= 2 && <img src={`/images/ic_${index + 1}_cup.svg`} alt='cup' />)
      || (index === 3 && '👍') || (index >= 4 && '✊');

    const address = (account && account.toLowerCase() === userAddress && intl.formatMessage(messages.strYou)) || shortenText(userAddress, 6);
    return (
      <Grid container className={classes.grid} key={index} alignItems='center'>
        <Grid item xs={1}>
          {ranking}
        </Grid>
        <Grid item xs={8}>
          <Typography>
            {address}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography>
            {amount}
          </Typography>
        </Grid>
      </Grid>
    );
  }

  getLeaderboardTitle = (intl, location, activeStep) => {
    if (activeStep === 0) return intl.formatMessage(messages.mostNBOT);
    else if (location === Routes.LEADERBOARD) return intl.formatMessage(messages.returnRatio);
    return intl.formatMessage(messages.biggestWinner);
  }

  getLeaderboardLoadMore = (location, activeStep) => {
    const { store: { leaderboard: { loadMoreLeaderboardBets, loadMoreLeaderboardBiggestWinners, loadMoreLeaderboardReturnRatio } } } = this.props;
    if (activeStep === 0) return loadMoreLeaderboardBets;
    else if (location === Routes.LEADERBOARD) return loadMoreLeaderboardReturnRatio;
    return loadMoreLeaderboardBiggestWinners;
  }

  render() {
    const { classes, theme, intl, maxSteps, store: { eventPage: { event }, ui: { location },
      leaderboard: { leaderboardDisplay, activeStep, loadingMore, leaderboardLimit, diaplayHasMore } } } = this.props;
    const url = event ? `/event_leaderboard/${event.address}` : undefined;
    const leaderboardTitle = this.getLeaderboardTitle(intl, location, activeStep);
    const leaderboardLoadMore = this.getLeaderboardLoadMore(location, activeStep);
    const displays = leaderboardDisplay.map((row, index) => this.renderEntry(row, index));
    return (
      <Card>
        <div className={classes.root}>
          <div className={classes.leaderboardTitle}>
            <img src="/images/Leaderboard.svg" alt='leaderboard' className={classes.flag} />
            <div className={classes.leaderboardText}><FormattedMessage id='leaderboard.title' defaultMessage='Leaderboard' /> </div>
          </div>
          <div className={classes.board}>
            <MobileStepper
              steps={maxSteps}
              position="static"
              activeStep={activeStep}
              className={classes.mobileStepper}
              currentValue={leaderboardTitle}
              nextButton={
                <Button size="small" onClick={this.handleNext} disabled={activeStep === maxSteps - 1}>
                  {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                </Button>
              }
              backButton={
                <Button size="small" onClick={this.handleBack} disabled={activeStep === 0}>
                  {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                </Button>
              }
            />
            <Paper className={classes.outWrapper}>
              {this.renderHeader()}
              <InfiniteScroll
                spacing={0}
                data={displays}
                loadMore={leaderboardLoadMore}
                loadingMore={loadingMore}
                noEmptyPlaceholder
              />
            </Paper>
          </div>
        </div>
        {url && location === Routes.EVENT && displays.length === leaderboardLimit && diaplayHasMore && <SeeAllButton url={url} />}
      </Card>
    );
  }
}
