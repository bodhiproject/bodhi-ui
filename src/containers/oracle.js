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
import topicActions from '../redux/topic/actions';
import { decimalToBotoshi } from '../helpers/utility';
import { Token, OracleStatus } from '../constants';
import CardInfoUtil from '../helpers/cardInfoUtil';

const RadioGroup = Radio.Group;
const DEFAULT_RADIO_VALUE = 0;
const ALLOWANCE_TIMER_INTERVAL = 10 * 1000;

class OraclePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      topicAddress: this.props.match.params.topicAddress,
      address: this.props.match.params.address,
      oracle: undefined,
      radioValue: DEFAULT_RADIO_VALUE, // Selected index of optionsIdx[]
      config: undefined,
      voteAmount: undefined,
      isApproving: false,
      isApproved: false,
    };

    this.getRadioButtonViews = this.getRadioButtonViews.bind(this);
    this.onRadioGroupChange = this.onRadioGroupChange.bind(this);
    this.onConfirmBtnClicked = this.onConfirmBtnClicked.bind(this);
    this.startCheckAllowance = this.startCheckAllowance.bind(this);
    this.onAllowanceReturn = this.onAllowanceReturn.bind(this);
    this.bet = this.bet.bind(this);
    this.setResult = this.setResult.bind(this);
    this.vote = this.vote.bind(this);
    this.finalizeResult = this.finalizeResult.bind(this);
  }

  componentWillMount() {
    this.props.onGetOracles([
      { topicAddress: this.state.topicAddress },
    ]);
  }

  componentWillReceiveProps(nextProps) {
    const {
      getOraclesSuccess,
      allowanceReturn,
      syncBlockTime,
      selectedWalletAddress,
    } = nextProps;

    const oracle = _.find(getOraclesSuccess, { address: this.state.address });
    const centralizedOracle = _.find(getOraclesSuccess, { token: Token.Qtum });
    const decentralizedOracles = _.orderBy(_.filter(getOraclesSuccess, { token: Token.Bot }), ['blockNum'], ['asc']);

    if (oracle) {
      const { token, status } = oracle;
      let config;

      /** Determine what config to use in current card * */
      if (token === Token.Qtum && status === OracleStatus.Voting) {
        config = {
          name: 'BETTING',
          breadcrumbLabel: 'Betting',
          cardInfo: {
            steps: CardInfoUtil.getSteps(syncBlockTime, oracle),
            messages: [
            ],
          },
          cardAction: {
            skipToggle: false,
            beforeToggle: {
              btnText: 'Bet',
            },
            afterToggle: {
              showAmountInput: true,
              btnText: 'Confirm',
            },
          },
        };
      } else if (token === Token.Qtum && (status === OracleStatus.WaitResult || status === OracleStatus.OpenResultSet)) {
        config = {
          name: 'SETTING',
          breadcrumbLabel: 'Setting',
          cardInfo: {
            steps: CardInfoUtil.getSteps(syncBlockTime, oracle),
            messages: [
              {
                text: `Result setter ${oracle.resultSetterQAddress || ''}`,
                type: 'default',
              },
              {
                text: `Consensus Threshold ${oracle.consensusThreshold || ''}. This value indicates the amount of BOT 
                  needed to set the result.`,
                type: 'default',
              },
              {
                text: `BOT tokens are needed for result setting. Don't leave this screen upon clicking Confirm. 
                  Your BOT needs to be approved before result setting. The approved amount will automatically be used to 
                  set the result after approval.`,
                type: 'default',
              },
            ],
          },
          cardAction: {
            skipToggle: false,
            beforeToggle: {
              btnText: 'Set Result',
              btnDisabled: oracle.status === OracleStatus.WaitResult && oracle.resultSetterQAddress !== selectedWalletAddress,
            },
            afterToggle: {
              showAmountInput: false,
              btnText: 'Confirm',
            },
          },
        };

        // Add a message to CardInfo to warn that current block has passed set end block
        if (syncBlockTime > oracle.resultSetEndTime) {
          config.cardInfo.messages.push({
            text: 'Current block time has passed the Result Setting End Time.',
            type: 'warn',
          });
        }

        // Add a message to CardInfo to warn that user is not result setter of current oracle
        if (status === OracleStatus.WaitResult && oracle.resultSetterQAddress !== selectedWalletAddress) {
          config.cardInfo.messages.push({
            text: 'You are not the Centralized Oracle for this Topic and cannot set the result.',
            type: 'warn',
          });
        } else if (status === OracleStatus.OpenResultSet) {
          config.cardInfo.messages.push({
            text: 'The Centralized Oracle has not set the result yet, but you may set the result by staking BOT.',
            type: 'warn',
          });
        }
      } else if (token === Token.Bot && status === OracleStatus.Voting) {
        config = {
          name: 'VOTING',
          breadcrumbLabel: 'Voting',
          cardInfo: {
            steps: CardInfoUtil.getSteps(syncBlockTime, centralizedOracle, decentralizedOracles),
            messages: [
              {
                text: `Consensus Threshold ${oracle.consensusThreshold || ''}. This value indicates the amount of BOT 
                  needed to reach the Proof of Agreement and become the new result.`,
                type: 'default',
              }, {
                text: `BOT tokens are needed for voting. Don't leave this screen upon clicking Confirm. Your BOT needs 
                  to be approved before voting. The approved amount will automatically be used to vote afterwards.`,
                type: 'default',
              },
            ],
          },
          cardAction: {
            skipToggle: false,
            beforeToggle: {
              btnText: 'Vote',
            },
            afterToggle: {
              showAmountInput: true,
              btnText: 'Confirm',
            },
          },
        };
      } else if (token === Token.Bot && status === OracleStatus.WaitResult) {
        config = {
          name: 'FINALIZING',
          breadcrumbLabel: 'Voting',
          cardInfo: {
            steps: CardInfoUtil.getSteps(syncBlockTime, centralizedOracle, decentralizedOracles),
            messages: [
            ],
          },
          cardAction: {
            skipToggle: true,
            afterToggle: {
              btnText: 'Finalize',
            },
          },
        };

        if (syncBlockTime > oracle.endTime) {
          config.cardInfo.messages.push({
            text: `Current block time has passed the Voting End Time. 
              The previous result needs to be finalized in order to withdraw.`,
            type: 'default',
          }, {
            text: `Finalizing can be done by anyone. 
              Once finalized, winners can withdraw from the event in the Withdraw tab.`,
            type: 'default',
          });
        }
      }

      this.setState({
        oracle,
        config,
      });
    }

    // Check allowance return; do nothing if undefined
    this.onAllowanceReturn(allowanceReturn);
  }

  componentWillUnmount() {
    this.props.onClearRequestReturn();
    this.props.clearEditingToggled();
  }

  render() {
    const { editingToggled, requestReturn } = this.props;
    const { oracle, config } = this.state;

    if (!oracle || !config) {
      // Don't render anything if page is loading. In future we could make a loading animation
      return <div></div>;
    }

    const totalBalance = _.sum(oracle.amounts);
    const { token } = oracle;

    const betBalance = OraclePage.getBetOrVoteArray(oracle);
    const breadcrumbLabel = config && config.breadcrumbLabel;

    const oracleElement = (
      <Row gutter={28} justify="center">

        {config.cardInfo ?
          <Col xl={12} lg={12}>
            <IsoWidgetsWrapper padding="32px" >
              <CardInfo
                title={oracle.name}
                config={config.cardInfo}
              >
              </CardInfo>
            </IsoWidgetsWrapper>
          </Col> : null}

        {config.cardAction ?
          <Col xl={12} lg={12}>
            <IsoWidgetsWrapper padding="32px">
              <CardVoting
                amount={totalBalance}
                config={config.cardAction}
                token={token}
                voteBalance={betBalance}
                onSubmit={this.onConfirmBtnClicked}
                radioIndex={this.state.radioValue}
                result={requestReturn}
                isApproving={this.state.isApproving}
                skipToggle={config.name === 'FINALIZING'}
              >
                {editingToggled
                  ? this.getRadioButtonViews(OraclePage.getBetOrVoteArray(oracle))
                  : this.getProgressBarViews(OraclePage.getBetOrVoteArray(oracle))}
              </CardVoting>
            </IsoWidgetsWrapper>
          </Col>
          : null}
      </Row>
    );

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

  /**
   * Get Bet or Vote names and balances from oracle
   * @param {object} oracle Oracle object
   * @return {array} {name, value, percent}
   */
  static getBetOrVoteArray(oracle) {
    const totalBalance = _.sum(oracle.amounts);

    if (oracle.token === Token.Qtum) {
      return _.map(oracle.options, (optionName, index) => {
        const optionAmount = oracle.amounts[index] || 0;
        return {
          name: optionName,
          value: `${optionAmount} ${oracle.token}`,
          percent: totalBalance === 0 ? totalBalance : _.round((optionAmount / totalBalance) * 100),
        };
      });
    }

    return _.map(oracle.optionIdxs, (optIndex) => {
      const optionAmount = oracle.amounts[optIndex] || 0;
      const threshold = oracle.consensusThreshold;

      return {
        name: oracle.options[optIndex],
        value: `${optionAmount} ${oracle.token}`,
        percent: threshold === 0 ? threshold : _.round((optionAmount / threshold) * 100),
      };
    });
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
          isApproved: false,
          voteAmount: this.state.oracle.consensusThreshold,
        });

        this.startCheckAllowance();
        break;
      }
      case 'VOTING': {
        this.setState({
          isApproved: false,
          voteAmount: amount,
        });

        this.startCheckAllowance();
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

  /**
   * Send get allowance request and keep repeating itself until this.state.isApproving is false
   * @return {[type]}
   */
  startCheckAllowance() {
    console.log('startCheckAllowance', new Date());
    const { selectedWalletAddress, onAllowance } = this.props;
    const { oracle } = this.state;

    const self = this;

    // A function to repeat itself until this.state.isApproving is false
    function startPollAllowance() {
      if (self.state.isApproving) {
        onAllowance(selectedWalletAddress, oracle.topicAddress, selectedWalletAddress);
        setTimeout(startPollAllowance, ALLOWANCE_TIMER_INTERVAL);
      }
    }

    // Kick off the first round of onAllowance
    onAllowance(selectedWalletAddress, oracle.topicAddress, selectedWalletAddress);
    setTimeout(startPollAllowance, ALLOWANCE_TIMER_INTERVAL);
  }

  /**
   * Determine next action based on returned allowance result
   * 1. If allowance is zero, send approve request
   * 2. If allowance is positive but less than voteAmount, send approve(0) to reset allowance
   * 3. If allowance is greather than or equal to voteAmount and not isApproved, 
   *    do action and reset isApproving and isApproved
   * @param  {number} allowance value
   * @return {}
   */
  onAllowanceReturn(allowance) {
    if (_.isUndefined(allowance) || _.isUndefined(this.state.config)) {
      return;
    }

    const { voteAmount } = this.state;
    const configName = this.state.config.name;

    if (allowance < voteAmount) {
      // Need to approved for setResult or vote
      if (this.state.isApproving) {
        return;
      }

      if (allowance === 0) {
        this.approve(voteAmount);
      } else {
        // Reset allowance value so it can hit allowance === 0 case
        this.approve(0);
      }
    } else if (!this.state.isApproved) {
      // Already approved. Call setResult or vote. Use isApproved to make sure this only entered once.
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

      // Reset allowance return and states for the next vote/setResult
      this.props.clearAllowanceReturn();

      this.setState({
        isApproving: false,
        isApproved: true,
        voteAmount: undefined,
      });
    }
  }

  approve(amount) {
    const { onApprove, selectedWalletAddress } = this.props;
    const { oracle } = this.state;

    onApprove(oracle.topicAddress, decimalToBotoshi(amount), selectedWalletAddress);

    this.setState({
      isApproving: true,
    });
  }

  bet(amount) {
    const { onBet, selectedWalletAddress } = this.props;
    const { oracle, radioValue } = this.state;
    const selectedIndex = oracle.optionIdxs[radioValue - 1];

    onBet(oracle.address, selectedIndex, amount, selectedWalletAddress);
  }

  setResult() {
    const { onSetResult, selectedWalletAddress } = this.props;
    const { oracle, radioValue } = this.state;
    const selectedIndex = oracle.optionIdxs[radioValue - 1];

    onSetResult(oracle.address, selectedIndex, selectedWalletAddress);
  }

  vote(amount) {
    const { onVote, selectedWalletAddress } = this.props;
    const { oracle, radioValue } = this.state;
    const selectedIndex = oracle.optionIdxs[radioValue - 1];

    onVote(oracle.address, selectedIndex, decimalToBotoshi(amount), selectedWalletAddress);
  }

  finalizeResult() {
    const { onFinalizeResult, selectedWalletAddress } = this.props;
    const { oracle } = this.state;

    onFinalizeResult(oracle.address, selectedWalletAddress);
  }

  getRadioButtonViews(valueArray) {
    return (
      <RadioGroup
        onChange={this.onRadioGroupChange}
        value={this.state.radioValue}
        size="large"
        defaultValue={DEFAULT_RADIO_VALUE}
      >
        {valueArray.map((entry, index) => (
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
    );
  }

  getProgressBarViews(valueArray) {
    return valueArray.map((entry, index) => (
      <ProgressBar
        key={`option ${index}`}
        label={entry.name}
        value={entry.value}
        percent={entry.percent}
        barHeight={12}
        info
        marginBottom={18}
      />
    ));
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
  allowanceReturn: PropTypes.number,
  onClearRequestReturn: PropTypes.func,
  onSetResult: PropTypes.func,
  onFinalizeResult: PropTypes.func,
  clearEditingToggled: PropTypes.func,
  clearAllowanceReturn: PropTypes.func,
  requestReturn: PropTypes.object,
  selectedWalletAddress: PropTypes.string,
  syncBlockTime: PropTypes.number,
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
  requestReturn: undefined,
  clearEditingToggled: undefined,
  clearAllowanceReturn: undefined,
  selectedWalletAddress: undefined,
  syncBlockTime: undefined,
};

const mapStateToProps = (state) => ({
  getOraclesSuccess: state.Dashboard.get('allOraclesSuccess') && state.Dashboard.get('allOraclesValue'),
  // getOraclesError: !state.Dashboard.get('allOraclesSuccess') && state.Dashboard.get('allOraclesValue'),
  editingToggled: state.Topic.get('toggled'),
  requestReturn: state.Topic.get('req_return'),
  allowanceReturn: state.Topic.get('allowance_return'),
  selectedWalletAddress: state.App.get('selected_wallet_address'),
  syncBlockTime: state.App.get('syncBlockTime'),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetOracles: (filters) => dispatch(dashboardActions.getOracles(filters)),
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
    clearEditingToggled: () => dispatch(topicActions.clearEditingToggled()),
    clearAllowanceReturn: () => dispatch(topicActions.clearAllowanceReturn()),
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(OraclePage);
