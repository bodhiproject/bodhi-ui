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
import stateActions from '../../redux/State/actions';
import graphqlActions from '../../redux/Graphql/actions';
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
      currentWalletIdx: this.props.walletAddrsIndex,
      currentOptionIdx: -1,
    };

    this.handleConfirmClick = this.handleConfirmClick.bind(this);
    this.executeOraclesRequest = this.executeOraclesRequest.bind(this);
    this.constructOracleAndConfig = this.constructOracleAndConfig.bind(this);
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
      getOraclesReturn,
      syncBlockTime,
    } = nextProps;

    // Update page on new block
    if (syncBlockTime !== this.props.syncBlockTime) {
      this.executeOraclesRequest();
    }

    this.constructOracleAndConfig(getOraclesReturn, syncBlockTime);
  }

  componentWillUnmount() {
    this.props.clearTxReturn();
  }

  render() {
    const { classes, txReturn } = this.props;
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
        <PredictionCompleteDialog txReturn={this.props.txReturn} />
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
    ], undefined);
  }

  constructOracleAndConfig(getOraclesReturn, syncBlockTime) {
    const oracle = _.find(getOraclesReturn, { address: this.state.address });
    const centralizedOracle = _.find(getOraclesReturn, { token: Token.Qtum });
    const decentralizedOracles = _.orderBy(_.filter(getOraclesReturn, { token: Token.Bot }), ['blockNum'], ['asc']);

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

  bet(amount) {
    const { createBetTx } = this.props;
    const { oracle, currentOptionIdx } = this.state;
    const selectedIndex = oracle.optionIdxs[currentOptionIdx];

    createBetTx(oracle.version, oracle.address, selectedIndex, amount, this.getCurrentWalletAddr());
  }

  setResult() {
    const { createSetResultTx } = this.props;
    const { oracle, currentOptionIdx } = this.state;
    const selectedIndex = oracle.optionIdxs[currentOptionIdx];

    createSetResultTx(
      oracle.version,
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

    createVoteTx(
      oracle.version,
      oracle.topicAddress,
      oracle.address,
      selectedIndex,
      amount,
      this.getCurrentWalletAddr()
    );
  }

  finalizeResult() {
    const { createFinalizeResultTx } = this.props;
    const { oracle } = this.state;

    createFinalizeResultTx(oracle.address, this.getCurrentWalletAddr());
  }
}

OraclePage.propTypes = {
  match: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  getOracles: PropTypes.func,
  getOraclesReturn: PropTypes.array,
  createBetTx: PropTypes.func,
  createSetResultTx: PropTypes.func,
  createVoteTx: PropTypes.func,
  createFinalizeResultTx: PropTypes.func,
  txReturn: PropTypes.object,
  clearTxReturn: PropTypes.func,
  syncBlockTime: PropTypes.number,
  walletAddrs: PropTypes.array,
  walletAddrsIndex: PropTypes.number,
  // eslint-disable-next-line react/no-typos
  intl: intlShape.isRequired,
};

OraclePage.defaultProps = {
  getOracles: undefined,
  getOraclesReturn: [],
  createBetTx: undefined,
  createSetResultTx: undefined,
  createVoteTx: undefined,
  createFinalizeResultTx: undefined,
  txReturn: undefined,
  clearTxReturn: undefined,
  syncBlockTime: undefined,
  walletAddrs: [],
  walletAddrsIndex: 1,
};

const mapStateToProps = (state) => ({
  walletAddrs: state.App.get('walletAddrs'),
  walletAddrsIndex: state.App.get('walletAddrsIndex'),
  syncBlockTime: state.App.get('syncBlockTime'),
  getOraclesReturn: state.Graphql.get('getOraclesReturn'),
  txReturn: state.Graphql.get('txReturn'),
});

function mapDispatchToProps(dispatch) {
  return {
    getOracles: (filters, orderBy) => dispatch(graphqlActions.getOracles(filters, orderBy)),
    createBetTx: (version, contractAddress, index, amount, senderAddress) =>
      dispatch(graphqlActions.createBetTx(version, contractAddress, index, amount, senderAddress)),
    createSetResultTx: (version, topicAddress, oracleAddress, resultIndex, consensusThreshold, senderAddress) =>
      dispatch(graphqlActions.createSetResultTx(
        version,
        topicAddress,
        oracleAddress,
        resultIndex,
        consensusThreshold,
        senderAddress
      )),
    createVoteTx: (version, topicAddress, oracleAddress, resultIndex, botAmount, senderAddress) =>
      dispatch(graphqlActions.createVoteTx(version, topicAddress, oracleAddress, resultIndex, botAmount, senderAddress)),
    createFinalizeResultTx: (oracleAddress, senderAddress) =>
      dispatch(graphqlActions.createFinalizeResultTx(oracleAddress, senderAddress)),
    clearTxReturn: () => dispatch(graphqlActions.clearTxReturn()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(injectIntl(OraclePage)));
