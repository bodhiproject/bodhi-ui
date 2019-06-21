import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { isEmpty } from 'lodash';
import cx from 'classnames';
import { Helmet } from 'react-helmet';
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
import { EVENT_STATUS, Routes } from 'constants';
import { getEventDesc } from '../../helpers/utility';
import styles from './styles';
import Option from './Option';
import WinningOutcome from './WinningOutcome';
import WithdrawTo from './WithdrawTo';
import Leaderboard from './Leaderboard';
import HistoryTable from './HistoryTable';
import { Sidebar } from './Sidebar';

const messages = defineMessages({
  loadOracleMsg: {
    id: 'load.oracle',
    defaultMessage: 'Loading Event...',
  },
  currentConsensusThreshold: {
    id: 'oracle.currentConsensusThreshold',
    defaultMessage: 'Current Consensus Threshold',
  },
  previousConsensusThreshold: {
    id: 'oracle.previousConsensusThreshold',
    defaultMessage: 'Previous Consensus Threshold',
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
  bodhiPrediction: {
    id: 'str.bodhiPrediction',
    defaultMessage: 'Bodhi Prediction',
  },
  creating: { id: 'card.creating', defaultMessage: 'Creating' },
  predictionComingSoon: { id: 'card.predictionComingSoon', defaultMessage: 'Prediction Coming Soon' },
  predictionInProgress: { id: 'card.predictionInProgress', defaultMessage: 'Prediction In Progress' },
  resultSettingComingSoon: { id: 'card.resultSettingComingSoon', defaultMessage: 'Result Setting Coming Soon' },
  resultSettingInProgress: { id: 'card.resultSettingInProgress', defaultMessage: 'Result Setting In Progress' },
  arbitrationInProgress: { id: 'card.arbitrationInProgress', defaultMessage: 'Arbitration In Progress' },
  arbitrationComingSoon: { id: 'card.arbitrationComingSoon', defaultMessage: 'Arbitration Coming Soon' },
  finished: { id: 'card.finished', defaultMessage: 'Finished' },
});

@injectIntl
@withStyles(styles, { withTheme: true })
@withRouter
@inject('store')
@observer
export default class EventPage extends Component {
  async componentDidMount() {
    const { params } = this.props.match;
    this.props.store.ui.location = Routes.EVENT;
    await this.props.store.eventPage.init({ ...params });
    this.props.store.history.init();
    this.props.store.leaderboard.init();
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
      <Typography variant="h4" className={cx(classes.title, classes.padLeft)}>
        {eventPage.eventName}
      </Typography>
    );
  }

  renderEventWarning = () => {
    const {
      classes,
      store: {
        eventPage: { eventWarningMessageId, amount, warningType, event },
        wallet: { currentAddress },
      },
    } = this.props;

    return (
      <div className={classes.padLeft}>
        <div className={classes.stateText}><FormattedMessageFixed id={messages[getEventDesc(event, currentAddress)].id} defaultMessage={messages[getEventDesc(event, currentAddress)].defaultMessage} /></div>
        <EventWarning
          id={eventWarningMessageId}
          amount={String(amount)}
          type={warningType}
        />
      </div>
    );
  }

  renderOptions = (actionText, betSpecific) => {
    const { classes, store: { wallet: { currentAddress }, eventPage: { isWithdrawing, isResultSetting, event, event: { results, status, betResults } } } } = this.props;
    let asOptions = results;
    asOptions = asOptions.slice(1).concat(asOptions[0]);
    if (betSpecific) {
      asOptions = betResults;
      asOptions = asOptions.slice(1);
    }
    return (
      <Grid className={classes.optionGrid}>
        {
          betSpecific ?
            <div className={cx(classes.stateText, classes.padLeft)}><FormattedMessage id='string.betEnded' defaultMessage='Event bet Ended' /></div>
            :
            <div className={cx(classes.stateText, classes.padLeft)}><FormattedMessageFixed id={messages[getEventDesc(event, currentAddress)].id} defaultMessage={messages[getEventDesc(event, currentAddress)].defaultMessage} /></div>
        }
        {asOptions.map((option, i) => (
          (status !== EVENT_STATUS.BETTING || ([EVENT_STATUS.PRE_BETTING, EVENT_STATUS.BETTING].includes(status) && i !== asOptions.length - 1)) &&
          <Option
            key={i}
            option={option}
            disabled={isWithdrawing}
            amountInputDisabled={isResultSetting}
            actionText={actionText}
            betSpecific={betSpecific}
          />
        ))}
      </Grid>
    );
  }

  renderConsensusThresholdMessage = () => {
    const { intl, store: { eventPage } } = this.props;
    const { consensusThreshold } = eventPage.event;
    const heading = `${intl.formatMessage(messages.currentConsensusThreshold)} ${consensusThreshold} NBOT`;
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

  renderBetContent = () => {
    const {
      store: {
        eventPage: { event, selectedOptionIdx },
      },
    } = this.props;

    return (
      ((event.currentRound > 0 && selectedOptionIdx === -1) || (event.status === EVENT_STATUS.WITHDRAWING)) && <Fragment>
        {this.renderOptions('bet', true)}
      </Fragment>
    );
  }

  // Renders sections for bet, set, vote statuses
  renderActiveEventContent = () => {
    const {
      store: {
        eventPage: { event },
      },
    } = this.props;
    return (
      <Card>
        {this.renderTitle()}
        {this.renderBetContent()}
        {/* {this.renderEventWarning()} */}
        {this.renderOptions(event.currentRound > 0 ? 'vote' : 'bet')}
        {this.renderConsensusThresholdMessage()}
        {this.renderRemainingConsensusThresholdMessage()}
        {this.renderActionButton()}
      </Card>
    );
  }

  renderMetaData = () => {
    const {
      intl,
      store: { eventPage, eventPage: { event: { betResults } } },
    } = this.props;
    let str = '';
    for (let i = 1; i < betResults.length; i++) {
      if (betResults[i].percent) {
        str = `${str}${betResults[i].percent}% ${betResults[i].name}, `;
      }
    }
    if (str !== '') str = str.slice(0, -2);
    return (
      <Helmet>
        <title>{`${eventPage.eventName}${str === '' ? '' : `|${intl.formatMessage(messages.bodhiPrediction)}: ${str}`}`}</title>
      </Helmet>);
  }


  // Renders sections for withdraw status
  renderWithdrawContent = () => {
    const {
      classes,
      store: {
        eventPage,
        eventPage: { event, nbotWinnings },
        wallet: { currentAddress },
      },
    } = this.props;
    const allowWithdraw = Boolean(nbotWinnings)
    || event.ownerAddress === currentAddress;

    return (
      <Card>
        {this.renderTitle()}
        {this.renderBetContent()}
        <Paper className={classes.withdrawingPaper}>
          <WinningOutcome eventPage={eventPage} />
          {allowWithdraw && (
            <Fragment>
              <WithdrawTo />
            </Fragment>
          )}
        </Paper>
      </Card>
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
          {this.renderMetaData()}
        </PageContainer>
      </Fragment>
    );
  }
}

const FormattedMessageFixed = (props) => <FormattedMessage {...props} />;
