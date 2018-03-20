import _ from 'lodash';
import React from 'react';
import { FormattedMessage, IntlProvider, defineMessages } from 'react-intl';
import { getLocalDateTimeString } from './utility';
import { getIntlProvider } from './i18nUtil';

const TOPIC_CREATED = <FormattedMessage id="cardInfo.topic" defaultMessage="Topic Created" />;
const BETTING = <FormattedMessage id="str.betting" defaultMessage="Betting" />;
const ORACLE_RESULT_SETTING = <FormattedMessage id="cardInfo.orResultSet" defaultMessage="Oracle Result Setting" />;
const OPEN_RESULT_SETTING = <FormattedMessage id="cardInfo.opResultSet" defaultMessage="Open Result Setting" />;
const VOTING = <FormattedMessage id="cardInfo.vote" defaultMessage="Voting" />;
const FINALIZING = <FormattedMessage id="cardInfo.final" defaultMessage="Finalizing" />;
const WITHDRAWING = <FormattedMessage id="cardInfo.withdraw" defaultMessage="Withdraw" />;


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

class CardInfoUtil {
  static getSteps(blockTime, cOracle, dOracles, isTopicDetail, locale, localeMessages) {
    if (_.isUndefined(blockTime) && _.isUndefined(cOracle)) {
      return false;
    }
    const intl = getIntlProvider(locale, localeMessages);

    const BLOCK = `${intl.formatMessage(messages.block)}:`;
    const RANGE_SEPARATOR = intl.formatMessage(messages.to);
    const ANYTIME = intl.formatMessage(messages.anytime);

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

export default CardInfoUtil;

