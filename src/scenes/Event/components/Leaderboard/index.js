import { inject, observer } from 'mobx-react';
import React from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
// import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Table from '@material-ui/core/Table';

import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import MobileStepper from './carousel';
import styles from './styles';
import { satoshiToDecimal } from '../../../../helpers/utility';

const paras = ['QTUM', 'BOT'];
const tabs = ['Who bet the most QTUM', 'Who bet the most BOT', 'Biggest QTUM Winners', 'Biggest BOT Winners'];

@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class Leaderboard extends React.Component {
  state = {
    activeStep: 0,
  };

  handleNext = () => {
    this.setState(prevState => ({
      activeStep: prevState.activeStep + 1,
    }));
  };

  handleBack = () => {
    this.setState(prevState => ({
      activeStep: prevState.activeStep - 1,
    }));
  };

  componentWillUpdate(nextProps, nextState) {
    if (nextState.activeStep !== this.state.activeStep) {
      if (nextState.activeStep < 2) {
        this.props.store.eventPage.queryLeaderboard(paras[nextState.activeStep]);
      } else {
        this.props.store.eventPage.queryLL(paras[nextState.activeStep % 2]);
      }
    }
  }

  render() {
    const { classes, theme, store: { eventPage } } = this.props;
    const maxSteps = 4;
    const { votes } = eventPage;
    const { activeStep } = this.state;
    if (votes.length < 5) {
      for (let i = votes.length; i < 5; i++) {
        votes.push({ voterAddress: 'empty', amount: '0' });
      }
    }
    return (
      <div className={classes.root}>
        <div className={classes.ii}>
          <img src="/images/Leaderboard.svg" alt='s' className={classes.flag} />
          <div className={classes.im}>Leaderboard </div>
        </div>
        <div className={classes.board}>
          <MobileStepper
            steps={maxSteps}
            position="static"
            activeStep={activeStep}
            className={classes.mobileStepper}
            currentValue={tabs[activeStep]}
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
                  <CustomTableHeadCell>Ranking</CustomTableHeadCell>
                  <CustomTableHeadCell>Address</CustomTableHeadCell>
                  <CustomTableHeadCell>Amount</CustomTableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {votes.map((row, index) =>
                  (
                    <CustomTableRow key={index} className={classes.entry}>
                      <CustomTableBodyCell component="th" scope="row">
                        {index <= 2 && <img src={`/images/ic_${index + 1}_cup.svg`} alt='aa' />}
                        {index > 2 && `#${index + 1}`}
                      </CustomTableBodyCell>
                      <CustomTableBodyCell>{row.voterAddress}</CustomTableBodyCell>
                      <CustomTableBodyCell>{satoshiToDecimal(row.amount)}</CustomTableBodyCell>
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
    // borderColor: 'rgba(151, 151, 151, 0.1)',
    height: '48px',
  },
}))(TableRow);

