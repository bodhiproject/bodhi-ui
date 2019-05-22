import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import { Typography, Button, Grid, Paper, withStyles } from '@material-ui/core';
import {
  Loading,
  BackButton,
  PageContainer,
  ContentContainer,
  EventWarning,
  ImportantNote,
} from 'components';
import styles from './styles';
import Option from './Option';
import WinningOutcome from './WinningOutcome';
import Reward from './Reward';
import WithdrawTo from './WithdrawTo';
import ResultTotals from './ResultTotals';
import Leaderboard from './Leaderboard';
import HistoryTable from './HistoryTable';
import { Sidebar } from './Sidebar';

const messages = defineMessages({
  loadOracleMsg: {
    id: 'load.oracle',
    defaultMessage: 'Loading Oracle...',
  },
  consensusThreshold: {
    id: 'oracle.consensusThreshold',
    defaultMessage: 'Consensus Threshold',
  },
  setResultExplanation: {
    id: 'oracle.setResultExplanation',
    defaultMessage: 'Setting the result requires staking the Consensus Threshold amount.',
  },
});

@injectIntl
@withStyles(styles)
@withRouter
@inject('store')
@observer
export default class EventPage extends Component {
  componentDidMount() {
    const { params } = this.props.match;
    this.props.store.eventPage.init({ ...params });
  }

  componentWillUnmount() {
    this.props.store.eventPage.reset();
  }

  renderTitle = () => {
    const {
      classes,
      store: { eventPage },
    } = this.props;
    return (
      <Typography variant="h4" className={classes.title}>
        {eventPage.eventName}
      </Typography>
    );
  }

  renderEventWarning = () => {
    const {
      store: {
        eventPage: { eventWarningMessageId, amount, warningType },
      },
    } = this.props;

    return (
      <EventWarning
        id={eventWarningMessageId}
        amount={String(amount)}
        type={warningType}
      />
    );
  }

  renderOptions = () => {
    const { classes, store: { eventPage } } = this.props;
    return (
      <Grid className={classes.optionGrid}>
        {eventPage.event.results.map((option, i) => (
          <Option
            key={i}
            option={option}
            disabled={eventPage.isWithdrawing}
            amountInputDisabled={eventPage.isResultSetting}
          />
        ))}
      </Grid>
    );
  }

  renderConsensusThresholdMessage = () => {
    const { intl, store: { eventPage } } = this.props;
    const threshold = eventPage.event.consensusThreshold;
    const heading = `${intl.formatMessage(messages.consensusThreshold)} ${threshold} NBOT`;
    const message = intl.formatMessage(messages.setResultExplanation);

    return (eventPage.isResultSetting || eventPage.isArbitration) && (
      <ImportantNote heading={heading} message={message} />
    );
  }

  renderActionButton = () => {
    const {
      classes,
      store: {
        eventPage,
        eventPage: { event, buttonDisabled },
      },
    } = this.props;

    if (eventPage.isWithdrawing) return null;

    let msg;
    let onClick;
    if (eventPage.isBetting) {
      onClick = eventPage.bet;
      msg = <FormattedMessage id="bottomButtonText.placeBet" defaultMessage="Place Bet" />;
    } else if (eventPage.isResultSetting) {
      onClick = eventPage.set;
      msg = <FormattedMessage id="str.setResult" defaultMessage="Set Result" />;
    } else if (eventPage.isArbitration) {
      onClick = eventPage.vote;
      msg = <FormattedMessage id="str.vote" defaultMessage="Vote" />;
    } else {
      return null;
    }

    return (
      <Button
        fullWidth
        size="large"
        variant="contained"
        className={classes.actionButton}
        onClick={onClick}
        disabled={event.isPending() || buttonDisabled}
      >
        {msg}
      </Button>
    );
  }

  // Renders sections for bet, set, vote statuses
  renderActiveEventContent = () => (
    <Fragment>
      {this.renderEventWarning()}
      {this.renderOptions()}
      {this.renderConsensusThresholdMessage()}
      {this.renderActionButton()}
    </Fragment>
  )

  // Renders sections for withdraw status
  renderWithdrawContent = () => {
    const {
      classes,
      store: {
        eventPage,
        eventPage: { event, nbotWinnings },
        wallet: { currentWalletAddress },
      },
    } = this.props;
    const allowWithdraw = Boolean(nbotWinnings)
      || event.ownerAddress === currentWalletAddress;

    return (
      <Fragment>
        <Paper className={classes.withdrawingPaper}>
          <WinningOutcome eventPage={eventPage} />
          {allowWithdraw && (
            <Fragment>
              <Reward event={event} eventPage={eventPage} />
              <WithdrawTo />
            </Fragment>
          )}
        </Paper>
        <ResultTotals eventPage={eventPage} />
      </Fragment>
    );
  }

  render() {
    const {
      store: {
        eventPage,
        eventPage: { event, loading },
      },
    } = this.props;

    if (loading || !event) {
      return <Loading text={messages.loadOracleMsg} event='true' />;
    }

    return (
      <Fragment>
        <BackButton />
        <PageContainer>
          <ContentContainer>
            {this.renderTitle()}
            {!eventPage.isWithdrawing
              ? this.renderActiveEventContent()
              : this.renderWithdrawContent()}
            <Leaderboard maxSteps={eventPage.maxLeaderBoardSteps} />
            {/* <HistoryTable /> */}
          </ContentContainer>
          <Sidebar endTime={event.betEndTime} />
        </PageContainer>
      </Fragment>
    );
  }
}
