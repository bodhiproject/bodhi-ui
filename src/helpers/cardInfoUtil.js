import _ from 'lodash';
import { Token, OracleStatus } from '../constants';

const TOPIC_CREATED = 'Topic Created';
const BETTING = 'Betting';
const ORACLE_RESULT_SETTING = 'Oracle Result Setting';
const OPEN_RESULT_SETTING = 'Open Result Setting';
const VOTING = 'Voting';
const FINALIZING = 'Finalizing';
const BLOCK = 'Block:';

class CardInfoUtil {
  static getSteps(block, cOracle, dOracles) {
    let current;
    let lastDOracle;
    if (dOracles) {
      lastDOracle = dOracles[dOracles.length - 1];
      if (block >= lastDOracle.startBlock && block < lastDOracle.endBlock) {
        current = 4;
      } else if (block >= lastDOracle.endBlock) {
        current = 5;
      } else {
        current = null;
      }
    } else if (cOracle) {
      if (block >= cOracle.startBlock && block < cOracle.endBlock) {
        current = 1;
      } else if (block >= cOracle.resultSetStartBlock && block < cOracle.resultSetEndBlock) {
        current = 2;
      } else if (block >= cOracle.resultSetEndBlock) {
        current = 3;
      } else {
        current = null;
      }
    } else {
      current = null;
    }

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
      {
        title: OPEN_RESULT_SETTING,
        description: `${BLOCK} ${cOracle.resultSetEndBlock || ''}+`,
      },
    ];

    if (dOracles) {
      _.each(dOracles, (item) => {
        value.push({
          title: 'Voting',
          description: `${BLOCK} ${item.startBlock || ''} - ${item.endBlock || ''}`,
        });
      });

      value.push({
        title: FINALIZING,
        description: `${BLOCK} ${lastDOracle.endBlock || ''}+`,
      });
    }

    return {
      current,
      value,
    };
  }
}

export default CardInfoUtil;

