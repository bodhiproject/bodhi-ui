/* eslint react/no-array-index-key: 0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier

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

const RadioGroup = Radio.Group;
const QTUM = 'QTUM';
const BOT = 'BOT';
const DEFAULT_RADIO_VALUE = 0;
const ORACLE_BOT_THRESHOLD = 10000000000; // Botoshi
const SUB_REQ_DELAY = 60 * 1000; // Delay subsequent request by 60 sec
const ALLOWANCE_TIMER_INTERVAL = 10 * 1000;

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

let allowanceTimer;

class OraclePage extends React.Component {
  /**
   * Determine OracleType; default DECENTRALISED
   * @param  {object} oracle Oracle object
   * @return {string}        OracleType
   */
  static getOracleType(oracle) {
    switch (oracle.token) {
      case QTUM:
        return OracleType.CENTRALISED;
      case BOT:
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
      checkingAllowance: false,
      approving: false,
    };

    this.getCurrentSenderAddress = this.getCurrentSenderAddress.bind(this);
    this.onRadioGroupChange = this.onRadioGroupChange.bind(this);
    this.onConfirmBtnClicked = this.onConfirmBtnClicked.bind(this);
    this.checkAllowance = this.checkAllowance.bind(this);
    this.onAllowanceReturn = this.onAllowanceReturn.bind(this);
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

  componentDidMount() {
    // Start repeating allowance requests timer
    const check = function () {
      if (this.state.checkingAllowance) {
        this.checkAllowance();
      }
      this.allowanceTimer = setTimeout(check, ALLOWANCE_TIMER_INTERVAL);
    }.bind(this);
    check();
  }

  componentWillReceiveProps(nextProps) {
    const {
      getOraclesSuccess,
      finalizeResultReturn,
      allowanceReturn,
      blockCount,
    } = nextProps;

    console.log(`blockCount: ${blockCount}`);

    if (!_.isEmpty(getOraclesSuccess)) {
      let oracle = _.find(getOraclesSuccess, { address: this.state.address });

      if (oracle) {
        const { token, status, endBlock } = oracle;
        let configName;

        /** Determine what config to use in current card * */
        switch (status) {
          case 'VOTING': {
            switch (token) {
              case QTUM: {
                configName = 'BETTING';
                break;
              }
              case BOT: {
                configName = 'VOTING';
                break;
              }
              default: {
                console.warn('Invalid oracle type');
                oracle = undefined;
                break;
              }
            }
            break;
          }
          case 'WAITRESULT': {
            switch (token) {
              case QTUM: {
                configName = 'SETTING';
                break;
              }
              case BOT: {
                configName = 'FINALIZING';
                break;
              }
              default: {
                console.warn('Invalid oracle type');
                oracle = undefined;
                break;
              }
            }
            break;
          }
          default: {
            console.warn('Oracle exists but cant determine status.');
            oracle = undefined;
            break;
          }
        }

        // console.log('oracle', oracle);
        // console.log(`configName: ${configName}`);

        this.setState({
          oracle,
          config: _.find(PageConfig, { name: configName }),
        });
      }
    }

    if (allowanceReturn) {
      const parsedAllowance = parseInt(allowanceReturn.result.executionResult.output, 16);
      this.onAllowanceReturn(parsedAllowance);
    }

    if (finalizeResultReturn) {
      console.log('finalizeResultReturn', finalizeResultReturn);
    }

    // TODO: For any error case we will render an Oracle not found page
  }

  componentWillUnmount() {
    this.props.onClearRequestReturn();
    clearTimeout(this.allowanceTimer);
  }

  /** Return selected address on Topbar as sender; empty string if not found * */
  getCurrentSenderAddress() {
    const { walletAddrs, walletAddrsIndex } = this.props;

    if (!_.isEmpty(walletAddrs)
      && walletAddrsIndex < walletAddrs.length
      && !_.isUndefined(walletAddrs[walletAddrsIndex])) {
      return walletAddrs[walletAddrsIndex].address;
    }

    return '';
  }

  onRadioGroupChange(evt) {
    this.setState({
      radioValue: evt.target.value,
    });
  }

  onConfirmBtnClicked(obj) {
    const { amount } = obj;

    switch (this.state.config.name) {
      case 'BETTING': {
        this.bet(amount);
        break;
      }
      case 'SETTING': {
        this.setState({
          checkingAllowance: true,
          voteAmount: ORACLE_BOT_THRESHOLD,
        });
        break;
      }
      case 'VOTING': {
        this.setState({
          checkingAllowance: true,
          voteAmount: amount,
        });
        break;
      }
      case 'FINALIZING': {
        this.finalizeResult();
        break;
      }
      default: {
        // TODO: oracle not found page
        break;
      }
    }
  }

  checkAllowance() {
    try {
      const senderAddress = this.getCurrentSenderAddress();
      this.props.onAllowance(senderAddress, this.state.oracle.topicAddress, senderAddress);
    } catch (err) {
      console.log(err.message);
    }
  }

  onAllowanceReturn(allowance) {
    const { voteAmount } = this.state;
    const configName = this.state.config.name;

    if (allowance === 0) { // Need to approved for setResult or vote
      if (this.state.approving) {
        return;
      }
      this.approve(voteAmount);
    } else if (allowance >= voteAmount) { // Already approved call setResult or vote
      switch (configName) {
        case 'SETTING': {
          this.setResult();
          break;
        }
        case 'VOTING': {
          this.vote(voteAmount);
          break;
        }
        default: {
          break;
        }
      }

      this.setState({
        checkingAllowance: false,
        approving: false,
        voteAmount: undefined,
      });
    } else { // The approved amount does not match the amount so reset allowance
      if (this.state.approving) {
        return;
      }
      this.approve(0);
    }
  }

  approve(amount) {
    const { onApprove } = this.props;
    const { oracle } = this.state;
    const senderAddress = this.getCurrentSenderAddress();

    onApprove(oracle.topicAddress, amount, senderAddress);

    this.setState({
      approving: true,
    });
  }

  bet(amount) {
    const { onBet } = this.props;
    const { oracle, radioValue } = this.state;
    const selectedIndex = oracle.optionIdxs[radioValue - 1];
    const senderAddress = this.getCurrentSenderAddress();

    onBet(oracle.address, selectedIndex, amount, senderAddress);
  }

  setResult() {
    const { onSetResult } = this.props;
    const { oracle, radioValue } = this.state;
    const selectedIndex = oracle.optionIdxs[radioValue - 1];
    const senderAddress = this.getCurrentSenderAddress();

    onSetResult(oracle.address, selectedIndex, senderAddress);
  }

  vote(amount) {
    const { onVote } = this.props;
    const { oracle, radioValue } = this.state;
    const selectedIndex = oracle.optionIdxs[radioValue - 1];
    const senderAddress = this.getCurrentSenderAddress();

    onVote(oracle.address, selectedIndex, amount, senderAddress);
  }

  finalizeResult() {
    const { onFinalizeResult } = this.props;
    const { oracle } = this.state;
    const senderAddress = this.getCurrentSenderAddress();

    onFinalizeResult(oracle.address, senderAddress);
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
                      <Radio value={index + 1} key={`option ${index}`}>
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
                betBalance.map((entry, index) => (
                  <ProgressBar
                    key={`option ${index}`}
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
