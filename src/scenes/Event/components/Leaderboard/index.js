import { inject, observer } from 'mobx-react';
import React from 'react';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { Table, TableBody, TableCell, TableHead, TableRow, withStyles, Paper, Button } from '@material-ui/core';
import { Routes } from 'constants';
import MobileStepper from './carousel';
import styles from './styles';
import { satoshiToDecimal } from '../../../../helpers/utility';

const messages = defineMessages({
  mostNAKA: {
    id: 'leaderboard.mostNAKA',
    defaultMessage: 'Who bet the most NAKA',
  },
  mostNBOT: {
    id: 'leaderboard.mostNBOT',
    defaultMessage: 'Who bet the most NBOT',
  },
  biggestWinner: {
    id: 'leaderboard.biggestWinners',
    defaultMessage: 'Biggest Winners',
  },
});

const tabs = [messages.mostNAKA, messages.mostNBOT, messages.biggestWinner];

@withStyles(styles, { withTheme: true })
@injectIntl
@inject('store')
@observer
export default class Leaderboard extends React.Component {
  handleNext = () => {
    const { ui: { location } } = this.props.store;
    if (location === Routes.LEADERBOARD) {
      const { leaderboard } = this.props.store;
      leaderboard.activeStep += 1;
    } else {
      const { eventPage } = this.props.store;
      eventPage.activeStep += 1;
    }
  };

  handleBack = () => {
    const { ui: { location } } = this.props.store;
    if (location === Routes.LEADERBOARD) {
      const { leaderboard } = this.props.store;
      leaderboard.activeStep -= 1;
    } else {
      const { eventPage } = this.props.store;
      eventPage.activeStep -= 1;
    }
  };

  render() {
    const { classes, theme, intl, maxSteps } = this.props;
    let leaderboardBets = [];
    let activeStep = 0;
    let leaderboardLimit = 5;
    if (this.props.store.ui.location === Routes.LEADERBOARD) {
      ({ leaderboardBets, activeStep, leaderboardLimit } = this.props.store.leaderboard);
    } else {
      ({ leaderboardBets, activeStep, leaderboardLimit } = this.props.store.eventPage);
    }
    if (leaderboardBets.length < leaderboardLimit) {
      for (let i = leaderboardBets.length; i < leaderboardLimit; i++) {
        leaderboardBets.push({ betterAddress: '', amount: '' });
      }
    }
    return (
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
            <Table className={classes.table}>
              <TableHead className={classes.tableHead}>
                <TableRow>
                  <CustomTableHeadCell><FormattedMessage id='leaderboard.ranking' defaultMessage='Ranking' /></CustomTableHeadCell>
                  <CustomTableHeadCell><FormattedMessage id='leaderboard.address' defaultMessage='Address' /></CustomTableHeadCell>
                  <CustomTableHeadCell><FormattedMessage id='leaderboard.amount' defaultMessage='Amount' /></CustomTableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaderboardBets.map((row, index) =>
                  (
                    <CustomTableRow key={index} className={classes.entry}>
                      <CustomTableBodyCell component="th" scope="row">
                        {index <= 2 && <img src={`/images/ic_${index + 1}_cup.svg`} alt='cup' />}
                        {index > 2 && `#${index + 1}`}
                      </CustomTableBodyCell>
                      <CustomTableBodyCell>{row.betterAddress}</CustomTableBodyCell>
                      <CustomTableBodyCell>{satoshiToDecimal(row.amount)} {row.amount ? 'NBOT' : ''}</CustomTableBodyCell>
                    </CustomTableRow>
                  ))}
              </TableBody>
            </Table>
          </Paper>
        </div>
      </div>
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
