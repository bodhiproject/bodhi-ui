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
import { EVENT_STATUS, Routes } from 'constants';
import styles from './styles';
import Option from './Option';
import HistoryTable from './HistoryTable';

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
export default class EventHistory extends Component {
  async componentDidMount() {
    const { params } = this.props.match;
    this.props.store.ui.location = Routes.EVENT_HISTORY;
    await this.props.store.eventPage.init({ ...params });
    this.props.store.history.init();
  }

  componentWillUnmount() {
    this.props.store.eventPage.reset();
  }

  getEventDesc = () => {
    const { event, event: { status } } = this.props.store.eventPage;
    switch (status) {
      case EVENT_STATUS.CREATED: return 'creating';
      case EVENT_STATUS.BETTING: return moment.unix().isBefore(moment.unix(event.betStartTime)) ? 'predictionComingSoon' : 'predictionInProgress';
      case EVENT_STATUS.ORACLE_RESULT_SETTING: return moment.unix().isBefore(moment.unix(event.resultSetEndTime)) ? 'resultSettingComingSoon' : 'resultSettingInProgress';
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

  renderOptions = (actionText, betSpecific) => {
    const { classes, store: { eventPage: { isWithdrawing, isResultSetting, event: { results, status, betResults } } } } = this.props;
    let asOptions = results;
    asOptions = asOptions.slice(1).concat(asOptions[0]);
    if (betSpecific) {
      asOptions = betResults;
      asOptions = asOptions.slice(1);
    }
    return (
      <Grid className={classes.optionGrid}>
        {asOptions.map((option, i) => (
          (status !== EVENT_STATUS.BETTING || (status === EVENT_STATUS.BETTING && i !== asOptions.length - 1)) &&
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

  renderBetContent = () => {
    const {
      classes,
      store: {
        eventPage: { event },
      },
    } = this.props;

    return (
      event.currentRound > 0 && <Fragment>
        <div className={cx(classes.stateText, classes.padLeft)}><FormattedMessage id='string.betEnded' defaultMessage='Event bet Ended' /></div>
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
        {this.renderOptions(event.currentRound > 0 ? 'vote' : 'bet')}
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
          <ContentContainer noSideBar>
            {this.renderActiveEventContent()}
            <HistoryTable />
          </ContentContainer>
        </PageContainer>
      </Fragment>
    );
  }
}

const FormattedMessageFixed = (props) => <FormattedMessage {...props} />;
