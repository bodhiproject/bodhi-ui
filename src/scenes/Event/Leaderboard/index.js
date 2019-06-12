import { inject, observer } from 'mobx-react';
import React from 'react';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { Table, TableBody, TableCell, TableHead, TableRow, withStyles, Paper, Button, Typography } from '@material-ui/core';
import { Routes } from 'constants';
import { Card } from 'components';
import MobileStepper from './carousel';
import styles from './styles';
import { satoshiToDecimal, toFixed } from '../../../helpers/utility';

const messages = defineMessages({
  mostNBOT: {
    id: 'leaderboard.mostNBOT',
    defaultMessage: 'Who bet the most NBOT',
  },
  biggestWinner: {
    id: 'leaderboard.biggestWinners',
    defaultMessage: 'Biggest Winners',
  },
});

const tabs = [messages.mostNBOT, messages.biggestWinner];

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
    const { classes, theme, intl, maxSteps, store: { eventPage: { event }, ui: { location }, leaderboard: { leaderboardBets, activeStep, leaderboardLimit } } } = this.props;
    const url = event ? `/event_leaderboard/${event.address}` : undefined;

    if (leaderboardBets.length < leaderboardLimit) {
      for (let i = leaderboardBets.length; i < leaderboardLimit; i++) {
        leaderboardBets.push({ voterAddress: '', amount: '' });
      }
    }
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
              <Table className={classes.table}>
                <colgroup>
                  <col width="10%" />
                  <col width="70%" />
                  <col width="20%" />
                </colgroup>
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
                          {index === 3 && '👍'}
                          {index >= 4 && '✊'}
                        </CustomTableBodyCell>
                        <CustomTableBodyCell>{row.betterAddress}</CustomTableBodyCell>
                        <CustomTableBodyCell>{toFixed(satoshiToDecimal(row.amount), true)}</CustomTableBodyCell>
                      </CustomTableRow>
                    ))}
                </TableBody>
              </Table>
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
