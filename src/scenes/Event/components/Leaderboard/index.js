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

const paras = ['QTUM', 'BOT'];
const tabs = ['Who bet the most QTUM', 'Who bet the most BOT'];
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
      this.props.store.eventPage.queryLeaderboard(paras[nextState.activeStep]);
    }
  }

  render() {
    const { classes, theme, store: { eventPage } } = this.props;
    const maxSteps = 2;
    const { activeStep } = this.state;

    return (
      <div className={classes.root}>
        {/* <Paper square elevation={0} className={classes.header}>
          <Typography>{tutorialSteps[activeStep].label}</Typography>
        </Paper> */}
        {console.log(classes.im)}
        <div className={classes.ii}>
          <img src="/images/Leaderboard.svg" alt='s' />
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
              <TableHead>
                <TableRow>
                  <TableCell>Ranking</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {eventPage.votes.map((row, index) =>
                  (
                    <TableRow key={row.voterAddress}>
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell>{row.voterAddress}</TableCell>
                      <TableCell>{row.amount}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Paper>
        </div>
      </div>
    );
  }
}
