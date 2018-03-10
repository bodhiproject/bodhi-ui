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
import { FormattedMessage, injectIntl } from 'react-intl';
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

    const { topicAddress, address, txid } = this.props.match.params;
    const unconfirmed = topicAddress === 'null' && address === 'null' && txid;

    this.state = {
      topicAddress,
      address,
      txid,
      unconfirmed,
      oracle: undefined,
      transactions: [],
      voteAmount: 0,
      currentOptionIdx: -1,
    };

    this.handleConfirmClick = this.handleConfirmClick.bind(this);
    this.executeOracleAndTxsRequest = this.executeOracleAndTxsRequest.bind(this);
    this.getEventOptionsInfo = this.getEventOptionsInfo.bind(this);
    this.constructOracleAndConfig = this.constructOracleAndConfig.bind(this);
    this.getActionButtonConfig = this.getActionButtonConfig.bind(this);
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

    // Construct page config
    if (getOraclesReturn) {
      this.constructOracleAndConfig(syncBlockTime, getOraclesReturn);
    }

    this.setState({ transactions: getTransactionsReturn });
  }

  render() {
    const { classes, txReturn, lastUsedAddress } = this.props;
    const {
      oracle,
      config,
      transactions,
      unconfirmed,
    } = this.state;

    if (!oracle || !config) {
      return null;
    }

    const eventOptions = this.getEventOptionsInfo();
    const actionButtonConfig = this.getActionButtonConfig();

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
              {!unconfirmed
                ? (
                  <div>
                    <Button
                      variant="raised"
                      fullWidth
                      size="large"
                      color="primary"
                      disabled={actionButtonConfig.disabled}
                      onClick={this.handleConfirmClick}
                      className={classes.eventActionButton}
                    >
                      {
                        this.state.isApproving ?
                          <CircularProgress className={classes.progress} size={30} style={{ color: 'white' }} /> :
                          config.predictionAction.btnText
                      }
                    </Button>
                    {
                      actionButtonConfig.message
                        ? <Typography variant="body1" className={classes.buttonDisabledText}>
                          {actionButtonConfig.message}
                        </Typography>
                        : null
                    }
                    <EventTxHistory transactions={transactions} options={oracle.options} />
                  </div>
                ) : (
                  <Typography variant="body1" className={classes.eventUnconfirmedText}>
                    <FormattedMessage
                      id="oracle.eventUnconfirmed"
                      defaultMessage="This created Event has not been confirmed yet."
                    />
                  </Typography>
                )
              }
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
    const { config, voteAmount } = this.state;

    switch (config.name) {
      case 'BETTING': {
        this.bet(voteAmount);
        break;
      }
      case 'SETTING': {
        this.setResult();
        break;
      }
      case 'VOTING': {
        this.vote(voteAmount);
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

  executeOracleAndTxsRequest() {
    const {
      topicAddress,
      address,
      txid,
      unconfirmed,
    } = this.state;

    if (unconfirmed) {
      // Find mutated Oracle based on txid since a mutated Oracle won't have a topicAddress or oracleAddress
      this.props.getOracles([
        { txid, status: OracleStatus.Created },
      ]);
    } else {
      // Find real Oracle based on topicAddress
      this.props.getOracles([
        { topicAddress },
      ]);
    }

    this.props.getTransactions([
      { topicAddress },
    ]);
  }

  constructOracleAndConfig(syncBlockTime, getOraclesReturn) {
    const { lastUsedAddress } = this.props;
    const { address, txid, unconfirmed } = this.state;

    let oracle;
    if (!unconfirmed) {
      oracle = _.find(getOraclesReturn, { address });
    } else {
      oracle = _.find(getOraclesReturn, { txid });
    }

    const centralizedOracle = _.find(getOraclesReturn, { token: Token.Qtum });
    const decentralizedOracles = _.orderBy(_.filter(getOraclesReturn, { token: Token.Bot }), ['blockNum'], ['asc']);
    let config;

    if (oracle) {
      const { token, status } = oracle;

      if (token === Token.Qtum && status === OracleStatus.Created && unconfirmed) {
        config = {
          name: 'BETTING',
          breadcrumbLabel: <FormattedMessage id="topBar.betting" defaultMessage="Betting" />,
          eventInfo: {
            steps: CardInfoUtil.getSteps(syncBlockTime, oracle),
            messages: [
            ],
          },
          predictionAction: {
            skipExpansion: false,
            btnText: <FormattedMessage id="cardInfo.bet" defaultMessage="Bet" />,
            showAmountInput: true,
          },
        };
      } else if (token === Token.Qtum && status === OracleStatus.Voting) {
        config = {
          name: 'BETTING',
          breadcrumbLabel: <FormattedMessage id="str.betting" defaultMessage="Betting" />,
          eventInfo: {
            steps: CardInfoUtil.getSteps(syncBlockTime, oracle),
          },
          predictionAction: {
            skipExpansion: false,
            showAmountInput: true,
            btnText: <FormattedMessage id="cardInfo.bet" defaultMessage="Bet" />,
          },
        };
      } else if (token === Token.Qtum && (status === OracleStatus.WaitResult || status === OracleStatus.OpenResultSet)) {
        config = {
          name: 'SETTING',
          breadcrumbLabel: <FormattedMessage id="str.setting" defaultMessage="Setting" />,
          eventInfo: {
            steps: CardInfoUtil.getSteps(syncBlockTime, oracle),
          },
          predictionAction: {
            skipExpansion: false,
            showAmountInput: false,
            btnText: <FormattedMessage id="str.setResult" defaultMessage="Set Result" />,
          },
        };
      } else if (token === Token.Bot && status === OracleStatus.Voting) {
        config = {
          name: 'VOTING',
          breadcrumbLabel: <FormattedMessage id="str.voting" defaultMessage="Voting" />,
          eventInfo: {
            steps: CardInfoUtil.getSteps(syncBlockTime, centralizedOracle, decentralizedOracles),
          },
          predictionAction: {
            skipExpansion: false,
            showAmountInput: true,
            btnText: <FormattedMessage id="str.vote" defaultMessage="Vote" />,
          },
        };
      } else if (token === Token.Bot && status === OracleStatus.WaitResult) {
        config = {
          name: 'FINALIZING',
          breadcrumbLabel: <FormattedMessage id="str.finalizing" defaultMessage="Finalizing" />,
          eventInfo: {
            steps: CardInfoUtil.getSteps(syncBlockTime, centralizedOracle, decentralizedOracles),
          },
          predictionAction: {
            skipExpansion: true,
            showAmountInput: false,
            btnText: <FormattedMessage id="str.finalize" defaultMessage="Finalize" />,
          },
        };
      }
    }

    this.setState({ oracle, config });
  }

  getActionButtonConfig() {
    const { syncBlockTime, walletAddresses, lastUsedAddress } = this.props;
    const {
      address,
      oracle,
      transactions,
      currentOptionIdx,
      voteAmount,
    } = this.state;
    const { token, status, resultSetterQAddress } = oracle;
    const currBlockTime = moment.unix(syncBlockTime);

    // Already have a pending tx for this Oracle
    const pendingTxs = _.filter(transactions, { oracleAddress: address, status: TransactionStatus.Pending });
    if (pendingTxs.length > 0) {
      return {
        disabled: true,
        message: <FormattedMessage
          id="str.pendingTransactionDisabledMsg"
          defaultMessage="You already have a pending transaction for this Event."
        />,
      };
    }

    // Has not reached betting start time
    if (token === Token.Qtum
      && status === OracleStatus.Voting
      && currBlockTime.isBefore(moment.unix(oracle.startTime))) {
      return {
        disabled: true,
        message: <FormattedMessage
          id="oracle.betStartTimeDisabledText"
          defaultMessage="The betting start time has not started yet."
        />,
      };
    }

    // Has not reached result setting start time
    if (token === Token.Qtum
      && (status === OracleStatus.WaitResult || status === OracleStatus.OpenResultSet)
      && currBlockTime.isBefore(moment.unix(oracle.resultSetStartTime))) {
      return {
        disabled: true,
        message: <FormattedMessage
          id="oracle.setStartTimeDisabledText"
          defaultMessage="The result setting start time has not started yet."
        />,
      };
    }

    // User is not the result setter
    if (token === Token.Qtum && status === OracleStatus.WaitResult && resultSetterQAddress !== lastUsedAddress) {
      return {
        disabled: true,
        message: <FormattedMessage
          id="oracle.cOracleDisabledText"
          defaultMessage="You are not the Centralized Oracle for this Event. You must wait until they set the result, or until the Open Result Set start time begins."
        />,
      };
    }

    // Did not select a result
    if (!(token === Token.Bot && status === OracleStatus.WaitResult) && currentOptionIdx === -1) {
      return {
        disabled: true,
        message: <FormattedMessage
          id="oracle.selectResultDisabledText"
          defaultMessage="You have not selected a result."
        />,
      };
    }

    // Did not enter an amount
    if (status === OracleStatus.Voting && (voteAmount <= 0 || Number.isNaN(voteAmount))) {
      return {
        disabled: true,
        message: <FormattedMessage
          id="oracle.enterAmountDisabledText"
          defaultMessage="You have not entered a valid amount."
        />,
      };
    }

    // Trying to bet more qtum than you have
    const totalQtum = _.sumBy(walletAddresses, (wallet) => wallet.qtum ? wallet.qtum : 0);
    if (token === Token.Qtum && status === OracleStatus.Voting && voteAmount > totalQtum) {
      return {
        disabled: true,
        message: <FormattedMessage
          id="str.notEnoughQtum"
          defaultMessage="Not enough QTUM"
        />,
      };
    }

    // Not enough bot for setting the result or voting
    const filteredAddress = _.filter(walletAddresses, { address: lastUsedAddress });
    const currentBot = filteredAddress.length > 0 ? filteredAddress[0].bot : 0;
    if ((token === Token.Qtum
      && (status === OracleStatus.WaitResult || status === OracleStatus.OpenResultSet)
      && currentBot < oracle.consensusThreshold)
      || (token === Token.Bot && status === OracleStatus.Voting && currentBot < voteAmount)) {
      return {
        disabled: true,
        message: <FormattedMessage
          id="str.notEnoughBot"
          defaultMessage="Not enough BOT"
        />,
      };
    }

    return {
      disabled: false,
    };
  }

  getEventOptionsInfo() {
    const { oracle } = this.state;
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

  getEventInfoObjs() {
    const { oracle } = this.state;
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

  bet(amount) {
    const { createBetTx, lastUsedAddress } = this.props;
    const {
      topicAddress,
      oracle,
      currentOptionIdx,
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
    const { createSetResultTx, lastUsedAddress } = this.props;
    const { oracle, currentOptionIdx } = this.state;
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
    const { createVoteTx, lastUsedAddress } = this.props;
    const { oracle, currentOptionIdx } = this.state;
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
    const { createFinalizeResultTx, lastUsedAddress } = this.props;
    const { oracle } = this.state;

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
