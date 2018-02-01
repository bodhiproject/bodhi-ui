import _ from 'lodash';
import moment from 'moment';
import { Token, OracleStatus } from '../constants';
import { getLocalDateTimeString } from './utility';

const TOPIC_CREATED = 'Topic Created';
const BETTING = 'Betting';
const ORACLE_RESULT_SETTING = 'Oracle Result Setting';
const OPEN_RESULT_SETTING = 'Open Result Setting';
const VOTING = 'Voting';
const FINALIZING = 'Finalizing';
const BLOCK = 'Block:';
const RANGE_SEPARATOR = 'to';
const ANYTIME = 'anytime';

const POS_TOPIC_CREATED = 0;
const POS_BETTING = 1;
const POS_ORACLE_RESULT_SETTING = 2;
const POS_OPEN_RESULT_SETTING = 3;

class CardInfoUtil {
  static getSteps(block, cOracle, dOracles, isTopicDetail) {
    if (_.isUndefined(block) && _.isUndefined(cOracle)) {
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
      _.each(dOracles, (item, index) => {
        value.push({
          title: 'Voting',
          description: `${getLocalDateTimeString(item.startTime)} 
            ${RANGE_SEPARATOR} ${getLocalDateTimeString(item.endBlock)}`,
        });
      });

      const numOfDOracles = dOracles.length;
      const lastDOracle = dOracles[dOracles.length - 1];
      if (isTopicDetail) {
        // Add withdrawing step for TopicEvent
        value.push({
          title: 'Withdrawal',
          description: `${getLocalDateTimeString(lastDOracle.endTime)} ${RANGE_SEPARATOR} ${ANYTIME}`,
        });

        if (block >= lastDOracle.endBlock) {
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

        if (block >= lastDOracle.startBlock && block < lastDOracle.endBlock) {
          // Highlight last DecentralizedOracle voting
          current = POS_ORACLE_RESULT_SETTING + numOfDOracles;
        } else if (block >= lastDOracle.endBlock) {
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
      const currTime = moment().unix();
      if (currTime < cOracle.startTime) {
        current = POS_TOPIC_CREATED;
      } else if (currTime >= cOracle.startTime && currTime < cOracle.endTime) {
        current = POS_BETTING;
      } else if (currTime >= cOracle.resultSetStartTime && currTime < cOracle.resultSetEndTime) {
        current = POS_ORACLE_RESULT_SETTING;
      } else if (currTime >= cOracle.resultSetEndTime) {
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

