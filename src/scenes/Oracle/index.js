/* eslint react/no-array-index-key: 0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier

import React, { PropTypes } from 'react';
import { Row, Col, Breadcrumb, Radio } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import { CircularProgress } from 'material-ui/Progress';
import Button from 'material-ui/Button';
import Card, { CardHeader, CardMedia, CardContent, CardActions } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';

import StepperVertRight from '../../components/StepperVertRight/index';
import PredictionOption from './components/PredictionOption/index';
import PredictionInfo from './components/PredictionInfo/index';
import IsoWidgetsWrapper from '../Widgets/widgets-wrapper';
import dashboardActions from '../../redux/dashboard/actions';
import topicActions from '../../redux/topic/actions';
import { decimalToBotoshi } from '../../helpers/utility';
import { Token, OracleStatus } from '../../constants';
import styles from './styles';
import CardInfoUtil from '../../helpers/cardInfoUtil';

const RadioGroup = Radio.Group;
const DEFAULT_RADIO_VALUE = -1;
const ALLOWANCE_TIMER_INTERVAL = 10 * 1000;

class OraclePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      topicAddress: this.props.match.params.topicAddress,
      address: this.props.match.params.address,
      oracle: undefined,
      config: undefined,
      voteAmount: undefined,
      isApproving: false,
      isApproved: false,
      currentWalletIdx: this.props.walletAddrsIndex,
      currentOptionIdx: -1,
    };

    this.handleConfirmClick = this.handleConfirmClick.bind(this);
    this.executeOraclesRequest = this.executeOraclesRequest.bind(this);
    this.constructOracleAndConfig = this.constructOracleAndConfig.bind(this);
    this.startCheckAllowance = this.startCheckAllowance.bind(this);
    this.onAllowanceReturn = this.onAllowanceReturn.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleWalletChange = this.handleWalletChange.bind(this);
    this.bet = this.bet.bind(this);
    this.setResult = this.setResult.bind(this);
    this.vote = this.vote.bind(this);
    this.finalizeResult = this.finalizeResult.bind(this);
  }

  componentWillMount() {
    this.executeOraclesRequest();
  }

  componentWillReceiveProps(nextProps) {
    const {
      getOraclesSuccess,
      allowanceReturn,
      syncBlockTime,
    } = nextProps;

    // Update page on new block
    if (syncBlockTime !== this.props.syncBlockTime) {
      this.executeOraclesRequest();
    }

    this.constructOracleAndConfig(getOraclesSuccess, syncBlockTime);

    // Check allowance return; do nothing if undefined
    this.onAllowanceReturn(allowanceReturn);
  }

  componentWillUnmount() {
    this.props.onClearRequestReturn();
  }

  render() {
    const { requestReturn, classes } = this.props;
    const { oracle, config } = this.state;

    if (!oracle || !config) {
      // Don't render anything if page is loading.
      // In future we could make a loading animation
      return <div></div>;
    }

    /*
    const oracleElement = (
      <Row gutter={28} justify="center">

        {config.predictionInfo ?
          <Col xl={12} lg={12}>
            <IsoWidgetsWrapper padding="32px" >
              <CardInfo
                title={oracle.name}
                config={config.predictionInfo}
              >
              </CardInfo>
            </IsoWidgetsWrapper>
          </Col> : null}

        {config.predictionAction ?
          <Col xl={12} lg={12}>
            <IsoWidgetsWrapper padding="32px">
              <CardVoting
                amount={totalBalance}
                config={config.predictionAction}
                token={token}
                voteBalance={betBalance}
                onSubmit={this.handleConfirmClick}
                radioIndex={this.state.currentOptionIdx}
                result={requestReturn}
                isApproving={this.state.isApproving}
                skipExpansion={config.name === 'FINALIZING'}
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
    */

    const predictionOptions = OraclePage.getBetOrVoteArray(oracle);

    return (
      <Paper className={classes.predictionDetailPaper}>
        <Grid container spacing={0}>
          <Grid item xs={12} md={8} className={classes.predictionDetailContainerGrid}>
            <Typography variant="display1" className={classes.predictionDetailTitle}>
              {oracle.name}
            </Typography>
            <Grid item xs={12} lg={9}>
              {predictionOptions.map((item, index) => (
                <PredictionOption
                  isLast={index === predictionOptions.length - 1}
                  currentOptionIdx={this.state.currentOptionIdx}
                  optionIdx={index}
                  name={item.name}
                  amount={item.value}
                  percent={item.percent}
                  voteAmount={this.state.voteAmount}
                  token={oracle.token}
                  walletAddrs={this.props.walletAddrs}
                  currentWalletIdx={this.state.currentWalletIdx}
                  onOptionChange={this.handleOptionChange}
                  onAmountChange={this.handleAmountChange}
                  onWalletChange={this.handleWalletChange}
                />
              ))}
              <Button
                variant="raised"
                fullWidth
                size="large"
                color="primary"
                aria-label="add"
                disabled={config.predictionAction.btnDisabled || this.state.currentOptionIdx === -1}
                onClick={this.handleConfirmClick}
                className={classes.predictButton}
              >
                {
                  this.state.isApproving ?
                    <CircularProgress className={classes.progress} size={30} style={{ color: 'white' }} /> :
                    config.predictionAction.btnText
                }
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={12} md={4} className={classNames(classes.predictionDetailContainerGrid, 'right')}>
            <PredictionInfo oracle={oracle} className={classes.predictionDetailInfo} />
            <StepperVertRight steps={config.predictionInfo.steps} />
          </Grid>
        </Grid>
      </Paper>
    );
  }

  handleOptionChange(idx) {
    this.setState({ currentOptionIdx: idx });
  }

  handleAmountChange(amount) {
    this.setState({ voteAmount: amount });
  }

  handleWalletChange(idx) {
    this.setState({ currentWalletIdx: idx });
  }

  handleConfirmClick() {
    const amount = this.state.voteAmount;

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

  getCurrentWalletAddr() {
    return this.props.walletAddrs[this.state.currentWalletIdx];
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

  executeOraclesRequest() {
    this.props.getOracles([
      { topicAddress: this.state.topicAddress },
    ]);
  }

  constructOracleAndConfig(getOraclesSuccess, syncBlockTime) {
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
          predictionInfo: {
            steps: CardInfoUtil.getSteps(syncBlockTime, oracle),
            messages: [
            ],
          },
          predictionAction: {
            skipExpansion: false,
            btnText: 'Bet',
            showAmountInput: true,
          },
        };
      } else if (token === Token.Qtum && (status === OracleStatus.WaitResult || status === OracleStatus.OpenResultSet)) {
        config = {
          name: 'SETTING',
          breadcrumbLabel: 'Setting',
          predictionInfo: {
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
          predictionAction: {
            skipExpansion: false,
            btnText: 'Set Result',
            btnDisabled: oracle.status === OracleStatus.WaitResult && oracle.resultSetterQAddress !== this.getCurrentWalletAddr(),
            showAmountInput: false,
          },
        };

        // Add a message to CardInfo to warn that current block has passed set end block
        if (syncBlockTime > oracle.resultSetEndTime) {
          config.predictionInfo.messages.push({
            text: 'Current block time has passed the Result Setting End Time.',
            type: 'warn',
          });
        }

        // Add a message to CardInfo to warn that user is not result setter of current oracle
        if (status === OracleStatus.WaitResult && oracle.resultSetterQAddress !== this.getCurrentWalletAddr()) {
          config.predictionInfo.messages.push({
            text: 'You are not the Centralized Oracle for this Topic and cannot set the result.',
            type: 'warn',
          });
        } else if (status === OracleStatus.OpenResultSet) {
          config.predictionInfo.messages.push({
            text: 'The Centralized Oracle has not set the result yet, but you may set the result by staking BOT.',
            type: 'warn',
          });
        }
      } else if (token === Token.Bot && status === OracleStatus.Voting) {
        config = {
          name: 'VOTING',
          breadcrumbLabel: 'Voting',
          predictionInfo: {
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
          predictionAction: {
            skipExpansion: false,
            btnText: 'Vote',
            showAmountInput: true,
          },
        };
      } else if (token === Token.Bot && status === OracleStatus.WaitResult) {
        config = {
          name: 'FINALIZING',
          breadcrumbLabel: 'Voting',
          predictionInfo: {
            steps: CardInfoUtil.getSteps(syncBlockTime, centralizedOracle, decentralizedOracles),
            messages: [
            ],
          },
          predictionAction: {
            skipExpansion: true,
            btnText: 'Finalize',
            showAmountInput: false,
          },
        };

        if (syncBlockTime > oracle.endTime) {
          config.predictionInfo.messages.push({
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
  }

  /**
   * Send get allowance request and keep repeating itself until this.state.isApproving is false
   * @return {[type]}
   */
  startCheckAllowance() {
    const { oracle } = this.state;
    const { onAllowance } = this.props;
    const self = this;

    // A function to repeat itself until this.state.isApproving is false
    function startPollAllowance() {
      if (self.state.isApproving) {
        onAllowance(self.getCurrentWalletAddr(), oracle.topicAddress, self.getCurrentWalletAddr());
        setTimeout(startPollAllowance, ALLOWANCE_TIMER_INTERVAL);
      }
    }

    // Kick off the first round of onAllowance
    onAllowance(self.getCurrentWalletAddr(), oracle.topicAddress, self.getCurrentWalletAddr());
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
    const { onApprove } = this.props;
    const { oracle } = this.state;

    onApprove(oracle.address, oracle.topicAddress, decimalToBotoshi(amount), this.getCurrentWalletAddr());

    this.setState({
      isApproving: true,
    });
  }

  bet(amount) {
    const { onBet } = this.props;
    const { oracle, currentOptionIdx } = this.state;
    const selectedIndex = oracle.optionIdxs[currentOptionIdx - 1];

    onBet(oracle.address, selectedIndex, amount, this.getCurrentWalletAddr());
  }

  setResult() {
    const { onSetResult } = this.props;
    const { oracle, currentOptionIdx } = this.state;
    const selectedIndex = oracle.optionIdxs[currentOptionIdx - 1];

    onSetResult(oracle.address, selectedIndex, oracle.consensusThreshold, this.getCurrentWalletAddr());
  }

  vote(amount) {
    const { onVote } = this.props;
    const { oracle, currentOptionIdx } = this.state;
    const selectedIndex = oracle.optionIdxs[currentOptionIdx - 1];

    onVote(oracle.address, selectedIndex, decimalToBotoshi(amount), this.getCurrentWalletAddr());
  }

  finalizeResult() {
    const { onFinalizeResult } = this.props;
    const { oracle } = this.state;

    onFinalizeResult(oracle.address, this.getCurrentWalletAddr());
  }
}

OraclePage.propTypes = {
  getOracles: PropTypes.func,
  getOraclesSuccess: PropTypes.oneOfType([
    PropTypes.array, // Result array
    PropTypes.string, // error message
    PropTypes.bool, // No result
  ]),
  match: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  onBet: PropTypes.func,
  onVote: PropTypes.func,
  onApprove: PropTypes.func,
  onAllowance: PropTypes.func,
  allowanceReturn: PropTypes.number,
  clearAllowanceReturn: PropTypes.func,
  onClearRequestReturn: PropTypes.func,
  onSetResult: PropTypes.func,
  onFinalizeResult: PropTypes.func,
  requestReturn: PropTypes.object,
  syncBlockTime: PropTypes.number,
  walletAddrs: PropTypes.array,
  walletAddrsIndex: PropTypes.number,
};

OraclePage.defaultProps = {
  getOracles: undefined,
  getOraclesSuccess: [],
  onBet: undefined,
  onVote: undefined,
  onApprove: undefined,
  onAllowance: undefined,
  allowanceReturn: undefined,
  onSetResult: undefined,
  onFinalizeResult: undefined,
  onClearRequestReturn: undefined,
  requestReturn: undefined,
  clearAllowanceReturn: undefined,
  syncBlockTime: undefined,
  walletAddrs: [],
  walletAddrsIndex: 1,
};

const mapStateToProps = (state) => ({
  walletAddrs: state.App.get('walletAddrs'),
  walletAddrsIndex: state.App.get('walletAddrsIndex'),
  getOraclesSuccess: state.Dashboard.get('allOraclesSuccess') && state.Dashboard.get('allOraclesValue'),
  requestReturn: state.Topic.get('req_return'),
  allowanceReturn: state.Topic.get('allowance_return'),
  syncBlockTime: state.App.get('syncBlockTime'),
});

function mapDispatchToProps(dispatch) {
  return {
    getOracles: (filters) => dispatch(dashboardActions.getOracles(filters)),
    onClearRequestReturn: () => dispatch(topicActions.onClearRequestReturn()),
    onBet: (contractAddress, index, amount, senderAddress) =>
      dispatch(topicActions.onBet(contractAddress, index, amount, senderAddress)),
    onVote: (contractAddress, resultIndex, botAmount, senderAddress) =>
      dispatch(topicActions.onVote(contractAddress, resultIndex, botAmount, senderAddress)),
    onApprove: (contractAddress, spender, value, senderAddress) =>
      dispatch(topicActions.onApprove(contractAddress, spender, value, senderAddress)),
    onAllowance: (owner, spender, senderAddress) => dispatch(topicActions.onAllowance(owner, spender, senderAddress)),
    onSetResult: (contractAddress, resultIndex, consensusThreshold, senderAddress) =>
      dispatch(topicActions.onSetResult(contractAddress, resultIndex, consensusThreshold, senderAddress)),
    onFinalizeResult: (contractAddress, senderAddress) =>
      dispatch(topicActions.onFinalizeResult(contractAddress, senderAddress)),
    clearAllowanceReturn: () => dispatch(topicActions.clearAllowanceReturn()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(OraclePage));
