/* eslint react/no-array-index-key: 0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { CircularProgress, Paper, Grid, Button, Typography, withStyles } from '@material-ui/core';
import cx from 'classnames';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import moment from 'moment';
import NP from 'number-precision';
import {
  Token,
  OracleStatus,
  TransactionStatus,
  TransactionType,
  EventWarningType,
  SortBy,
  Routes,
  EventStatus,
} from 'constants';

import styles from './styles';
import {
  getShortLocalDateTimeString,
  getEndTimeCountDownString,
  doesUserNeedToUnlockWallet,
  getDetailPagePath,
  toFixed,
} from '../../../helpers/utility';
import StepperVertRight from '../../../components/StepperVertRight';
import EventWarning from '../../../components/EventWarning';
import { ImportantNote } from '../../../components/ImportantNote';
import EventOption from '../components/EventOption';
import EventInfo from '../components/EventInfo';
import EventResultHistory from '../components/EventTxHistory/resultHistory';
import EventTxHistory from '../components/EventTxHistory';
import BackButton from '../../../components/BackButton';
import appActions from '../../../redux/App/actions';
import graphqlActions from '../../../redux/Graphql/actions';
import { maxTransactionFee } from '../../../config/app';
import { getIntlProvider, i18nToUpperCase } from '../../../helpers/i18nUtil';
import { localizeInvalidOption } from '../../../helpers/localizeInvalidOption';

import Tracking from '../../../helpers/mixpanelUtil';

const messages = defineMessages({
  consensusThreshold: {
    id: 'oracle.consensusThreshold',
    defaultMessage: 'Consensus Threshold',
  },
  unconfirmed: {
    id: 'str.unconfirmed',
    defaultMessage: 'Unconfirmed',
  },
  eventUnconfirmed: {
    id: 'oracle.eventUnconfirmed',
    defaultMessage: 'This created Event is unconfirmed. You cannot interact with it until it is confirmed by the blockchain.',
  },
  setResultExplanation: {
    id: 'oracle.setResultExplanation',
    defaultMessage: 'Setting the result requires staking the Consensus Threshold amount.',
  },
  voteExplanation: {
    id: 'oracle.voteExplanation',
    defaultMessage: 'When a result\'s total votes reaches the Consensus Threshold, it will become the new result.',
  },
  finalizing: {
    id: 'str.finalizing',
    defaultMessage: 'Finalizing',
  },
  finalizingExplanation: {
    id: 'oracle.finalizingExplanation',
    defaultMessage: 'Finalizing the result can be done by anyone. It will finish this arbitration round and set the final result as the last round\'s result. Winners can withdraw their winnings once an Event is finalized.',
  },
  confirmBetMsg: {
    id: 'txConfirmMsg.bet',
    defaultMessage: 'bet on {option}',
  },
  confirmSetMsg: {
    id: 'txConfirmMsg.set',
    defaultMessage: 'set the result as {option}',
  },
  confirmVoteMsg: {
    id: 'txConfirmMsg.vote',
    defaultMessage: 'vote on {option}',
  },
});

@injectIntl
@withStyles(styles, { withTheme: true })
@connect((state) => ({
  lastUsedAddress: state.App.get('lastUsedAddress'),
  syncBlockTime: state.App.get('syncBlockTime'),
  oracles: state.Graphql.get('getOraclesReturn'),
  getTransactionsReturn: state.Graphql.get('getTransactionsReturn'),
  txReturn: state.Graphql.get('txReturn'),
}), (dispatch) => ({
  getOracles: (filters, orderBy, limit, skip) => dispatch(graphqlActions.getOracles(filters, orderBy, limit, skip)),
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
  setTxConfirmInfoAndCallback: (txDesc, txAmount, txToken, txInfo, confirmCallback) => dispatch(appActions.setTxConfirmInfoAndCallback(txDesc, txAmount, txToken, txInfo, confirmCallback)),
}))
@inject('store')
@observer
export default class OraclePage extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    getOracles: PropTypes.func,
    oracles: PropTypes.array,
    getTransactions: PropTypes.func,
    getTransactionsReturn: PropTypes.array,
    createBetTx: PropTypes.func,
    createSetResultTx: PropTypes.func,
    createVoteTx: PropTypes.func,
    createFinalizeResultTx: PropTypes.func,
    txReturn: PropTypes.object,
    syncBlockTime: PropTypes.number,
    lastUsedAddress: PropTypes.string.isRequired,
    setLastUsedAddress: PropTypes.func.isRequired,
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    setTxConfirmInfoAndCallback: PropTypes.func.isRequired,
  };

  static defaultProps = {
    getOracles: undefined,
    oracles: undefined,
    getTransactions: undefined,
    getTransactionsReturn: [],
    createBetTx: undefined,
    createSetResultTx: undefined,
    createVoteTx: undefined,
    createFinalizeResultTx: undefined,
    txReturn: undefined,
    syncBlockTime: undefined,
  };

  constructor(props) {
    super(props);

    const { topicAddress, address, txid } = this.props.match.params;
    const unconfirmed = Boolean(topicAddress === 'null' && address === 'null' && txid);

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
  }

  componentWillMount() {
    this.executeOracleAndTxsRequest();
  }

  componentWillReceiveProps(nextProps) {
    const { oracles, getTransactionsReturn, syncBlockTime, txReturn } = nextProps;

    // Update page on new block
    if (syncBlockTime !== this.props.syncBlockTime || (this.props.txReturn && !txReturn)) {
      this.executeOracleAndTxsRequest();
    }

    // Construct page config
    if (oracles) {
      this.constructOracleAndConfig(syncBlockTime, oracles);
    }

    this.setState({ transactions: getTransactionsReturn });
  }

  render() {
    const { classes, lastUsedAddress, syncBlockTime, intl } = this.props;
    const { oracle, oracles, config, transactions, unconfirmed } = this.state;

    if (!oracle || !config) {
      return null;
    }

    const cOracle = _.find(oracles, { token: Token.QTUM });
    const dOracles = _.orderBy(_.filter(oracles, { token: Token.BOT }), ['blockNum'], [SortBy.ASCENDING.toLowerCase()]);

    const showResultHistory = config.eventStatus === EventStatus.VOTE || config.eventStatus === EventStatus.FINALIZE;
    const eventOptions = this.getEventOptionsInfo();
    const { id, message, values, warningType, disabled } = this.getActionButtonConfig();

    return (
      <Fragment>
        <BackButton />
        <Paper className={classes.eventDetailPaper}>
          <Grid container spacing={0}>
            <Grid item xs={12} md={8} className={classes.eventDetailContainerGrid}>
              <Typography variant="display1" className={classes.eventDetailTitle}>
                {oracle.name}
              </Typography>
              <Grid item xs={12} lg={9}>
                {!unconfirmed && <EventWarning id={id} message={message} values={values} type={warningType} />}
                {eventOptions.map((item, index) => {
                  const invalidOption = localizeInvalidOption(item.name, intl);
                  return (
                    <EventOption
                      key={index}
                      phase={item.phase}
                      isLast={index === eventOptions.length - 1}
                      currentOptionIdx={this.state.currentOptionIdx}
                      optionIdx={index}
                      name={item.name === 'Invalid' ? invalidOption : item.name}
                      amount={`${item.value}`}
                      maxAmount={item.maxAmount}
                      percent={item.percent}
                      voteAmount={config.eventStatus === EventStatus.SET ? oracle.consensusThreshold : this.state.voteAmount}
                      token={config.eventStatus === EventStatus.SET ? Token.BOT : oracle.token}
                      isPrevResult={item.isPrevResult}
                      isFinalizing={item.isFinalizing}
                      consensusThreshold={oracle.consensusThreshold}
                      lastUsedAddress={lastUsedAddress}
                      skipExpansion={config.predictionAction.skipExpansion}
                      unconfirmedEvent={unconfirmed}
                      showAmountInput={config.predictionAction.showAmountInput}
                      amountInputDisabled={config.predictionAction.amountInputDisabled}
                      onOptionChange={this.handleOptionChange}
                      onAmountChange={this.handleAmountChange}
                      onWalletChange={this.handleWalletChange}
                    />
                  );
                })}
                <div className={classes.importantNoteContainer}>
                  <ImportantNote
                    heading={config.importantNote && config.importantNote.heading}
                    message={config.importantNote && config.importantNote.message}
                  />
                </div>
                {!unconfirmed && (
                  <div>
                    <Button
                      variant="raised"
                      fullWidth
                      size="large"
                      color="primary"
                      disabled={disabled}
                      onClick={this.handleConfirmClick}
                      className={classes.eventActionButton}
                    >
                      {
                        this.state.isApproving ?
                          <CircularProgress className={classes.progress} size={30} style={{ color: 'white' }} /> :
                          config.predictionAction.btnText
                      }
                    </Button>
                    {showResultHistory && <EventResultHistory oracles={oracles} />}
                    <EventTxHistory transactions={transactions} options={oracle.options} />
                  </div>
                )}
              </Grid>
            </Grid>
            <Grid item xs={12} md={4} className={cx(classes.eventDetailContainerGrid, 'right')}>
              <EventInfo className={classes.eventDetailInfo} infoObjs={this.getEventInfoObjs()} />
              <StepperVertRight blockTime={syncBlockTime} cOracle={cOracle} dOracles={dOracles} isTopicDetail={false} />
            </Grid>
          </Grid>
        </Paper>
      </Fragment>
    );
  }

  handleOptionChange = (idx) => {
    this.setState({ currentOptionIdx: idx });
  }

  handleAmountChange = (amount) => {
    this.setState({ voteAmount: amount });
  }

  handleWalletChange = (address) => {
    this.props.setLastUsedAddress(address);
  }

  handleConfirmClick = () => {
    const {
      oracle,
      config,
      voteAmount,
      currentOptionIdx,
      topicAddress,
    } = this.state;
    const {
      setTxConfirmInfoAndCallback,
      intl,
      lastUsedAddress,
      store: { wallet, walletUnlockDialog },
    } = this.props;

    if (doesUserNeedToUnlockWallet(wallet)) {
      walletUnlockDialog.isVisible = true;
    } else {
      const self = this;
      switch (config.eventStatus) {
        case EventStatus.BET: {
          setTxConfirmInfoAndCallback(
            intl.formatMessage(messages.confirmBetMsg, { option: oracle.options[currentOptionIdx] }),
            voteAmount,
            Token.QTUM,
            {
              type: TransactionType.BET,
              token: Token.QTUM,
              amount: voteAmount,
              optionIdx: currentOptionIdx,
              topicAddress,
              oracleAddress: oracle.address,
              senderAddress: lastUsedAddress,
            },
            () => {
              self.bet(voteAmount);
            }
          );
          break;
        }
        case EventStatus.SET: {
          setTxConfirmInfoAndCallback(
            intl.formatMessage(messages.confirmSetMsg, { option: oracle.options[currentOptionIdx] }),
            oracle.consensusThreshold,
            Token.BOT,
            {
              type: TransactionType.APPROVE_SET_RESULT,
              token: Token.BOT,
              amount: oracle.consensusThreshold,
              optionIdx: currentOptionIdx,
              topicAddress,
              oracleAddress: oracle.address,
              senderAddress: lastUsedAddress,
            },
            () => {
              self.setResult();
            }
          );
          break;
        }
        case EventStatus.VOTE: {
          setTxConfirmInfoAndCallback(
            intl.formatMessage(messages.confirmVoteMsg, { option: oracle.options[currentOptionIdx] }),
            voteAmount,
            Token.BOT,
            {
              type: TransactionType.APPROVE_VOTE,
              token: Token.BOT,
              amount: voteAmount,
              optionIdx: currentOptionIdx,
              topicAddress,
              oracleAddress: oracle.address,
              senderAddress: lastUsedAddress,
            },
            () => {
              self.vote(voteAmount);
            }
          );
          break;
        }
        case EventStatus.FINALIZE: {
          this.finalizeResult();
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  executeOracleAndTxsRequest = () => {
    const { topicAddress, txid, unconfirmed } = this.state;

    if (unconfirmed) {
      // Find mutated Oracle based on txid since a mutated Oracle won't have a topicAddress or oracleAddress
      this.props.getOracles([
        { txid, status: OracleStatus.CREATED },
      ]);
    } else {
      // Find real Oracle based on topicAddress
      this.props.getOracles([
        { topicAddress },
      ]);
    }

    this.props.getTransactions(
      [{ topicAddress }],
      { field: 'createdTime', direction: SortBy.DESCENDING },
    );
  }

  constructOracleAndConfig = (syncBlockTime, oraclesData) => {
    const { address, txid, unconfirmed } = this.state;

    let oracle;
    let oracles = oraclesData;
    if (!unconfirmed) {
      oracle = _.find(oracles, { address });
      oracles = _.orderBy(oracles, ['blockNum'], [SortBy.DESCENDING.toLowerCase()]);
    } else {
      oracle = _.find(oracles, { txid });
    }

    let config;

    if (oracle) {
      const { token, status } = oracle;

      if (token === Token.QTUM && status === OracleStatus.CREATED && unconfirmed) {
        config = this.setUnconfirmedConfig();
      } else if (token === Token.QTUM && status === OracleStatus.VOTING) {
        config = this.setBetConfig();
      } else if (token === Token.QTUM && (status === OracleStatus.WAIT_RESULT || status === OracleStatus.OPEN_RESULT_SET)) {
        config = this.setResultSetConfig(oracle);
      } else if (token === Token.BOT && status === OracleStatus.VOTING) {
        config = this.setVoteConfig(oracle);
      } else if (token === Token.BOT && status === OracleStatus.WAIT_RESULT) {
        config = this.setFinalizeConfig();
      }
    }

    if (oracle && !config) {
      const path = getDetailPagePath(oracles);
      if (path) {
        // Oracle stage changed, route to correct detail page
        this.props.history.push(path);
      } else {
        // Couldn't get proper path, route to dashboard
        this.props.history.push('/');
      }
      return;
    }

    this.setState({ oracle, oracles, config });
  }

  setUnconfirmedConfig = () => {
    const { locale, messages: localeMessages } = this.props.intl;
    const { ui } = this.props.store;
    const intl = getIntlProvider(locale, localeMessages);

    if (!ui.location) ui.location = Routes.bet;

    return {
      eventStatus: EventStatus.BET,
      breadcrumbLabel: <FormattedMessage id="str.betting" defaultMessage="Betting" />,
      predictionAction: {
        skipExpansion: false,
        showAmountInput: true,
        amountInputDisabled: false,
        btnText: <FormattedMessage id="str.bet" defaultMessage="Bet" />,
      },
      importantNote: {
        heading: intl.formatMessage(messages.unconfirmed),
        message: intl.formatMessage(messages.eventUnconfirmed),
      },
    };
  };

  setBetConfig = () => {
    const { ui } = this.props.store;
    if (!ui.location) ui.location = Routes.bet;

    return {
      eventStatus: EventStatus.BET,
      breadcrumbLabel: <FormattedMessage id="str.betting" defaultMessage="Betting" />,
      predictionAction: {
        skipExpansion: false,
        showAmountInput: true,
        amountInputDisabled: false,
        btnText: <FormattedMessage id="str.bet" defaultMessage="Bet" />,
      },
    };
  };

  setResultSetConfig = (oracle) => {
    const { locale, messages: localeMessages } = this.props.intl;
    const { ui } = this.props.store;
    const intl = getIntlProvider(locale, localeMessages);

    if (!ui.location) ui.location = Routes.SET;

    return {
      eventStatus: EventStatus.SET,
      breadcrumbLabel: <FormattedMessage id="str.setting" defaultMessage="Setting" />,
      predictionAction: {
        skipExpansion: false,
        showAmountInput: true,
        amountInputDisabled: true,
        btnText: <FormattedMessage id="str.setResult" defaultMessage="Set Result" />,
      },
      importantNote: {
        heading: `${intl.formatMessage(messages.consensusThreshold)}: ${oracle.consensusThreshold} BOT`,
        message: intl.formatMessage(messages.setResultExplanation),
      },
    };
  };

  setVoteConfig = (oracle) => {
    const { locale, messages: localeMessages } = this.props.intl;
    const { ui } = this.props.store;
    const intl = getIntlProvider(locale, localeMessages);

    if (!ui.location) ui.location = Routes.BOT_COURT;

    return {
      eventStatus: EventStatus.VOTE,
      breadcrumbLabel: <FormattedMessage id="str.voting" defaultMessage="Voting" />,
      predictionAction: {
        skipExpansion: false,
        showAmountInput: true,
        amountInputDisabled: false,
        btnText: <FormattedMessage id="str.arbitrate" defaultMessage="Arbitrate" />,
      },
      importantNote: {
        heading: `${intl.formatMessage(messages.consensusThreshold)}: ${oracle.consensusThreshold} BOT`,
        message: intl.formatMessage(messages.voteExplanation),
      },
    };
  };

  setFinalizeConfig = () => {
    const { locale, messages: localeMessages } = this.props.intl;
    const { ui } = this.props.store;
    const intl = getIntlProvider(locale, localeMessages);

    if (!ui.location) ui.location = Routes.FINALIZE;

    return {
      eventStatus: EventStatus.FINALIZE,
      breadcrumbLabel: <FormattedMessage id="str.finalizing" defaultMessage="Finalizing" />,
      predictionAction: {
        skipExpansion: true,
        showAmountInput: false,
        amountInputDisabled: false,
        btnText: <FormattedMessage id="str.finalize" defaultMessage="Finalize" />,
      },
      importantNote: {
        heading: intl.formatMessage(messages.finalizing),
        message: intl.formatMessage(messages.finalizingExplanation),
      },
    };
  };

  getActionButtonConfig = () => {
    const { syncBlockTime, store: { wallet }, lastUsedAddress } = this.props;
    const { address, oracle, transactions, currentOptionIdx, voteAmount } = this.state;
    const { token, status, resultSetterQAddress } = oracle;
    const totalQtum = _.sumBy(wallet.addresses, ({ qtum }) => qtum);
    const currBlockTime = moment.unix(syncBlockTime);
    const isBettingPhase = token === Token.QTUM && status === OracleStatus.VOTING;
    const isVotingPhase = token === Token.BOT && status === OracleStatus.VOTING;
    const isOpenResultSettingPhase = token === Token.QTUM && status === OracleStatus.OPEN_RESULT_SET;
    const isOracleResultSettingPhase = token === Token.QTUM && status === OracleStatus.WAIT_RESULT;
    const isFinalizePhase = token === Token.BOT && status === OracleStatus.WAIT_RESULT;
    const notEnoughQtum = totalQtum < maxTransactionFee;

    // Already have a pending tx for this Oracle
    const pendingTxs = _.filter(transactions, { oracleAddress: address, status: TransactionStatus.PENDING });
    if (pendingTxs.length > 0) {
      return {
        disabled: true,
        id: 'str.pendingTransactionDisabledMsg',
        message: 'You have a pending transaction for this event. Please wait until it\'s confirmed before doing another transaction.',
        warningType: EventWarningType.HIGHLIGHT,
      };
    }

    // Has not reached betting start time
    if (isBettingPhase && currBlockTime.isBefore(moment.unix(oracle.startTime))) {
      return {
        disabled: true,
        id: 'oracle.betStartTimeDisabledText',
        message: 'The betting start time has not started yet.',
        warningType: EventWarningType.INFO,
      };
    }

    // Has not reached result setting start time
    if ((isOpenResultSettingPhase || isOracleResultSettingPhase)
      && currBlockTime.isBefore(moment.unix(oracle.resultSetStartTime))) {
      return {
        disabled: true,
        id: 'oracle.setStartTimeDisabledText',
        message: 'The result setting start time has not started yet.',
        warningType: EventWarningType.INFO,
      };
    }

    // User is not the result setter
    if (isOracleResultSettingPhase && resultSetterQAddress !== lastUsedAddress) {
      return {
        disabled: true,
        id: 'oracle.cOracleDisabledText',
        message: 'You are not the result setter for this Event. You must wait until they set the result, or until the Open Result Set start time begins.',
        warningType: EventWarningType.INFO,
      };
    }

    // Trying to set result or vote when not enough QTUM or BOT
    const filteredAddress = _.filter(wallet.addresses, { address: lastUsedAddress });
    const currentBot = filteredAddress.length > 0 ? filteredAddress[0].bot : 0; // # of BOT at currently selected address
    if ((
      (isVotingPhase && currentBot < voteAmount)
      || ((isOpenResultSettingPhase || isOracleResultSettingPhase) && currentBot < oracle.consensusThreshold)
    ) && notEnoughQtum) {
      return {
        disabled: true,
        id: 'str.notEnoughQtumAndBot',
        message: 'You don\'t have enough QTUM or BOT',
        warningType: EventWarningType.ERROR,
      };
    }

    // Trying to bet more qtum than you have or you just don't have enough QTUM period
    if ((isBettingPhase && voteAmount > totalQtum + maxTransactionFee) || notEnoughQtum) {
      return {
        disabled: true,
        id: 'str.notEnoughQtum',
        message: 'You do\'t have enough QTUM',
        warningType: EventWarningType.ERROR,
      };
    }

    // Not enough bot for setting the result or voting
    if (((isOpenResultSettingPhase || isOracleResultSettingPhase) && currentBot < oracle.consensusThreshold)
      || (isVotingPhase && currentBot < voteAmount)) {
      return {
        disabled: true,
        id: 'str.notEnoughBot',
        message: 'You don\'t have enough BOT',
        warningType: EventWarningType.ERROR,
      };
    }

    // Did not select a result
    if (!isFinalizePhase && currentOptionIdx === -1) {
      return {
        disabled: true,
        id: 'oracle.selectResultDisabledText',
        message: 'Please click and select one of the options.',
        warningType: EventWarningType.INFO,
      };
    }

    // Did not enter an amount
    if ((isBettingPhase || isVotingPhase) && (voteAmount <= 0 || Number.isNaN(voteAmount))) {
      return {
        disabled: true,
        id: 'oracle.enterAmountDisabledText',
        message: 'Please entered a valid amount.',
        warningType: EventWarningType.INFO,
      };
    }

    // Trying to vote over the consensus threshold
    const optionAmount = oracle.amounts[currentOptionIdx];
    const maxVote = token === Token.BOT && status === OracleStatus.VOTING
      ? NP.minus(oracle.consensusThreshold, optionAmount) : 0;
    if (token === Token.BOT
      && status === OracleStatus.VOTING
      && currentOptionIdx >= 0
      && voteAmount > maxVote) {
      return {
        disabled: true,
        id: 'oracle.maxVoteText',
        message: 'You can only vote up to the Consensus Threshold for any one outcome. Current max vote is {amount} BOT.',
        values: { amount: toFixed(maxVote) },
        warningTypeClass: EventWarningType.ERROR,
      };
    }

    return {
      disabled: false,
    };
  }

  getEventOptionsInfo = () => {
    const { oracle } = this.state;
    const { token, status } = oracle;
    const totalBalance = _.sum(oracle.amounts);

    if (token === Token.QTUM) {
      return _.map(oracle.options, (optionName, index) => {
        const optionAmount = oracle.amounts[index] || 0;
        return {
          name: optionName,
          value: `${optionAmount} ${oracle.token}`,
          percent: totalBalance === 0 ? totalBalance : _.round((optionAmount / totalBalance) * 100),
          isPrevResult: false,
          isFinalizing: false,
          phase: oracle.phase,
        };
      });
    }

    return _.map(oracle.options, (optionName, index) => {
      const isPrevResult = !oracle.optionIdxs.includes(index);
      const optionAmount = oracle.amounts[index] || 0;
      const threshold = isPrevResult ? 0 : oracle.consensusThreshold;
      const maxAmount = token === Token.BOT && status === OracleStatus.VOTING
        ? oracle.consensusThreshold - optionAmount : undefined;

      return {
        name: oracle.options[index],
        value: isPrevResult ? 0 : `${optionAmount} ${oracle.token}`,
        maxAmount,
        percent: threshold === 0 ? threshold : _.round((optionAmount / threshold) * 100),
        isPrevResult,
        isFinalizing: token === Token.BOT && status === OracleStatus.WAIT_RESULT,
        phase: oracle.phase,
      };
    });
  }

  getEventInfoObjs = () => {
    const { oracle } = this.state;
    const totalAmount = _.sum(oracle.amounts);
    const { locale, messages: localeMessages } = this.props.intl;

    return [
      {
        label: <FormattedMessage id="eventInfo.endDate" defaultMessage="Ending Date" >
          {(txt) => i18nToUpperCase(txt)}
        </FormattedMessage>,
        content: getShortLocalDateTimeString(oracle.endTime),
        highlight: getEndTimeCountDownString(oracle.endTime, locale, localeMessages),
      }, {
        label: <FormattedMessage id="eventInfo.fund" defaultMessage="Funding" >
          {(txt) => i18nToUpperCase(txt)}
        </FormattedMessage>,
        content: `${parseFloat(totalAmount.toFixed(5)).toString()} ${oracle.token}`,
      }, {
        label: <FormattedMessage id="str.resultSetter" defaultMessage="Result Setter" >
          {(txt) => i18nToUpperCase(txt)}
        </FormattedMessage>,
        content: oracle.resultSetterQAddress,
      },
    ];
  }

  bet = (amount) => {
    const { createBetTx, lastUsedAddress } = this.props;
    const { topicAddress, oracle, currentOptionIdx } = this.state;

    createBetTx(
      oracle.version,
      topicAddress,
      oracle.address,
      currentOptionIdx,
      amount.toString(),
      lastUsedAddress,
    );

    Tracking.track('oracleDetail-bet');
  }

  setResult = () => {
    const { createSetResultTx, lastUsedAddress } = this.props;
    const { oracle, currentOptionIdx } = this.state;

    createSetResultTx(
      oracle.version,
      oracle.topicAddress,
      oracle.address,
      currentOptionIdx,
      oracle.consensusThreshold,
      lastUsedAddress,
    );

    Tracking.track('oracleDetail-set');
  }

  vote = (amount) => {
    const { createVoteTx, lastUsedAddress } = this.props;
    const { oracle, currentOptionIdx } = this.state;

    createVoteTx(
      oracle.version,
      oracle.topicAddress,
      oracle.address,
      currentOptionIdx,
      amount,
      lastUsedAddress,
    );

    Tracking.track('oracleDetail-vote');
  }

  finalizeResult = () => {
    const { createFinalizeResultTx, lastUsedAddress } = this.props;
    const { oracle } = this.state;

    createFinalizeResultTx(oracle.version, oracle.topicAddress, oracle.address, lastUsedAddress);

    Tracking.track('oracleDetail-finalize');
  }
}
