import { inject, observer } from 'mobx-react';
import React from 'react';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { Table, TableBody, TableCell, TableHead, TableRow, withStyles, Paper, Button, Typography, Grid } from '@material-ui/core';
import { Routes } from 'constants';
import { Card } from 'components';
import MobileStepper from './carousel';
import styles from './styles';
import { satoshiToDecimal, toFixed } from '../../../helpers/utility';
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
  strYou: {
    id: 'str.you',
    defaultMessage: 'You',
  },
});
const tabs = [messages.mostNBOT, messages.biggestWinner];

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
        <Grid item xs={2} sm={2}>
          <FormattedMessage id="leaderboard.ranking" defaultMessage="Ranking" />
        </Grid>
        <Grid item xs={8} sm={8}>
          <FormattedMessage id="leaderboard.address" defaultMessage="Address" />
        </Grid>
        <Grid item xs={2} sm={2}>
          <FormattedMessage id="leaderboard.amount" defaultMessage="Amount" />
        </Grid>
      </Grid>
    );
  }

  renderEntry = (row, index) => {
    const { classes, intl, store: { naka: { account } } } = this.props;
    const { betterAddress, amount } = row;
    if (!betterAddress) return;
    const ranking = (index <= 2 && <img src={`/images/ic_${index + 1}_cup.svg`} alt='cup' />)
                    || (index === 3 && '👍') || (index >= 4 && '✊');

    const address = (account && account.toLowerCase() === betterAddress && intl.formatMessage(messages.strYou)) || `${betterAddress.slice(0, 6)}...${betterAddress.slice(-6)}`;
    return (
      <Grid container className={classes.grid} key={index} alignItems='center'>
        <Grid item xs={2} sm={2}>
          {ranking}
        </Grid>
        <Grid item xs={8} sm={8}>
          <Typography>
            {address}
          </Typography>
        </Grid>
        <Grid item xs={2} sm={2}>
          <Typography>
            {toFixed(satoshiToDecimal(row.amount), true)}
          </Typography>
        </Grid>
      </Grid>
    );
  }

  render() {
    const { classes, theme, intl, maxSteps, store: { eventPage: { event }, ui: { location }, leaderboard: { leaderboardDisplay, activeStep, leaderboardLimit, loadingMore } } } = this.props;
    const url = event ? `/event_leaderboard/${event.address}` : undefined;

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
              currentValue={intl.formatMessage(tabs[activeStep])}
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
                loadMore={() => {}}
                loadingMore={loadingMore}
                noEmptyPlaceholder
              />
            </Paper>
          </div>
        </div>
        {url && location === Routes.EVENT && <Link to={url}>
          <div className={classes.bottomButton}>
            <Typography color='textPrimary' className={classes.bottomButtonText}>
              <FormattedMessage id="str.seeAll" defaultMessage="See All " />
              <KeyboardArrowRight className={classes.bottomButtonIcon} />
            </Typography>
          </div>
        </Link>}
      </Card>
    );
  }
}

const CustomTableHeadCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.white,
    borderBottom: '1px solid rgba(151, 151, 151, 0.1)',
  },
  body: {
    fontSize: theme.sizes.font.xSmall,
  },
}))(TableCell);

const CustomTableBodyCell = withStyles(theme => ({
  root: {
    borderColor: 'rgba(151, 151, 151, 0.1)',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    maxWidth: '1px',
  },
  body: {
    fontSize: theme.sizes.font.xSmall,
  },
}))(TableCell);

const CustomTableRow = withStyles(() => ({
  head: {
    border: '1px solid blue',
    height: '48px',
  },
}))(TableRow);
