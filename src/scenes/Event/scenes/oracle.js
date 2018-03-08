/* eslint react/no-array-index-key: 0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import { CircularProgress } from 'material-ui/Progress';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import moment from 'moment';

import { getLocalDateTimeString, getEndTimeCountDownString } from '../../../helpers/utility';
import StepperVertRight from '../../../components/StepperVertRight/index';
import EventOption from '../components/EventOption/index';
import EventInfo from '../components/EventInfo/index';
import EventTxHistory from '../components/EventTxHistory/index';
import graphqlActions from '../../../redux/Graphql/actions';
import appActions from '../../../redux/App/actions';
import { Token, OracleStatus, TransactionStatus } from '../../../constants';
import CardInfoUtil from '../../../helpers/cardInfoUtil';
import styles from './styles';

class OraclePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      topicAddress: this.props.match.params.topicAddress,
      address: this.props.match.params.address,
      oracle: undefined,
      transactions: [],
      config: undefined,
      voteAmount: 0,
      currentOptionIdx: -1,
    };

    this.isActionButtonDisabled = this.isActionButtonDisabled.bind(this);
    this.handleConfirmClick = this.handleConfirmClick.bind(this);
    this.executeOracleAndTxsRequest = this.executeOracleAndTxsRequest.bind(this);
    this.constructOracleAndConfig = this.constructOracleAndConfig.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleWalletChange = this.handleWalletChange.bind(this);
    this.bet = this.bet.bind(this);
    this.setResult = this.setResult.bind(this);
    this.vote = this.vote.bind(this);
    this.finalizeResult = this.finalizeResult.bind(this);
    this.getEventInfoObjs = this.getEventInfoObjs.bind(this);
  }

  componentWillMount() {
    this.executeOracleAndTxsRequest();
  }

  componentWillReceiveProps(nextProps) {
    const {
      getOraclesReturn,
      getTransactionsReturn,
      syncBlockTime,
      txReturn,
    } = nextProps;

    // Update page on new block
    if (syncBlockTime !== this.props.syncBlockTime || (this.props.txReturn && !txReturn)) {
      this.executeOracleAndTxsRequest();
    }

    this.constructOracleAndConfig(getOraclesReturn, syncBlockTime);
    this.setState({ transactions: getTransactionsReturn });
  }

  render() {
    const { classes, txReturn, lastUsedAddress } = this.props;
    const { oracle, transactions, config } = this.state;

    // TODO: is this necessary?
    if (!oracle || !config) {
      // Don't render anything if page is loading.
      // In future we could make a loading animation
      return <div></div>;
    }

    const eventOptions = OraclePage.getBetOrVoteArray(oracle);

    return (
      <Paper className={classes.eventDetailPaper}>
        <Grid container spacing={0}>
          <Grid item xs={12} md={8} className={classes.eventDetailContainerGrid}>
            <Typography variant="display1" className={classes.eventDetailTitle}>
              {oracle.name}
            </Typography>
            <Grid item xs={12} lg={9}>
              {eventOptions.map((item, index) => (
                <EventOption
                  key={index}
                  isLast={index === eventOptions.length - 1}
                  currentOptionIdx={this.state.currentOptionIdx}
                  optionIdx={index}
                  name={item.name}
                  amount={item.value}
                  percent={item.percent}
                  voteAmount={this.state.voteAmount}
                  token={oracle.token}
                  walletAddresses={this.props.walletAddresses}
                  lastUsedAddress={lastUsedAddress}
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
                disabled={this.isActionButtonDisabled}
                onClick={this.handleConfirmClick}
                className={classes.eventActionButton}
              >
                {
                  this.state.isApproving ?
                    <CircularProgress className={classes.progress} size={30} style={{ color: 'white' }} /> :
                    config.predictionAction.btnText
                }
              </Button>
              <EventTxHistory transactions={transactions} options={oracle.options} />
            </Grid>
          </Grid>
          <Grid item xs={12} md={4} className={classNames(classes.eventDetailContainerGrid, 'right')}>
            <EventInfo className={classes.eventDetailInfo} infoObjs={this.getEventInfoObjs()} />
            <StepperVertRight steps={config.eventInfo.steps} />
          </Grid>
        </Grid>
      </Paper>
    );
  }

  getEventInfoObjs() {
    const { oracle } = this.state;

    if (_.isEmpty(oracle)) {
      return [];
    }

    const totalAmount = _.sum(oracle.amounts);

    return [
      {
        label: <FormattedMessage id="eventInfo.endDate" defaultMessage="ENDING DATE" />,
        content: getLocalDateTimeString(oracle.endTime),
        highlight: getEndTimeCountDownString(oracle.endTime),
      }, {
        label: <FormattedMessage id="eventInfo.fund" defaultMessage="FUNDING" />,
        content: `${parseFloat(totalAmount.toFixed(5)).toString()} ${oracle.token}`,
      }, {
        label: <FormattedMessage id="eventInfo.resultSetter" defaultMessage="RESULT SETTER" />,
        content: oracle.resultSetterQAddress,
      },
    ];
  }

  isActionButtonDisabled() {
    const {
      currentOptionIdx,
      voteAmount,
      config,
      transactions,
      address,
    } = this.state;

    // Not within correct times or not the result setter
    if (config.predictionAction.btnDisabled) {
      return true;
    }

    // Already have a pending tx for this Oracle
    const pendingTxs = _.filter(transactions, { oracleAddress: address, status: TransactionStatus.Pending });
    if (pendingTxs > 0) {
      return true;
    }

    // Did not select an option
    if (currentOptionIdx === -1) {
      return true;
    }

    // Did not enter an amount
    if ((voteAmount === 0 || Number.isNaN(voteAmount)) && config.predictionAction.showAmountInput) {
      return true;
    }

    return false;
  }

  handleOptionChange(idx) {
    this.setState({ currentOptionIdx: idx });
  }

  handleAmountChange(amount) {
    this.setState({ voteAmount: amount });
  }

  handleWalletChange(address) {
    this.props.setLastUsedAddress(address);
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
        break;
      }
    }
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

  executeOracleAndTxsRequest() {
    this.props.getOracles([
      { topicAddress: this.state.topicAddress },
    ], undefined);
    
    this.props.getTransactions([
      { topicAddress: this.state.topicAddress },
    ], undefined);
  }

  constructOracleAndConfig(getOraclesReturn, syncBlockTime) {
    const { lastUsedAddress } = this.props;

    const oracle = _.find(getOraclesReturn, { address: this.state.address });
    const centralizedOracle = _.find(getOraclesReturn, { token: Token.Qtum });
    const decentralizedOracles = _.orderBy(_.filter(getOraclesReturn, { token: Token.Bot }), ['blockNum'], ['asc']);
    const currBlockTime = moment.unix(syncBlockTime);

    if (oracle) {
      const { token, status } = oracle;
      let config;

      if (token === Token.Qtum && status === OracleStatus.Voting) {
        config = {
          name: 'BETTING',
          breadcrumbLabel: <FormattedMessage id="topBar.betting" defaultMessage="Betting" />,
          eventInfo: {
            steps: CardInfoUtil.getSteps(syncBlockTime, oracle),
          },
          predictionAction: {
            skipExpansion: false,
            btnText: <FormattedMessage id="cardInfo.bet" defaultMessage="Bet" />,
            btnDisabled: currBlockTime.isBefore(moment.unix(oracle.startTime)),
            showAmountInput: true,
          },
        };
      } else if (token === Token.Qtum && (status === OracleStatus.WaitResult || status === OracleStatus.OpenResultSet)) {
        config = {
          name: 'SETTING',
          breadcrumbLabel: <FormattedMessage id="topBar.setting" defaultMessage="Setting" />,
          eventInfo: {
            steps: CardInfoUtil.getSteps(syncBlockTime, oracle),
          },
          predictionAction: {
            skipExpansion: false,
            btnText: <FormattedMessage id="str.setResult" defaultMessage="Set Result" />,
            btnDisabled: (oracle.status === OracleStatus.WaitResult
              && oracle.resultSetterQAddress !== lastUsedAddress)
              || currBlockTime.isBefore(moment.unix(oracle.resultSetStartTime)),
            showAmountInput: false,
          },
        };
      } else if (token === Token.Bot && status === OracleStatus.Voting) {
        config = {
          name: 'VOTING',
          breadcrumbLabel: <FormattedMessage id="topBar.voting" defaultMessage="Voting" />,
          eventInfo: {
            steps: CardInfoUtil.getSteps(syncBlockTime, centralizedOracle, decentralizedOracles),
          },
          predictionAction: {
            skipExpansion: false,
            btnText: <FormattedMessage id="str.vote" defaultMessage="Vote" />,
            showAmountInput: true,
          },
        };
      } else if (token === Token.Bot && status === OracleStatus.WaitResult) {
        config = {
          name: 'FINALIZING',
          breadcrumbLabel: 'Voting',
          eventInfo: {
            steps: CardInfoUtil.getSteps(syncBlockTime, centralizedOracle, decentralizedOracles),
          },
          predictionAction: {
            skipExpansion: true,
            btnText: <FormattedMessage id="cardInfo.finalize" defaultMessage="Finalize" />,
            showAmountInput: false,
          },
        };
      }

      this.setState({
        oracle,
        config,
      });
    }
  }

  bet(amount) {
    const { createBetTx } = this.props;
    const {
      topicAddress,
      oracle,
      currentOptionIdx,
      lastUsedAddress,
    } = this.state;
    const selectedIndex = oracle.optionIdxs[currentOptionIdx];

    createBetTx(
      oracle.version,
      topicAddress,
      oracle.address,
      selectedIndex,
      amount.toString(),
      lastUsedAddress,
    );
  }

  setResult() {
    const { createSetResultTx } = this.props;
    const { oracle, currentOptionIdx, lastUsedAddress } = this.state;
    const selectedIndex = oracle.optionIdxs[currentOptionIdx];

    createSetResultTx(
      oracle.version,
      oracle.topicAddress,
      oracle.address,
      selectedIndex,
      oracle.consensusThreshold,
      lastUsedAddress,
    );
  }

  vote(amount) {
    const { createVoteTx } = this.props;
    const { oracle, currentOptionIdx, lastUsedAddress } = this.state;
    const selectedIndex = oracle.optionIdxs[currentOptionIdx];

    createVoteTx(
      oracle.version,
      oracle.topicAddress,
      oracle.address,
      selectedIndex,
      amount,
      lastUsedAddress,
    );
  }

  finalizeResult() {
    const { createFinalizeResultTx } = this.props;
    const { oracle, lastUsedAddress } = this.state;

    createFinalizeResultTx(oracle.version, oracle.topicAddress, oracle.address, lastUsedAddress);
  }
}

OraclePage.propTypes = {
  match: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  getOracles: PropTypes.func,
  getOraclesReturn: PropTypes.array,
  getTransactions: PropTypes.func,
  getTransactionsReturn: PropTypes.array,
  createBetTx: PropTypes.func,
  createSetResultTx: PropTypes.func,
  createVoteTx: PropTypes.func,
  createFinalizeResultTx: PropTypes.func,
  txReturn: PropTypes.object,
  syncBlockTime: PropTypes.number,
  walletAddresses: PropTypes.array.isRequired,
  lastUsedAddress: PropTypes.string.isRequired,
  setLastUsedAddress: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-typos
  intl: intlShape.isRequired,
};

OraclePage.defaultProps = {
  getOracles: undefined,
  getOraclesReturn: [],
  getTransactions: undefined,
  getTransactionsReturn: [],
  createBetTx: undefined,
  createSetResultTx: undefined,
  createVoteTx: undefined,
  createFinalizeResultTx: undefined,
  txReturn: undefined,
  syncBlockTime: undefined,
};

const mapStateToProps = (state) => ({
  walletAddresses: state.App.get('walletAddresses'),
  lastUsedAddress: state.App.get('lastUsedAddress'),
  syncBlockTime: state.App.get('syncBlockTime'),
  getOraclesReturn: state.Graphql.get('getOraclesReturn'),
  getTransactionsReturn: state.Graphql.get('getTransactionsReturn'),
  txReturn: state.Graphql.get('txReturn'),
});

function mapDispatchToProps(dispatch) {
  return {
    getOracles: (filters, orderBy) => dispatch(graphqlActions.getOracles(filters, orderBy)),
    getTransactions: (filters, orderBy) => dispatch(graphqlActions.getTransactions(filters, orderBy)),
    createBetTx: (version, topicAddress, oracleAddress, index, amount, senderAddress) =>
      dispatch(graphqlActions.createBetTx(version, topicAddress, oracleAddress, index, amount, senderAddress)),
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
    createFinalizeResultTx: (version, topicAddress, oracleAddress, senderAddress) =>
      dispatch(graphqlActions.createFinalizeResultTx(version, topicAddress, oracleAddress, senderAddress)),
    setLastUsedAddress: (address) => dispatch(appActions.setLastUsedAddress(address)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(injectIntl(OraclePage)));
