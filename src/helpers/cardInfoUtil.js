const TOPIC_CREATED = 'Topic Created';
const BETTING = 'Betting';
const ORACLE_RESULT_SETTING = 'Oracle Result Setting';
const OPEN_RESULT_SETTING = 'Open Result Setting';
const VOTING = 'Voting';
const BLOCK = 'Block:';

class CardInfoUtil {
  static getCentralizedOracleArray(oracle) {
    return [
      {
        title: TOPIC_CREATED,
        description: `${BLOCK} ${oracle.blockNum || ''}`,
      },
      {
        title: BETTING,
        description: `${BLOCK} ${oracle.startBlock || ''} - ${oracle.endBlock || ''}`,
      },
      {
        title: ORACLE_RESULT_SETTING,
        description: `${BLOCK} ${oracle.resultSetStartBlock || ''} - ${oracle.resultSetEndBlock || ''}`,
      },
      {
        title: OPEN_RESULT_SETTING,
        description: `${BLOCK} ${oracle.resultSetEndBlock || ''}+`,
      },
    ];
  }

  static getDecentralizedOracleArray(cOracle, dOracle) {
    return [
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
        title: VOTING,
        description: `${BLOCK} ${dOracle.startBlock || ''} - ${dOracle.endBlock || ''}`,
      },
    ];
  }
}

export default CardInfoUtil;

