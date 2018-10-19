import { inject, observer } from 'mobx-react';
import React from 'react';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import { EventType } from 'constants';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { Table, TableBody, TableCell, TableHead, TableRow, withStyles, Paper, Button } from '@material-ui/core';
import MobileStepper from './carousel';
import styles from './styles';
import { satoshiToDecimal } from '../../../../helpers/utility';

const messages = defineMessages({
  mostQTUM: {
    id: 'leaderboard.mostQTUM',
    defaultMessage: 'Who bet the most QTUM',
  },
  mostBOT: {
    id: 'leaderboard.mostBOT',
    defaultMessage: 'Who bet the most BOT',
  },
  biggestWinner: {
    id: 'leaderboard.biggestWinners',
    defaultMessage: 'Biggest Winners',
  },
});

const { TOPIC } = EventType;
const tabs = [messages.mostQTUM, messages.mostBOT, messages.biggestWinner];

@withStyles(styles, { withTheme: true })
@injectIntl
@inject('store')
@observer
export default class Leaderboard extends React.Component {
  handleNext = () => {
    this.props.store.eventPage.activeStep = this.props.store.eventPage.activeStep + 1;
  };

  handleBack = () => {
    this.props.store.eventPage.activeStep = this.props.store.eventPage.activeStep - 1;
  };

  render() {
    const { classes, theme, store: { eventPage }, intl } = this.props;
    const { votes, type, activeStep } = eventPage;
    let maxSteps = 2;
    if (type === TOPIC) {
      maxSteps = 3;
    }
    if (votes.length < 5) {
      for (let i = votes.length; i < 5; i++) {
        votes.push({ voterAddress: '', amount: '' });
      }
    }
    return (
      <div className={classes.root}>
        <div className={classes.ii}>
          <img src="/images/Leaderboard.svg" alt='image not available' className={classes.flag} />
          <div className={classes.im}><FormattedMessage id='leaderboard.title' defaultMessage='Leaderboard' /> </div>
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
          <Paper className={classes.sds}>
            <Table className={classes.table}>
              <TableHead className={classes.tableHead}>
                <TableRow>
                  <CustomTableHeadCell><FormattedMessage id='leaderboard.ranking' defaultMessage='Ranking' /></CustomTableHeadCell>
                  <CustomTableHeadCell><FormattedMessage id='leaderboard.address' defaultMessage='Address' /></CustomTableHeadCell>
                  <CustomTableHeadCell><FormattedMessage id='leaderboard.amount' defaultMessage='Amount' /></CustomTableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {votes.map((row, index) =>
                  (
                    <CustomTableRow key={index} className={classes.entry}>
                      <CustomTableBodyCell component="th" scope="row">
                        {index <= 2 && <img src={`/images/ic_${index + 1}_cup.svg`} alt='image not available' />}
                        {index > 2 && `#${index + 1}`}
                      </CustomTableBodyCell>
                      <CustomTableBodyCell>{row.voterAddress}</CustomTableBodyCell>
                      {!row.amount.qtum && <CustomTableBodyCell>{satoshiToDecimal(row.amount)}</CustomTableBodyCell>}
                      {row.amount.qtum && <CustomTableBodyCell>{satoshiToDecimal(row.amount.qtum)} QTUM,{satoshiToDecimal(row.amount.bot)} BOT</CustomTableBodyCell>}
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
    fontSize: 14,
  },
}))(TableCell);

const CustomTableBodyCell = withStyles(() => ({
  root: {
    borderColor: 'rgba(151, 151, 151, 0.1)',
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const CustomTableRow = withStyles(() => ({
  head: {
    border: '1px solid blue',
    height: '48px',
  },
}))(TableRow);
