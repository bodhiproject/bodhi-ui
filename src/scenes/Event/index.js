import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { isEmpty } from 'lodash';
import cx from 'classnames';
import moment from 'moment';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import { Typography, Button, Grid, Paper, withStyles } from '@material-ui/core';
import {
  Loading,
  BackButton,
  PageContainer,
  ContentContainer,
  EventWarning,
  ImportantNote,
  Card,
} from 'components';
import { EVENT_STATUS } from 'constants';
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
    defaultMessage: 'Loading Event...',
  },
  consensusThreshold: {
    id: 'oracle.consensusThreshold',
    defaultMessage: 'Consensus Threshold',
  },
  remainingConsensusThreshold: {
    id: 'oracle.remainingConsensusThreshold',
    defaultMessage: 'Remaining Consensus Threshold',
  },
  setResultExplanation: {
    id: 'oracle.setResultExplanation',
    defaultMessage: 'Setting the result requires staking the Consensus Threshold amount.',
  },
  setRemainingExplanation: {
    id: 'oracle.setRemainingExplanation',
    defaultMessage: 'You can only stake up to the remaining Consensus Threshold amount.',
  },
  creating: { id: 'card.creating', defaultMessage: 'Creating' },
  predictionComingSoon: { id: 'card.predictionComingSoon', defaultMessage: 'Prediction Coming Soon' },
  predictionInProgress: { id: 'card.predictionInProgress', defaultMessage: 'Prediction In Progress' },
  resultSettingComingSoon: { id: 'card.resultSettingComingSoon', defaultMessage: 'Result Setting Coming Soon' },
  resultSettingInProgress: { id: 'card.resultSettingInProgress', defaultMessage: 'Result Setting In Progress' },
  arbitrationInProgress: { id: 'card.arbitrationInProgress', defaultMessage: 'Arbitration In Progress' },
  finished: { id: 'card.finished', defaultMessage: 'Finished' },
});

@injectIntl
@withStyles(styles, { withTheme: true })
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

  getEventDesc = () => {
    const { status } = this.props.store.eventPage.event;
    switch (status) {
      case EVENT_STATUS.CREATED: return 'creating';
      case EVENT_STATUS.BETTING: return moment.unix().isBefore(moment.unix(this.betStartTime)) ? 'predictionComingSoon' : 'predictionInProgress';
      case EVENT_STATUS.ORACLE_RESULT_SETTING: return moment.unix().isBefore(moment.unix(this.resultSetEndTime)) ? 'resultSettingComingSoon' : 'resultSettingInProgress';
      case EVENT_STATUS.OPEN_RESULT_SETTING: return 'resultSettingInProgress';
      case EVENT_STATUS.ARBITRATION: return 'arbitrationInProgress';
      case EVENT_STATUS.WITHDRAWING: return 'finished';
      default: throw Error(`Invalid status: ${this.status}`);
    }
  }

  renderTitle = () => {
    const {
      classes,
      store: { eventPage },
    } = this.props;
    return (
      <Typography variant="h4" className={cx(classes.title, classes.padLeft)}>
        {eventPage.eventName}
      </Typography>
    );
  }

  renderEventWarning = () => {
    const {
      classes,
      store: {
        eventPage: { eventWarningMessageId, amount, warningType },
      },
    } = this.props;

    return (
      <div className={classes.padLeft}>
        <div className={classes.stateText}><FormattedMessageFixed id={messages[this.getEventDesc()].id} defaultMessage={messages[this.getEventDesc()].defaultMessage} /></div>
        <EventWarning
          id={eventWarningMessageId}
          amount={String(amount)}
          type={warningType}
        />
      </div>
    );
  }

  renderOptions = () => {
    const { classes, store: { eventPage: { isWithdrawing, isResultSetting, event: { results, status } } } } = this.props;
    return (
      <Grid className={classes.optionGrid}>
        {results.map((option, i) => (
          (status !== EVENT_STATUS.BETTING || (status === EVENT_STATUS.BETTING && i !== 0)) &&
          <Option
            key={i}
            option={option}
            disabled={isWithdrawing}
            amountInputDisabled={isResultSetting}
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

  renderRemainingConsensusThresholdMessage = () => {
    const { intl, store: { eventPage: { selectedOption, isArbitration, remainingConsensusThreshold } } } = this.props;
    const heading = `${intl.formatMessage(messages.remainingConsensusThreshold)} ${remainingConsensusThreshold} NBOT`;
    const message = intl.formatMessage(messages.setRemainingExplanation);
    if (isArbitration && !isEmpty(selectedOption)) {
      return <ImportantNote heading={heading} message={message} />;
    }
  }

  renderActionButton = () => {
    const {
      classes,
      store: {
        eventPage,
        eventPage: { event, buttonDisabled, selectedOptionIdx },
      },
    } = this.props;

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
      selectedOptionIdx !== -1 && <Button
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
  renderActiveEventContent = () => {
    const {
      classes,
    } = this.props;
    return (
      <Card>
        {this.renderTitle()}
        {this.renderEventWarning()}
        {this.renderOptions()}
        {this.renderConsensusThresholdMessage()}
        {this.renderRemainingConsensusThresholdMessage()}
        {this.renderActionButton()}
      </Card>
    );
  }

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
      classes,
    } = this.props;

    if (loading || !event) {
      return <Loading text={messages.loadOracleMsg} event='true' />;
    }

    return (
      <Fragment>
        <BackButton />
        <PageContainer classes={{ root: classes.pageRoot }}>
          <ContentContainer>
            {!eventPage.isWithdrawing
              ? this.renderActiveEventContent()
              : this.renderWithdrawContent()}
            <Leaderboard maxSteps={eventPage.maxLeaderBoardSteps} />
            <HistoryTable />
          </ContentContainer>
          <Sidebar endTime={event.getEndTime()} />
        </PageContainer>
      </Fragment>
    );
  }
}

const FormattedMessageFixed = (props) => <FormattedMessage {...props} />;
