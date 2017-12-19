import React, { PropTypes } from 'react';
import { Row, Col, Breadcrumb, Radio } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import CardInfo from '../components/bodhi-dls/cardInfo';
import CardVoting from '../components/bodhi-dls/cardVoting';
import ProgressBar from '../components/bodhi-dls/progressBar';
import LayoutContentWrapper from '../components/utility/layoutWrapper';
import IsoWidgetsWrapper from './Widgets/widgets-wrapper';
import dashboardActions from '../redux/dashboard/actions';
import appActions from '../redux/app/actions';
import topicActions from '../redux/topic/actions';

const Qweb3Utils = require('../modules/qweb3/src/utils');

const RadioGroup = Radio.Group;
const DEFAULT_RADIO_VALUE = 0;
const ORACLE_BOT_THRESHOLD = 10000000000; // Botoshi
const SUB_REQ_DELAY = 60 * 1000; // Delay subsequent request by 60 sec

const OracleType = {
  CENTRALISED: 'CENTRALISED',
  DECENTRALISED: 'DECENTRALISED',
};

const PageConfig =
  [
    {
      name: 'BETTING',
      breadcrumbLabel: 'Betting',
      blockStartLabel: 'Betting starts at block:',
      blockEndLabel: 'Betting ends at block:',
      showAmountInput: true,
      bottomBtnText: 'Participate',
    },
    {
      name: 'SETTING',
      breadcrumbLabel: 'Setting',
      blockStartLabel: 'Betting starts at block:',
      blockEndLabel: 'Betting ends at block:',
      showAmountInput: false,
      bottomBtnText: 'Set Result',
    },
    {
      name: 'VOTING',
      breadcrumbLabel: 'Voting',
      blockStartLabel: 'Voting starts at block:',
      blockEndLabel: 'Voting ends at block:',
      showAmountInput: true,
      bottomBtnText: 'Vote',
    }, {
      name: 'FINALIZING',
      breadcrumbLabel: 'Voting', // Finalize state should be transparent to end user
      blockStartLabel: 'Voting starts at block:',
      blockEndLabel: 'Voting ends at block:',
      showAmountInput: false,
      bottomBtnText: 'Finalize',
    }];

class OraclePage extends React.Component {
  /**
   * Determine OracleType; default DECENTRALISED
   * @param  {object} oracle Oracle object
   * @return {string}        OracleType
   */
  static getOracleType(oracle) {
    switch (oracle.token) {
      case 'QTUM':
        return OracleType.CENTRALISED;
      case 'BOT':
      default:
        return OracleType.DECENTRALISED;
    }
  }

  /**
 * Get Bet or Vote names and balances from oracle
 * @param  {object} oracle Oracle object
 * @return {array}         {name, value, percent}
 */
  static getBetOrVoteArray(oracle) {
    const totalBalance = _.sum(oracle.amounts);

    if (OraclePage.getOracleType(oracle) === OracleType.CENTRALISED) {
      return _.map(oracle.options, (optionName, index) => ({
        name: optionName,
        value: `${oracle.amounts[index]} ${oracle.token}`,
        percent: totalBalance === 0 ? totalBalance : _.floor((oracle.amounts[index] / totalBalance) * 100),
      }));
    }

    return _.map(oracle.optionIdxs, (optIndex, index) => ({
      name: oracle.options[optIndex],
      value: `${oracle.amounts[index]} ${oracle.token}`,
      percent: totalBalance === 0 ? totalBalance : _.floor((oracle.amounts[index] / totalBalance) * 100),
    }));
  }

  constructor(props) {
    super(props);

    this.state = {
      address: this.props.match.params.address,
      oracle: undefined,
      radioValue: DEFAULT_RADIO_VALUE, // Selected index of optionsIdx[]
      config: undefined,
      voteAmount: undefined,
      allowanceIntervalId: undefined,
    };

    this.onAllowanceReturn = this.onAllowanceReturn.bind(this);
    this.onRadioGroupChange = this.onRadioGroupChange.bind(this);
    this.onConfirmBtnClicked = this.onConfirmBtnClicked.bind(this);
    this.getCurrentSenderAddress = this.getCurrentSenderAddress.bind(this);
    this.checkAllowance = this.checkAllowance.bind(this);
    this.bet = this.bet.bind(this);
    this.setResult = this.setResult.bind(this);
    this.vote = this.vote.bind(this);
    this.finalizeResult = this.finalizeResult.bind(this);
  }

  componentWillMount() {
    // TODO: Get current oracle
    this.props.onGetOracles();

    // Get current block count
    this.props.onGetBlockCount();
  }

  componentWillReceiveProps(nextProps) {
    const {
      getOraclesSuccess,
      finalizeResultReturn,
      allowanceReturn,
      blockCount,
    } = nextProps;

    console.log(`blockCount is ${blockCount}`);

    if (!_.isEmpty(getOraclesSuccess)) {
      let oracle = _.find(getOraclesSuccess, { address: this.state.address });

      if (oracle) {
        const { token, status, endBlock } = oracle;
        console.log('oracle', oracle);

        let configName;

        /** Determine what config to use in current card * */
        switch (status) {
          case 'VOTING':

            if (token === 'BOT') {
              // Finalize oracle if current block has passed arbitrationEndBlock and threshold is not met
              // Since new oracle is guarranteed to spawn if total amount threshold is met we are not checking total BOT amount here
              if (blockCount > oracle.endBlock) {
                console.log(`!! blockCount ${blockCount} is greater than endBlock ${endBlock}.`);
                configName = 'FINALIZING';
              } else {
                configName = 'VOTING';
              }
              break;
            }

            configName = 'BETTING';
            break;

          case 'WAITRESULT':
            configName = 'SETTING';
            break;
          default:
            console.warn('Oracle exists but cant determine status. ');
            oracle = undefined;
            break;
        }

        console.log('oracle', oracle);
        console.log(`configName is ${configName}`);

        this.setState({
          oracle,
          config: _.find(PageConfig, { name: configName }),
        });
      }
    }

    // Leave here temporarily for debugging purpose
    if (finalizeResultReturn) {
      console.log('finalizeResultReturn', finalizeResultReturn);
    }

    // TODO: use this when ready to use callback method to handle the flow of approve > setResult/vote
    // if (allowanceReturn) {
    //   const allowance = Qweb3Utils.hexToNumber(allowanceReturn.result.executionResult.output);
    //   this.onAllowanceReturn(allowance);
    // }

    // TODO: For any error case we will render an Oracle not found page
  }

  componentWillUnmount() {
    this.props.onClearRequestReturn();
  }

  /*
  * TODO: use this to handle the callbacks of allowanceReturn from componentWillReceiveProps
  * this logic checks the allowance amount:
  * if 0, then just approve.
  * if equal or greater than needed amount, call setResult/vote.
  * if less than needed amount, reset allowance to 0 first.
  */
  onAllowanceReturn(allowance) {
    console.log('allowance', allowance);

    const configName = this.state.config.name;
    if (allowance === 0) { // Need to approved for setResult or vote
      switch (configName) {
        case 'SETTING': {
          this.approve(ORACLE_BOT_THRESHOLD);
          break;
        }
        case 'VOTING': {
          this.approve(this.state.voteAmount);
          break;
        }
        default: {
          break;
        }
      }
    } else if (allowance >= this.state.neededAllowance) { // Already approved call setResult or vote
      clearInterval(this.state.allowanceIntervalId);
      this.setState({
        allowanceIntervalId: undefined,
      });

      switch (configName) {
        case 'SETTING': {
          this.setResult();
          break;
        }
        case 'VOTING': {
          this.vote();
          break;
        }
        default: {
          break;
        }
      }
    } else { // The approved amount does not match the amount so reset allowance
      this.resetAllowance();
    }
  }

  /** Return selected address on Topbar as sender * */
  getCurrentSenderAddress() {
    const { walletAddrs, walletAddrsIndex } = this.props;
    return walletAddrs[walletAddrsIndex].address;
  }

  onRadioGroupChange(evt) {
    this.setState({
      radioValue: evt.target.value,
    });
  }

  /** The right card Confirm Button event handler * */
  onConfirmBtnClicked(obj) {
    const { oracle, radioValue } = this.state;
    const {
      onBet, onSetResult, onVote, onFinalizeResult, onApprove,
    } = this.props;
    const senderAddress = this.getCurrentSenderAddress();
    const selectedIndex = oracle.optionIdxs[radioValue - 1];
    const { amount } = obj;

    switch (this.state.config.name) {
      case 'BETTING':
        onBet(oracle.address, selectedIndex, amount, senderAddress);
        break;

      case 'SETTING':
        /** Result setter needs to have 100 BOT and get approved by Bodhi_token contract to use them* */
        onApprove(oracle.topicAddress, ORACLE_BOT_THRESHOLD, senderAddress);

        setTimeout(() => {
          onSetResult(oracle.address, selectedIndex, senderAddress);
        }, SUB_REQ_DELAY);
        break;

      case 'VOTING':
        /** The amount of voting needs to be approved by Bodhi_token * */
        onApprove(oracle.address, amount, senderAddress);

        setTimeout(() => {
          onVote(oracle.address, selectedIndex, amount, senderAddress);
        }, SUB_REQ_DELAY);
        break;

      case 'FINALIZING':
        // Finalize oracle to enter next stage, withdraw
        onFinalizeResult(oracle.address, senderAddress);
        break;

      default:
        // TODO: oracle not found page
        break;
    }
  }

  // TODO: this logic is the start of checking the allowance to execute the proper methods after they are approved.
  // onConfirmBtnClicked(obj) {
  //   const { amount } = obj;
  //   this.setState({
  //     voteAmount: amount,
  //   });

  //   // setResult and vote are handled in onAllowanceReturn
  //   switch (this.state.config.name) {
  //     case 'BETTING': {
  //       this.bet(amount);
  //       break;
  //     }
  //     case 'FINALIZING': {
  //       this.finalizeResult();
  //       break;
  //     }
  //     case 'SETTING':
  //     case 'VOTING': {
  //       this.checkAllowance();
  //       break;
  //     }
  //     default: {
  //       // TODO: oracle not found page
  //       break;
  //     }
  //   }
  // }

  checkAllowance() {
    console.log('starting allowance polling service');
    const allowancePoll = function () {
      const senderAddress = this.getCurrentSenderAddress();
      this.props.onAllowance(senderAddress, this.state.oracle.address, senderAddress);
    };

    allowancePoll();
    const intervalId = setInterval(allowancePoll(), SUB_REQ_DELAY);
    this.setState({
      allowanceIntervalId: intervalId,
    });
  }

  bet(amount) {
    const { onBet } = this.props;
    const { oracle, radioValue } = this.state;
    const selectedIndex = oracle.optionIdxs[radioValue - 1];
    const senderAddress = this.getCurrentSenderAddress();

    // contractAddress should be CentralizedOracle
    onBet(oracle.address, selectedIndex, amount, senderAddress);
  }

  setResult() {
    const { onSetResult } = this.props;
    const { oracle, radioValue } = this.state;
    const selectedIndex = oracle.optionIdxs[radioValue - 1];
    const senderAddress = this.getCurrentSenderAddress();

    // address should be CentralizedOracle
    onSetResult(oracle.address, selectedIndex, senderAddress);
  }

  vote(amount) {
    const { onVote } = this.props;
    const { oracle, radioValue } = this.state;
    const selectedIndex = oracle.optionIdxs[radioValue - 1];
    const senderAddress = this.getCurrentSenderAddress();

    // address should be DecentralizedOracle
    onVote(oracle.address, selectedIndex, amount, senderAddress);
  }

  finalizeResult() {
    const { onFinalizeResult } = this.props;
    const { oracle } = this.state;
    const senderAddress = this.getCurrentSenderAddress();

    // Finalize oracle to enter next stage, withdraw
    // contractAddress should be DecentralizedOracle
    onFinalizeResult(oracle.address, senderAddress);
  }

  approve(amount) {
    const { onApprove } = this.props;
    const { oracle } = this.state;
    const senderAddress = this.getCurrentSenderAddress();

    onApprove(oracle.topicAddress, amount, senderAddress);
  }

  /*
  * If the sender to TopicEvent allowance is less than the amount needed, it needs to be reset to 0 first.
  * There is a race condition issue in the transferFrom() function that requires allowance to be reset to 0,
  * then approve() again for the correct amount.
  */
  resetAllowance() {
    const { oracle } = this.state;
    const { onApprove } = this.props;
    const senderAddress = this.getCurrentSenderAddress();

    onApprove(oracle.topicAddress, 0, senderAddress);
  }

  render() {
    const { editingToggled, requestReturn } = this.props;
    const { oracle, config } = this.state;

    if (!oracle) {
      // TODO: render no result page
      return <div> 404 Page not found. </div>;
    }

    const timeline = [{
      label: config.blockStartLabel,
      value: oracle.blockNum,
    }, {
      label: config.blockEndLabel,
      value: oracle.endBlock,
    }];

    const totalBalance = _.sum(oracle.amounts);
    const { token } = oracle;

    const betBalance = OraclePage.getBetOrVoteArray(oracle);
    const breadcrumbLabel = config && config.breadcrumbLabel;

    const oracleElement = (
      <Row
        gutter={28}
        justify="center"
      >

        <Col xl={12} lg={12}>
          <IsoWidgetsWrapper padding="32px" >
            <CardInfo
              title={oracle.name}
              timeline={timeline}
            >
            </CardInfo>
          </IsoWidgetsWrapper>

        </Col>
        <Col xl={12} lg={12}>
          <IsoWidgetsWrapper padding="32px">
            <CardVoting
              amount={totalBalance}
              config={config}
              token={token}
              voteBalance={betBalance}
              onSubmit={this.onConfirmBtnClicked}
              radioIndex={this.state.radioValue}
              result={requestReturn}
            >
              {editingToggled
                ?
                (
                  <RadioGroup
                    onChange={this.onRadioGroupChange}
                    value={this.state.radioValue}
                    size="large"
                    defaultValue={DEFAULT_RADIO_VALUE}
                  >
                    {betBalance.map((entry, index) => (
                      <Radio value={index + 1} key={entry.name}>
                        <ProgressBar
                          label={entry.name}
                          value={entry.value}
                          percent={entry.percent}
                          barHeight={12}
                          info
                        />
                      </Radio>))
                    }
                  </RadioGroup>
                )
                :
                betBalance.map((entry) => (
                  <ProgressBar
                    key={entry.name}
                    label={entry.name}
                    value={entry.value}
                    percent={entry.percent}
                    barHeight={12}
                    info
                    marginBottom={18}
                  />))
              }
            </CardVoting>
          </IsoWidgetsWrapper>
        </Col>

      </Row>);

    return (
      <LayoutContentWrapper className="horizontalWrapper" style={{ minHeight: '100vh' }}>
        <Row style={{ width: '100%', height: '48px' }}>
          <Breadcrumb style={{ fontSize: '16px' }}>
            <Breadcrumb.Item><Link to="/">Event</Link></Breadcrumb.Item>
            <Breadcrumb.Item>{breadcrumbLabel}</Breadcrumb.Item>
          </Breadcrumb>
        </Row>
        <Row style={{ width: '100%' }}>
          {oracleElement}
        </Row>
      </LayoutContentWrapper>
    );
  }
}

OraclePage.propTypes = {
  onGetOracles: PropTypes.func,
  getOraclesSuccess: PropTypes.oneOfType([
    PropTypes.array, // Result array
    PropTypes.string, // error message
    PropTypes.bool, // No result
  ]),
  // getOraclesError: PropTypes.string,
  editingToggled: PropTypes.bool,
  match: PropTypes.object.isRequired,
  onBet: PropTypes.func,
  onVote: PropTypes.func,
  onApprove: PropTypes.func,
  onAllowance: PropTypes.func,
  allowanceReturn: PropTypes.object,
  onClearRequestReturn: PropTypes.func,
  onSetResult: PropTypes.func,
  onFinalizeResult: PropTypes.func,
  onGetBlockCount: PropTypes.func,
  requestReturn: PropTypes.object,
  finalizeResultReturn: PropTypes.object,
  walletAddrs: PropTypes.array,
  walletAddrsIndex: PropTypes.number,
  blockCount: PropTypes.number,
};

OraclePage.defaultProps = {
  onGetOracles: undefined,
  getOraclesSuccess: [],
  // getOraclesError: '',
  editingToggled: false,
  onBet: undefined,
  onVote: undefined,
  onApprove: undefined,
  onAllowance: undefined,
  allowanceReturn: undefined,
  onSetResult: undefined,
  onFinalizeResult: undefined,
  onClearRequestReturn: undefined,
  onGetBlockCount: undefined,
  requestReturn: undefined,
  finalizeResultReturn: undefined,
  walletAddrs: [],
  walletAddrsIndex: 0,
  blockCount: 0,
};

const mapStateToProps = (state) => ({
  getOraclesSuccess: state.Dashboard.get('allOraclesSuccess') && state.Dashboard.get('allOraclesValue'),
  // getOraclesError: !state.Dashboard.get('allOraclesSuccess') && state.Dashboard.get('allOraclesValue'),
  editingToggled: state.Topic.get('toggled'),
  requestReturn: state.Topic.get('req_return'),
  finalizeResultReturn: state.Topic.get('finalize_result_return'),
  allowanceReturn: state.Topic.get('allowance_return'),
  walletAddrs: state.App.get('walletAddrs'),
  walletAddrsIndex: state.App.get('walletAddrsIndex'),
  blockCount: state.App.get('get_block_count_return') && state.App.get('get_block_count_return').result,
});

function mapDispatchToProps(dispatch) {
  return {
    onGetOracles: () => dispatch(dashboardActions.getOracles()),
    onBet: (contractAddress, index, amount, senderAddress) =>
      dispatch(topicActions.onBet(contractAddress, index, amount, senderAddress)),
    onClearRequestReturn: () => dispatch(topicActions.onClearRequestReturn()),
    onVote: (contractAddress, resultIndex, botAmount, senderAddress) =>
      dispatch(topicActions.onVote(contractAddress, resultIndex, botAmount, senderAddress)),
    onApprove: (spender, value, senderAddress) => dispatch(topicActions.onApprove(spender, value, senderAddress)),
    onAllowance: (owner, spender, senderAddress) => dispatch(topicActions.onAllowance(owner, spender, senderAddress)),
    onSetResult: (contractAddress, resultIndex, senderAddress) =>
      dispatch(topicActions.onSetResult(contractAddress, resultIndex, senderAddress)),
    onFinalizeResult: (contractAddress, senderAddress) =>
      dispatch(topicActions.onFinalizeResult(contractAddress, senderAddress)),
    onGetBlockCount: () => dispatch(appActions.getBlockCount()),
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(OraclePage);
