import React, { PropTypes } from 'react';
import Stepper, { Step, StepLabel } from 'material-ui/Stepper';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import _ from 'lodash';

import styles from './styles';
import { getLocalDateTimeString } from '../../helpers/utility';

const POS_TOPIC_CREATED = 0;
const POS_BETTING = 1;
const POS_ORACLE_RESULT_SETTING = 2;
const POS_OPEN_RESULT_SETTING = 3;

const messages = defineMessages({
  block: {
    id: 'str.block',
    defaultMessage: 'Block',
  },
  to: {
    id: 'cardInfo.to',
    defaultMessage: 'To',
  },
  anytime: {
    id: 'str.anytime',
    defaultMessage: 'anytime',
  },
});

@injectIntl
@withStyles(styles, { withTheme: true })
export default class StepperVertRight extends React.PureComponent {
  static propTypes = {
    intl: intlShape.isRequired, // eslint-disable-line
    classes: PropTypes.object.isRequired,
    blockTime: PropTypes.number.isRequired,
    cOracle: PropTypes.object,
    dOracles: PropTypes.array.isRequired,
    isTopicDetail: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    cOracle: undefined,
  }

  render() {
    const { classes, blockTime, cOracle } = this.props;

    if (!blockTime || !cOracle) { // the && was blocking this oracle page from being viewed since cOracle was undefined and the getSteps() needed it and blockTime was defined
      return null;
    }

    const steps = this.getSteps();

    return (
      <Stepper activeStep={steps.current} orientation="vertical" className={classes.stepperVertRightWrapper}>
        {steps.value.map((item, index) => (
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
      intl: { formatMessage },
      blockTime,
      cOracle,
      dOracles,
      isTopicDetail,
    } = this.props;

    const RANGE_SEPARATOR = formatMessage(messages.to);
    const ANYTIME = formatMessage(messages.anytime);

    // Init all events with these steps
    const value = [{
      title: <FormattedMessage id="cardInfo.topic" defaultMessage="Topic Created" />,
      description: `${formatMessage(messages.block)}: ${cOracle.blockNum || ''}`,
    }, {
      title: <FormattedMessage id="str.betting" defaultMessage="Betting" />,
      description: `${getLocalDateTimeString(cOracle.startTime)}
        ${RANGE_SEPARATOR} ${getLocalDateTimeString(cOracle.endTime)}`,
    }, {
      title: <FormattedMessage id="cardInfo.orResultSet" defaultMessage="Oracle Result Setting" />,
      description: `${getLocalDateTimeString(cOracle.resultSetStartTime)}
        ${RANGE_SEPARATOR} ${getLocalDateTimeString(cOracle.resultSetEndTime)}`,
    }];

    let current;
    if (!_.isEmpty(dOracles)) { // DecentralizedOracle and Topic detail
      // Add all voting steps of each DecentralizedOracle
      _.each(dOracles, (item) => {
        value.push({
          title: <FormattedMessage id="cardInfo.vote" defaultMessage="Voting" />,
          description: `${getLocalDateTimeString(item.startTime)}
            ${RANGE_SEPARATOR} ${getLocalDateTimeString(item.endTime)}`,
        });
      });

      const numOfDOracles = dOracles.length;
      const lastDOracle = dOracles[dOracles.length - 1];
      if (isTopicDetail) {
        // Add withdrawing step for TopicEvent
        value.push({
          title: <FormattedMessage id="cardInfo.withdraw" defaultMessage="Withdraw" />,
          description: `${getLocalDateTimeString(lastDOracle.endTime)} ${RANGE_SEPARATOR} ${ANYTIME}`,
        });

        if (blockTime >= lastDOracle.endTime) {
          // Highlight withdrawal
          current = POS_ORACLE_RESULT_SETTING + numOfDOracles + 1;
        } else {
          current = null;
        }
      } else {
        // Add finalizing step for DecentralizedOracle
        value.push({
          title: <FormattedMessage id="cardInfo.final" defaultMessage="Finalizing" />,
          description: `${getLocalDateTimeString(lastDOracle.endTime)} ${RANGE_SEPARATOR} ${ANYTIME}`,
        });

        if (blockTime >= lastDOracle.startTime && blockTime < lastDOracle.endTime) {
          // Highlight last DecentralizedOracle voting
          current = POS_ORACLE_RESULT_SETTING + numOfDOracles;
        } else if (blockTime >= lastDOracle.endTime) {
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
        description: `${getLocalDateTimeString(cOracle.resultSetEndTime)} ${RANGE_SEPARATOR} ${ANYTIME}`,
      });

      // Set step number
      if (blockTime < cOracle.startTime) {
        current = POS_TOPIC_CREATED;
      } else if (blockTime >= cOracle.startTime && blockTime < cOracle.resultSetStartTime) {
        current = POS_BETTING;
      } else if (blockTime >= cOracle.resultSetStartTime && blockTime < cOracle.resultSetEndTime) {
        current = POS_ORACLE_RESULT_SETTING;
      } else if (blockTime >= cOracle.resultSetEndTime) {
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
