import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Stepper, Step, StepLabel, Typography, withStyles } from '@material-ui/core';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';

import styles from './styles';
import { getShortLocalDateTimeString } from '../../helpers/utility';

const POS_TOPIC_CREATED = 0;
const POS_BETTING = 1;
const POS_ORACLE_RESULT_SETTING = 2;
const POS_OPEN_RESULT_SETTING = 3;


@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class StepperVertRight extends Component {
  render() {
    const { global: { syncBlockTime }, oraclePage: { cOracle } } = this.props.store;
    const { classes } = this.props;

    if (!syncBlockTime && !cOracle) return null;

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
    const {
      global: { syncBlockTime },
      oraclePage: {
        cOracle,
        dOracles,
      },
    } = this.props.store;
    const { intl: { formatMessage }, isTopicDetail = false } = this.props;

    const RANGE_SEPARATOR = formatMessage({ id: 'cardInfo.to' });
    const ANYTIME = formatMessage({ id: 'str.anytime' });

    // Init all events with these steps
    const value = [{
      title: <FormattedMessage id="cardInfo.topic" defaultMessage="Topic Created" />,
      description: `${formatMessage({ id: 'str.block' })}: ${cOracle.blockNum || ''}`,
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
    if (!_.isEmpty(dOracles)) { // DecentralizedOracle and Topic detail
      // Add all voting steps of each DecentralizedOracle
      _.each(dOracles, (item) => {
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
          current = POS_ORACLE_RESULT_SETTING + numOfDOracles + 1;
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
          current = POS_ORACLE_RESULT_SETTING + numOfDOracles;
        } else if (syncBlockTime >= lastDOracle.endTime) {
          // Highlight finalizing
          current = POS_ORACLE_RESULT_SETTING + numOfDOracles + 1;
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
        current = POS_TOPIC_CREATED;
      } else if (syncBlockTime >= cOracle.startTime && syncBlockTime < cOracle.resultSetStartTime) {
        current = POS_BETTING;
      } else if (syncBlockTime >= cOracle.resultSetStartTime && syncBlockTime < cOracle.resultSetEndTime) {
        current = POS_ORACLE_RESULT_SETTING;
      } else if (syncBlockTime >= cOracle.resultSetEndTime) {
        current = POS_OPEN_RESULT_SETTING;
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
