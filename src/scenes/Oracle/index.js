/* eslint react/no-array-index-key: 0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import { CircularProgress } from 'material-ui/Progress';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';


import StepperVertRight from '../../components/StepperVertRight/index';
import PredictionOption from './components/PredictionOption/index';
import PredictionInfo from './components/PredictionInfo/index';
import PredictionCompleteDialog from './components/PredictionCompleteDialog/index';
import dashboardActions from '../../services/redux/dashboard/actions';
import topicActions from '../../services/redux/topic/actions';
import graphqlActions from '../../services/redux/graphql/actions';
import { decimalToBotoshi } from '../../helpers/utility';
import { Token, OracleStatus } from '../../constants';
import CardInfoUtil from '../../helpers/cardInfoUtil';
import styles from './styles';

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
    const { classes } = this.props;
    const { oracle, config } = this.state;

    if (!oracle || !config) {
      // Don't render anything if page is loading.
      // In future we could make a loading animation
      return <div></div>;
    }

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
                  key={index}
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
                  skipExpansion={config.predictionAction.skipExpansion}
                  showAmountInput={config.predictionAction.showAmountInput}
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
                disabled={
                  config.predictionAction.btnDisabled ||
                  this.state.currentOptionIdx === -1 ||
                  this.state.isApproving
                }
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
        <PredictionCompleteDialog requestReturn={this.props.requestReturn} />
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
        this.setResult();
        break;
      }
      case 'VOTING': {
        this.vote(amount);
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
    return this.props.walletAddrs[this.state.currentWalletIdx].address;
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
          breadcrumbLabel: <FormattedMessage id="topbar.betting" />,
          predictionInfo: {
            steps: CardInfoUtil.getSteps(syncBlockTime, oracle),
            messages: [
            ],
          },
          predictionAction: {
            skipExpansion: false,
            btnText: <FormattedMessage id="cardinfo.bet" />,
            showAmountInput: true,
          },
        };
      } else if (token === Token.Qtum && (status === OracleStatus.WaitResult || status === OracleStatus.OpenResultSet)) {
        config = {
          name: 'SETTING',
          breadcrumbLabel: <FormattedMessage id="topbar.setting" />,
          predictionInfo: {
            steps: CardInfoUtil.getSteps(syncBlockTime, oracle),
            messages: [
              {
                text: `${this.props.intl.formatMessage({ id: 'oracle.resultsetter' })} ${oracle.resultSetterQAddress || ''}`,
                type: 'default',
              },
              {
                text: `${this.props.intl.formatMessage({ id: 'oracle.consensus' }, { value: oracle.consensusThreshold || '' })}`,
                type: 'default',
              },
              {
                text: <FormattedMessage id="oracle.resultsetnote" />,
                type: 'default',
              },
            ],
          },
          predictionAction: {
            skipExpansion: false,
            btnText: <FormattedMessage id="cardinfo.setresult" />,
            btnDisabled: oracle.status === OracleStatus.WaitResult && oracle.resultSetterQAddress !== this.getCurrentWalletAddr(),
            showAmountInput: false,
          },
        };

        // Add a message to CardInfo to warn that current block has passed set end block
        if (syncBlockTime > oracle.resultSetEndTime) {
          config.predictionInfo.messages.push({
            text: <FormattedMessage id="oracle.pass" />,
            type: 'warn',
          });
        }

        // Add a message to CardInfo to warn that user is not result setter of current oracle
        if (status === OracleStatus.WaitResult && oracle.resultSetterQAddress !== this.getCurrentWalletAddr()) {
          config.predictionInfo.messages.push({
            text: <FormattedMessage id="oracle.notcen" />,
            type: 'warn',
          });
        } else if (status === OracleStatus.OpenResultSet) {
          config.predictionInfo.messages.push({
            text: <FormattedMessage id="oracle.openres" />,
            type: 'warn',
          });
        }
      } else if (token === Token.Bot && status === OracleStatus.Voting) {
        config = {
          name: 'VOTING',
          breadcrumbLabel: <FormattedMessage id="topbar.voting" />,
          predictionInfo: {
            steps: CardInfoUtil.getSteps(syncBlockTime, centralizedOracle, decentralizedOracles),
            messages: [
              {
                text: <FormattedMessage id="oracle.voting-1" value={oracle.consensusThreshold || ''} />,
                type: 'default',
              }, {
                text: <FormattedMessage id="oracle.votenote" />,
                type: 'default',
              },
            ],
          },
          predictionAction: {
            skipExpansion: false,
            btnText: <FormattedMessage id="cardinfo.vote" />,
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
            btnText: <FormattedMessage id="cardinfo.finalize" />,
            showAmountInput: false,
          },
        };

        if (syncBlockTime > oracle.endTime) {
          config.predictionInfo.messages.push({
            text: <FormattedMessage id="oracle.passvote" />,
            type: 'default',
          }, {
            text: <FormattedMessage id="oracle.finalize" />,
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
    const { createBetTx } = this.props;
    const { oracle, currentOptionIdx } = this.state;
    const selectedIndex = oracle.optionIdxs[currentOptionIdx];

    createBetTx(oracle.address, selectedIndex, amount, this.getCurrentWalletAddr());
  }

  setResult() {
    const { createSetResultTx } = this.props;
    const { oracle, currentOptionIdx } = this.state;
    const selectedIndex = oracle.optionIdxs[currentOptionIdx];

    createSetResultTx(
      oracle.topicAddress,
      oracle.address,
      selectedIndex,
      oracle.consensusThreshold,
      this.getCurrentWalletAddr(),
    );
  }

  vote(amount) {
    const { createVoteTx } = this.props;
    const { oracle, currentOptionIdx } = this.state;
    const selectedIndex = oracle.optionIdxs[currentOptionIdx];

    createVoteTx(oracle.topicAddress, oracle.address, selectedIndex, amount, this.getCurrentWalletAddr());
  }

  finalizeResult() {
    const { createFinalizeResultTx } = this.props;
    const { oracle } = this.state;

    createFinalizeResultTx(oracle.address, this.getCurrentWalletAddr());
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
  createBetTx: PropTypes.func,
  createSetResultTx: PropTypes.func,
  createVoteTx: PropTypes.func,
  createFinalizeResultTx: PropTypes.func,
  onApprove: PropTypes.func,
  onAllowance: PropTypes.func,
  allowanceReturn: PropTypes.number,
  clearAllowanceReturn: PropTypes.func,
  onClearRequestReturn: PropTypes.func,
  requestReturn: PropTypes.object,
  syncBlockTime: PropTypes.number,
  walletAddrs: PropTypes.array,
  walletAddrsIndex: PropTypes.number,
  // eslint-disable-next-line react/no-typos
  intl: intlShape.isRequired,
};

OraclePage.defaultProps = {
  getOracles: undefined,
  getOraclesSuccess: [],
  createBetTx: undefined,
  createSetResultTx: undefined,
  createVoteTx: undefined,
  createFinalizeResultTx: undefined,
  onApprove: undefined,
  onAllowance: undefined,
  allowanceReturn: undefined,
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
    createBetTx: (contractAddress, index, amount, senderAddress) =>
      dispatch(graphqlActions.createBetTx(contractAddress, index, amount, senderAddress)),
    createSetResultTx: (topicAddress, oracleAddress, resultIndex, consensusThreshold, senderAddress) =>
      dispatch(graphqlActions.createSetResultTx(
        topicAddress,
        oracleAddress,
        resultIndex,
        consensusThreshold,
        senderAddress
      )),
    createVoteTx: (topicAddress, oracleAddress, resultIndex, botAmount, senderAddress) =>
      dispatch(topicActions.createVoteTx(topicAddress, oracleAddress, resultIndex, botAmount, senderAddress)),
    createFinalizeResultTx: (oracleAddress, senderAddress) =>
      dispatch(topicActions.createFinalizeResultTx(oracleAddress, senderAddress)),
    onClearRequestReturn: () => dispatch(topicActions.onClearRequestReturn()),
    onApprove: (contractAddress, spender, value, senderAddress) =>
      dispatch(topicActions.onApprove(contractAddress, spender, value, senderAddress)),
    onAllowance: (owner, spender, senderAddress) => dispatch(topicActions.onAllowance(owner, spender, senderAddress)),
    clearAllowanceReturn: () => dispatch(topicActions.clearAllowanceReturn()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(injectIntl(OraclePage)));
