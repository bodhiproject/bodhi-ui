import _ from 'lodash';
import { Token, OracleStatus } from '../constants';

const TOPIC_CREATED = 'Topic Created';
const BETTING = 'Betting';
const ORACLE_RESULT_SETTING = 'Oracle Result Setting';
const OPEN_RESULT_SETTING = 'Open Result Setting';
const VOTING = 'Voting';
const FINALIZING = 'Finalizing';
const BLOCK = 'Block:';

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
        description: `${BLOCK} ${cOracle.startBlock || ''} - ${cOracle.endBlock || ''}`,
      },
      {
        title: ORACLE_RESULT_SETTING,
        description: `${BLOCK} ${cOracle.resultSetStartBlock || ''} - ${cOracle.resultSetEndBlock || ''}`,
      },
    ];

    let current;
    if (dOracles) { // DecentralizedOracle and Topic detail
      // Add all voting steps of each DecentralizedOracle
      _.each(dOracles, (item, index) => {
        value.push({
          title: 'Voting',
          description: `${BLOCK} ${item.startBlock || ''} - ${item.endBlock || ''}`,
        });
      });

      const numOfDOracles = dOracles.length;
      const lastDOracle = dOracles[dOracles.length - 1];
      if (isTopicDetail) {
        // Add withdrawing step for TopicEvent
        value.push({
          title: 'Withdrawal',
          description: `${BLOCK} ${lastDOracle.endBlock || ''}+`,
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
          description: `${BLOCK} ${lastDOracle.endBlock || ''}+`,
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
        description: `${BLOCK} ${cOracle.resultSetEndBlock || ''}+`,
      });

      if (block < cOracle.startBlock) {
        current = POS_TOPIC_CREATED;
      } else if (block >= cOracle.startBlock && block < cOracle.endBlock) {
        current = POS_BETTING;
      } else if (block >= cOracle.resultSetStartBlock && block < cOracle.resultSetEndBlock) {
        current = POS_ORACLE_RESULT_SETTING;
      } else if (block >= cOracle.resultSetEndBlock) {
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

