import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import { EVENT_STATUS } from 'constants';
import { Stepper, Step, StepLabel, Typography, withStyles } from '@material-ui/core';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { isEmpty, each } from 'lodash';

import styles from './styles';

// Current step positions. Index defines which step the Event is in.
const [TOPIC_CREATED, BETTING, ORACLE_RESULT_SETTING, OPEN_RESULT_SETTING] = [0, 1, 2, 3];
const messages = defineMessages({
  cardInfoMsg: {
    id: 'cardInfo.to',
    defaultMessage: 'To',
  },
  anytimeMsg: {
    id: 'str.anytime',
    defaultMessage: 'anytime',
  },
  blockMsg: {
    id: 'str.block',
    defaultMessage: 'Block',
  },
});

@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class StepperVertRight extends Component {
  render() {
    const { global: { syncBlockTime }, eventPage: { event } } = this.props.store;
    const { classes } = this.props;

    if (!syncBlockTime || isEmpty(event)) return null;

    const steps = this.getSteps();

    return (
      <Stepper activeStep={steps.current} orientation="vertical" className={classes.stepperVertRightWrapper}>
        {steps.value.map((item) => (
          <Step key={item.title}>
            <StepLabel className={classes.stepperVertRightLabel}>
              <Typography variant="h6">
                {item.title}
              </Typography>
              <Typography variant="caption">
                {item.description}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    );
  }

  getSteps = () => {
    const { intl: { formatMessage } } = this.props;
    const { syncBlockTime } = this.props.store.global;
    const { event, resultSetsHistory } = this.props.store.eventPage;

    const currentArbitrationEndTime = event.arbitrationEndTime;
    const RANGE_SEPARATOR = formatMessage(messages.cardInfoMsg);
    const ANYTIME = formatMessage(messages.anytimeMsg);

    let current;
    const arbitrations = resultSetsHistory.slice(1);
    let lastArbitrationEndTime = event.resultSetEndTime;
    const numOfDOracles = arbitrations.length;

    // Init all events with these steps
    const value = [{
      title: <FormattedMessage id="cardInfo.topic" defaultMessage="Event Created" />,
      description: `${formatMessage(messages.blockMsg)}: ${event.blockNum || ''}`,
    }, {
      title: <FormattedMessage id="str.betting" defaultMessage="Betting" />,
      description: `${moment.unix(event.betStartTime).format('LLL')}
        ${RANGE_SEPARATOR} ${moment.unix(event.betEndTime).format('LLL')}`,
    }, {
      title: <FormattedMessage id="cardInfo.orResultSet" defaultMessage="Event Result Setting" />,
      description: `${moment.unix(event.resultSetStartTime).format('LLL')}
        ${RANGE_SEPARATOR} ${moment.unix(event.resultSetEndTime).format('LLL')}`,
    }];

    if (event.status === EVENT_STATUS.OPEN_RESULT_SETTING) { // CentralizedOracle detail
      // Only show open result setting in CentralizedOracle
      value.push({
        title: <FormattedMessage id="cardInfo.opResultSet" defaultMessage="Open Result Setting" />,
        description: `${moment.unix(event.resultSetEndTime).format('LLL')} ${RANGE_SEPARATOR} ${ANYTIME}`,
      });

      // Set step number
      if (syncBlockTime < event.betStartTime) {
        current = TOPIC_CREATED;
      } else if (syncBlockTime >= event.betStartTime && syncBlockTime < event.resultSetStartTime) {
        current = BETTING;
      } else if (syncBlockTime >= event.resultSetStartTime && syncBlockTime < event.resultSetEndTime) {
        current = ORACLE_RESULT_SETTING;
      } else if (syncBlockTime >= event.resultSetEndTime) {
        current = OPEN_RESULT_SETTING;
      } else {
        current = null;
      }
    }

    if (!isEmpty(arbitrations)) { // DecentralizedOracle and Topic detail
      // Add all voting steps of each DecentralizedOracle
      each(arbitrations, (item) => {
        value.push({
          title: <FormattedMessage id="cardInfo.arbitration" defaultMessage="Arbitration" />,
          description: `${moment.unix(lastArbitrationEndTime).format('LLL')}
            ${RANGE_SEPARATOR} ${moment.unix(item.block.blockTime).format('LLL')}`,
        });
        lastArbitrationEndTime = item.block.blockTime;
      });
    }

    if (event.status === EVENT_STATUS.ARBITRATION) {
      // Add current arbitration step for event
      value.push({
        title: <FormattedMessage id="cardInfo.arbitration" defaultMessage="Arbitration" />,
        description: `${moment.unix(lastArbitrationEndTime).format('LLL')}
          ${RANGE_SEPARATOR} ${moment.unix(currentArbitrationEndTime).format('LLL')}`,
      });
      // Highlight last DecentralizedOracle voting
      current = ORACLE_RESULT_SETTING + numOfDOracles + 1;
    }

    if (event.status === EVENT_STATUS.WITHDRAWING) {
      // Add withdrawing step for TopicEvent
      value.push({
        title: <FormattedMessage id="cardInfo.withdraw" defaultMessage="Withdraw" />,
        description: `${moment.unix(lastArbitrationEndTime).format('LLL')} ${RANGE_SEPARATOR} ${ANYTIME}`,
      });

      if (syncBlockTime >= lastArbitrationEndTime) {
        // Highlight withdrawal
        current = ORACLE_RESULT_SETTING + numOfDOracles + 1;
      } else {
        current = null;
      }
    }

    return {
      current,
      value,
    };
  }
}
