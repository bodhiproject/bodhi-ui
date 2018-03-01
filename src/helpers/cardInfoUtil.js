import _ from 'lodash';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { getLocalDateTimeString } from './utility';

const TOPIC_CREATED = <FormattedMessage id="cardinfo.topic" defaultMessage="Topic Created" />;
const BETTING = <FormattedMessage id="cardinfo.betting" defaultMessage="Betting" />;
const ORACLE_RESULT_SETTING = <FormattedMessage id="cardinfo.orresultset" defaultMessage="Oracle Result Setting" />;
const OPEN_RESULT_SETTING = <FormattedMessage id="cardinfo.opresultset" defaultMessage="Open Result Setting" />;
const VOTING = <FormattedMessage id="cardinfo.vote" defaultMessage="Voting" />;
const FINALIZING = <FormattedMessage id="cardinfo.final" defaultMessage="Finalizing" />;
const WITHDRAWING = <FormattedMessage id="cardinfo.withdraw" defaultMessage="Withdraw" />;
const BLOCK = 'Block:';
const RANGE_SEPARATOR = 'to';
const ANYTIME = 'anytime';

const POS_TOPIC_CREATED = 0;
const POS_BETTING = 1;
const POS_ORACLE_RESULT_SETTING = 2;
const POS_OPEN_RESULT_SETTING = 3;

class CardInfoUtil {
  static getSteps(blockTime, cOracle, dOracles, isTopicDetail) {
    if (_.isUndefined(blockTime) && _.isUndefined(cOracle)) {
      return false;
    }

    // Init all events with these steps
    const value = [
      {
        title: TOPIC_CREATED,
        description: `${BLOCK} ${cOracle.blockNum || ''}`,
      },
      {
        title: BETTING,
        description: `${getLocalDateTimeString(cOracle.startTime)} 
          ${RANGE_SEPARATOR} ${getLocalDateTimeString(cOracle.endTime)}`,
      },
      {
        title: ORACLE_RESULT_SETTING,
        description: `${getLocalDateTimeString(cOracle.resultSetStartTime)} 
          ${RANGE_SEPARATOR} ${getLocalDateTimeString(cOracle.resultSetEndTime)}`,
      },
    ];

    let current;
    if (dOracles) { // DecentralizedOracle and Topic detail
      // Add all voting steps of each DecentralizedOracle
      _.each(dOracles, (item) => {
        value.push({
          title: VOTING,
          description: `${getLocalDateTimeString(item.startTime)} 
            ${RANGE_SEPARATOR} ${getLocalDateTimeString(item.endTime)}`,
        });
      });

      const numOfDOracles = dOracles.length;
      const lastDOracle = dOracles[dOracles.length - 1];
      if (isTopicDetail) {
        // Add withdrawing step for TopicEvent
        value.push({
          title: WITHDRAWING,
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
          title: FINALIZING,
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
        title: OPEN_RESULT_SETTING,
        description: `${getLocalDateTimeString(cOracle.resultSetEndTime)} ${RANGE_SEPARATOR} ${ANYTIME}`,
      });

      // Set step number
      if (blockTime < cOracle.startTime) {
        current = POS_TOPIC_CREATED;
      } else if (blockTime >= cOracle.startTime && blockTime < cOracle.endTime) {
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

export default CardInfoUtil;

