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
const DEFAULT_RADIO_VALUE = 1;
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
      return _.map(oracle.options, (optionName, index) => {
        const optionAmount = oracle.amounts[index] || 0;
        return {
          name: optionName,
          value: `${optionAmount} ${oracle.token}`,
          percent: totalBalance === 0 ? totalBalance : _.floor((optionAmount / totalBalance) * 100),
        };
      });
    }

    return _.map(oracle.optionIdxs, (optIndex, index) => {
      const optionAmount = oracle.amounts[index] || 0;

      return {
        name: oracle.options[optIndex],
        value: `${optionAmount} ${oracle.token}`,
        percent: totalBalance === 0 ? totalBalance : _.floor((optionAmount / totalBalance) * 100),
      };
    });
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

    this.getRadioButtonViews = this.getRadioButtonViews.bind(this);
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
      allowanceReturn,
      blockCount,
      selectedWalletAddress,
    } = nextProps;

    const oracle = _.find(getOraclesSuccess, { address: this.state.address });

    if (oracle) {
      const { token, status, endBlock } = oracle;
      let config;

      /** Determine what config to use in current card * */
      if (status === 'VOTING' && token === QTUM) {
        config = {
          name: 'BETTING',
          breadcrumbLabel: 'Betting',
          cardInfo: {
            steps: {
              current: 1,
              value: [{
                title: 'Topic created',
                description: `Block No. ${oracle.blockNum}`,
              },
              {
                title: 'Betting',
                description: `Block No. ${oracle.blockNum + 1} - ${oracle.endBlock}`,
              },
              {
                title: 'Result Setting',
                description: `Block No. ${oracle.endBlock + 1} - ${oracle.resultSetEndBlock}`,
              },
              ],
            },
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
      } else if (status === 'WAITRESULT' && token === QTUM) {
        config = {
          name: 'SETTING',
          breadcrumbLabel: 'Setting',
          cardInfo: {
            steps: {
              current: 2,
              value: [{
                title: 'Topic created',
                description: `Block No. ${oracle.blockNum}`,
              },
              {
                title: 'Betting',
                description: `Block No. ${oracle.blockNum + 1} - ${oracle.endBlock}`,
              },
              {
                title: 'Result Setting',
                description: `Block No. ${oracle.endBlock + 1} - ${oracle.resultSetEndBlock}`,
              },
              ],
            },
            messages: [
              {
                text: `Result setter ${oracle.resultSetterAddress}`,
                type: 'default',
              },
              {
                text: `Consensus Threshold ${oracle.consensusThreshold || 0}. This value indicates the amount of BOT needed for result setting.`,
                type: 'default',
              },

              {
                text: 'Upon clicking Confirm, you will need to wait for BOT token to get approved. Those BOT amount will automatically be used to set result afterwards.',
                type: 'default',
              },
            ],
          },
          cardAction: {
            skipToggle: false,
            beforeToggle: {
              btnText: 'Set Result',
              // btnDisabled: (oracle.resultSetterAddress !== selectedWalletAddress),
            },
            afterToggle: {
              showAmountInput: false,
              btnText: 'Confirm',
            },
          },
        };

        // Add a message to CardInfo to warn that current block has passed set end block
        if (blockCount > oracle.resultSetEndBlock) {
          config.cardInfo.messages.push({
            text: 'Current block number has passed result set end block.',
            type: 'warn',
          });
        }

        // Add a message to CardInfo to warn that user is not result setter of current oracle
        if (oracle.resultSetterAddress !== selectedWalletAddress) {
          config.cardInfo.messages.push({
            text: 'You are not the result setter for this topic and cannot set result.',
            type: 'warn',
          });
        }
      } else if (status === 'VOTING' && token === BOT) {
        const relatedOracles = _.filter(getOraclesSuccess, (item) => item.topicAddress === oracle.topicAddress);
        const centralizedOracle = _.find(relatedOracles, (item) => item.token === QTUM);

        config = {
          name: 'VOTING',
          breadcrumbLabel: 'Votting',
          cardInfo: {
            steps: {
              current: 3,
              value: [{
                title: 'Topic created',
                description: `Block No. ${(centralizedOracle && centralizedOracle.blockNum) || ''}`,
              },
              {
                title: 'Betting',
                description: `Block No. ${(centralizedOracle && centralizedOracle.blockNum + 1) || ''} - ${(centralizedOracle && centralizedOracle.endBlock) || ''}`,
              },
              {
                title: 'Result Setting',
                description: `Block No. ${(centralizedOracle && centralizedOracle.endBlock + 1) || ''} - ${(centralizedOracle && centralizedOracle.resultSetEndBlock)}`,
              },
              {
                title: 'Voting',
                description: `Block No. ${oracle.blockNum} - ${oracle.endBlock}`,
              },
              ],
            },
            messages: [
              {
                text: `Consensus Threshold ${oracle.consensusThreshold || 0}. This value indicates the amount of BOT needed to fulfill current voting challenge.`,
                type: 'default',
              }, {
                text: 'BOT tokens are needed for Voting. Upon clicking Confirm, you will need to wait for BOT token to get approved. Those amount will automatically be used to Vote afterwards.',
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
      } else if (status === 'WAITRESULT' && token === BOT) {
        const relatedOracles = _.filter(getOraclesSuccess, (item) => {
          console.log(item.topicAddress, oracle.topicAddress);
          return item.topicAddress === oracle.topicAddress;
        });
        const centralizedOracle = _.find(relatedOracles, (item) => item.token === QTUM);
        const decentralizedOracles = _.orderBy(_.filter(relatedOracles, (item) => item.token === BOT), ['blockNum'], ['asc']);

        config = {
          name: 'FINALIZING',
          breadcrumbLabel: 'Voting',
          cardInfo: {
            steps: {
              current: 4,
              value: [{
                title: 'Topic created',
                description: `Block No. ${(centralizedOracle && centralizedOracle.blockNum) || ''}`,
              },
              {
                title: 'Betting',
                description: `Block No. ${(centralizedOracle && centralizedOracle.blockNum + 1) || ''} - ${(centralizedOracle && centralizedOracle.endBlock) || ''}`,
              },
              {
                title: 'Result Setting',
                description: `Block No. ${(centralizedOracle && centralizedOracle.endBlock + 1) || ''} - ${(centralizedOracle && centralizedOracle.resultSetEndBlock)}`,
              },
              ],
            },
            messages: [
            ],
          },
          cardAction: {
            skipToggle: true,
            beforeToggle: {
              btnText: 'Finalize',
            },
          },
        };

        // Add Steps from all Decentralized Oracles
        _.each(decentralizedOracles, (item) => {
          config.cardInfo.steps.value.push({
            title: 'Voting',
            description: `Block No. ${item.blockNum} - ${item.endBlock}`,
          });
        });

        // Add Step for Finalizing block
        config.cardInfo.steps.value.push({
          title: 'Finalizing',
          description: `Block No. ${oracle.endBlock + 1} - `,
        });

        if (blockCount > oracle.endBlock) {
          config.cardInfo.messages.push({
            text: `This oracles has passed Voting end block ${oracle.endBlock} and needs to be finalized.`,
            type: 'default',
          }, {
            text: 'Finalizing can be done by anybody. Once finalized oracle will enter Completed state and winning withdrawl will start.',
            type: 'default',
          });
        }
      } else {
        console.warn('Oracle exists but cant determine status.');
      }

      this.setState({
        oracle,
        config,
      });
    }

    if (allowanceReturn) {
      const parsedAllowance = parseInt(allowanceReturn.result.executionResult.output, 16);
      this.onAllowanceReturn(parsedAllowance);
    }

    // TODO: For any error case we will render an Oracle not found page
  }

  componentWillUnmount() {
    this.props.onClearRequestReturn();
    this.props.clearEditingToggled();

    clearTimeout(this.allowanceTimer);
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
      const { selectedWalletAddress } = this.props;

      this.props.onAllowance(selectedWalletAddress, this.state.oracle.topicAddress, selectedWalletAddress);
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
    const { onApprove, selectedWalletAddress } = this.props;
    const { oracle } = this.state;

    onApprove(oracle.topicAddress, amount, selectedWalletAddress);

    this.setState({
      approving: true,
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

    onVote(oracle.address, selectedIndex, amount, selectedWalletAddress);
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

  render() {
    const { editingToggled, requestReturn } = this.props;
    const { oracle, config } = this.state;

    if (!oracle) {
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
                checkingAllowance={this.state.checkingAllowance}
                skipToggle={config.name === 'FINALIZING'}
              >
                {editingToggled ? this.getRadioButtonViews(OraclePage.getBetOrVoteArray(oracle)) : this.getProgressBarViews(OraclePage.getBetOrVoteArray(oracle))}
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
  clearEditingToggled: PropTypes.func,
  requestReturn: PropTypes.object,
  selectedWalletAddress: PropTypes.string,
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
  requestReturn: undefined,
  clearEditingToggled: undefined,
  selectedWalletAddress: undefined,
  blockCount: 0,
};

const mapStateToProps = (state) => ({
  getOraclesSuccess: state.Dashboard.get('allOraclesSuccess') && state.Dashboard.get('allOraclesValue'),
  // getOraclesError: !state.Dashboard.get('allOraclesSuccess') && state.Dashboard.get('allOraclesValue'),
  editingToggled: state.Topic.get('toggled'),
  requestReturn: state.Topic.get('req_return'),
  allowanceReturn: state.Topic.get('allowance_return'),
  selectedWalletAddress: state.App.get('selected_wallet_address'),
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
    clearEditingToggled: () => dispatch(topicActions.clearEditingToggled()),
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(OraclePage);
