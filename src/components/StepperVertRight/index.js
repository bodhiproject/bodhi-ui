import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Stepper, Step, StepLabel, Typography, withStyles } from '@material-ui/core';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { isEmpty, each } from 'lodash';

import styles from './styles';
import { getShortLocalDateTimeString } from '../../helpers/utility';

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

/**
 * TODO: we should refactor this component. Pretty messy
 */
@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class StepperVertRight extends Component {
  render() {
    const { global: { syncBlockTime }, eventPage: { oracles } } = this.props.store;
    const { classes } = this.props;

    if (!syncBlockTime || isEmpty(oracles)) return null;

    const steps = this.getSteps();

    return (
      <Stepper activeStep={steps.current} orientation="vertical" className={classes.stepperVertRightWrapper}>
        {steps.value.map((item) => (
          <Step key={item.title}>
            <StepLabel className={classes.stepperVertRightLabel}>
              <Typography variant="title">
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
    const { intl: { formatMessage }, isTopicDetail = false } = this.props;
    const { syncBlockTime } = this.props.store.global;
    const { cOracle: centralized, dOracles: decentralized } = this.props.store.eventPage;

    const cOracle = centralized;
    const dOracles = decentralized;
    const RANGE_SEPARATOR = formatMessage(messages.cardInfoMsg);
    const ANYTIME = formatMessage(messages.anytimeMsg);

    // Init all events with these steps
    const value = [{
      title: <FormattedMessage id="cardInfo.topic" defaultMessage="Topic Created" />,
      description: `${formatMessage(messages.blockMsg)}: ${cOracle.blockNum || ''}`,
    }, {
      title: <FormattedMessage id="str.betting" defaultMessage="Betting" />,
      description: `${getShortLocalDateTimeString(cOracle.startTime)}
        ${RANGE_SEPARATOR} ${getShortLocalDateTimeString(cOracle.endTime)}`,
    }, {
      title: <FormattedMessage id="cardInfo.orResultSet" defaultMessage="Oracle Result Setting" />,
      description: `${getShortLocalDateTimeString(cOracle.resultSetStartTime)}
        ${RANGE_SEPARATOR} ${getShortLocalDateTimeString(cOracle.resultSetEndTime)}`,
    }];

    let current;
    if (!isEmpty(dOracles)) { // DecentralizedOracle and Topic detail
      // Add all voting steps of each DecentralizedOracle
      each(dOracles, (item) => {
        value.push({
          title: <FormattedMessage id="cardInfo.arbitration" defaultMessage="Arbitration" />,
          description: `${getShortLocalDateTimeString(item.startTime)}
            ${RANGE_SEPARATOR} ${getShortLocalDateTimeString(item.endTime)}`,
        });
      });

      const numOfDOracles = dOracles.length;
      const lastDOracle = dOracles[dOracles.length - 1];
      if (isTopicDetail) {
        // Add withdrawing step for TopicEvent
        value.push({
          title: <FormattedMessage id="cardInfo.withdraw" defaultMessage="Withdraw" />,
          description: `${getShortLocalDateTimeString(lastDOracle.endTime)} ${RANGE_SEPARATOR} ${ANYTIME}`,
        });

        if (syncBlockTime >= lastDOracle.endTime) {
          // Highlight withdrawal
          current = ORACLE_RESULT_SETTING + numOfDOracles + 1;
        } else {
          current = null;
        }
      } else {
        // Add finalizing step for DecentralizedOracle
        value.push({
          title: <FormattedMessage id="cardInfo.final" defaultMessage="Finalizing" />,
          description: `${getShortLocalDateTimeString(lastDOracle.endTime)} ${RANGE_SEPARATOR} ${ANYTIME}`,
        });

        if (syncBlockTime >= lastDOracle.startTime && syncBlockTime < lastDOracle.endTime) {
          // Highlight last DecentralizedOracle voting
          current = ORACLE_RESULT_SETTING + numOfDOracles;
        } else if (syncBlockTime >= lastDOracle.endTime) {
          // Highlight finalizing
          current = ORACLE_RESULT_SETTING + numOfDOracles + 1;
        } else {
          current = null;
        }
      }
    } else { // CentralizedOracle detail
      // Only show open result setting in CentralizedOracle
      value.push({
        title: <FormattedMessage id="cardInfo.opResultSet" defaultMessage="Open Result Setting" />,
        description: `${getShortLocalDateTimeString(cOracle.resultSetEndTime)} ${RANGE_SEPARATOR} ${ANYTIME}`,
      });

      // Set step number
      if (syncBlockTime < cOracle.startTime) {
        current = TOPIC_CREATED;
      } else if (syncBlockTime >= cOracle.startTime && syncBlockTime < cOracle.resultSetStartTime) {
        current = BETTING;
      } else if (syncBlockTime >= cOracle.resultSetStartTime && syncBlockTime < cOracle.resultSetEndTime) {
        current = ORACLE_RESULT_SETTING;
      } else if (syncBlockTime >= cOracle.resultSetEndTime) {
        current = OPEN_RESULT_SETTING;
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
