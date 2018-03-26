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
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';

import styles from './styles';
import StepperVertRight from '../../../components/StepperVertRight/index';
import EventInfo from '../components/EventInfo/index';
import EventTxHistory from '../components/EventTxHistory/index';
import EventResultHistory from '../components/EventTxHistory/resultHistory';
import EventWarning from '../../../components/EventWarning/index';
import TransactionSentDialog from '../../../components/TransactionSentDialog/index';
import BackButton from '../../../components/BackButton/index';
import appActions from '../../../redux/App/actions';
import topicActions from '../../../redux/Topic/actions';
import graphqlActions from '../../../redux/Graphql/actions';
import {
  Token,
  OracleStatus,
  TransactionType,
  TransactionStatus,
  EventWarningType,
  SortBy,
  AppLocation,
} from '../../../constants';
import CardInfoUtil from '../../../helpers/cardInfoUtil';
import { i18nToUpperCase } from '../../../helpers/i18nUtil';
import { doesUserNeedToUnlockWallet } from '../../../helpers/utility';

const pageMessage = defineMessages({
  returnRate: {
    id: 'withdrawDetail.returnRate',
    defaultMessage: 'Return rate: ',
  },
  youBet: {
    id: 'withdrawDetail.youBet',
    defaultMessage: 'You bet',
  },
  youVote: {
    id: 'withdrawDetail.youVote',
    defaultMessage: 'You vote',
  },
  totalBet: {
    id: 'withdrawDetail.totalBet',
    defaultMessage: 'Total bet amount',
  },
  totalVote: {
    id: 'withdrawDetail.totalVote',
    defaultMessage: 'Total vote amount',
  },
});

@injectIntl
@withStyles(styles, { withTheme: true })
@connect((state, props) => ({
  syncBlockTime: state.App.get('syncBlockTime'),
  walletAddresses: state.App.get('walletAddresses'),
  lastUsedAddress: state.App.get('lastUsedAddress'),
  walletEncrypted: state.App.get('walletEncrypted'),
  walletUnlockedUntil: state.App.get('walletUnlockedUntil'),
  getTopicsReturn: state.Graphql.get('getTopicsReturn'),
  getTransactionsReturn: state.Graphql.get('getTransactionsReturn'),
  txReturn: state.Graphql.get('txReturn'),
  betBalances: state.Topic.get('betBalances'),
  voteBalances: state.Topic.get('voteBalances'),
  botWinnings: state.Topic.get('botWinnings'),
  qtumWinnings: state.Topic.get('qtumWinnings'),
  winningAddresses: state.Topic.get('winningAddresses'),
}), (dispatch, props) => ({
  getBetAndVoteBalances: (contractAddress, senderAddress) =>
    dispatch(topicActions.getBetAndVoteBalances(contractAddress, senderAddress)),
  calculateWinnings: (contractAddress, walletAddresses, eventCreator) =>
    dispatch(topicActions.calculateWinnings(contractAddress, walletAddresses, eventCreator)),
  getTopics: (filters, orderBy, limit, skip) => dispatch(graphqlActions.getTopics(filters, orderBy, limit, skip)),
  getTransactions: (filters, orderBy) => dispatch(graphqlActions.getTransactions(filters, orderBy)),
  createWithdrawTx: (type, version, topicAddress, senderAddress) =>
    dispatch(graphqlActions.createWithdrawTx(type, version, topicAddress, senderAddress)),
  clearTxReturn: () => dispatch(graphqlActions.clearTxReturn()),
  setAppLocation: (location) => dispatch(appActions.setAppLocation(location)),
  toggleWalletUnlockDialog: (isVisible) => dispatch(appActions.toggleWalletUnlockDialog(isVisible)),
  setLastUsedAddress: (address) => dispatch(appActions.setLastUsedAddress(address)),
}))

export default class TopicPage extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    getTopics: PropTypes.func.isRequired,
    getTopicsReturn: PropTypes.object,
    getTransactions: PropTypes.func.isRequired,
    getTransactionsReturn: PropTypes.array,
    getBetAndVoteBalances: PropTypes.func.isRequired,
    betBalances: PropTypes.array,
    voteBalances: PropTypes.array,
    calculateWinnings: PropTypes.func.isRequired,
    botWinnings: PropTypes.number,
    qtumWinnings: PropTypes.number,
    winningAddresses: PropTypes.array,
    createWithdrawTx: PropTypes.func.isRequired,
    txReturn: PropTypes.object,
    clearTxReturn: PropTypes.func.isRequired,
    syncBlockTime: PropTypes.number,
    walletEncrypted: PropTypes.bool.isRequired,
    walletUnlockedUntil: PropTypes.number.isRequired,
    toggleWalletUnlockDialog: PropTypes.func.isRequired,
    walletAddresses: PropTypes.array.isRequired,
    lastUsedAddress: PropTypes.string.isRequired,
    setLastUsedAddress: PropTypes.func.isRequired,
    setAppLocation: PropTypes.func.isRequired,
  };

  static defaultProps = {
    syncBlockTime: undefined,
    getTopicsReturn: undefined,
    getTransactionsReturn: [],
    txReturn: undefined,
    betBalances: [],
    voteBalances: [],
    botWinnings: 0,
    qtumWinnings: 0,
    winningAddresses: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      address: this.props.match.params.address,
      topic: undefined,
      config: undefined,
    };

    this.fetchData = this.fetchData.bind(this);
    this.onWithdrawClicked = this.onWithdrawClicked.bind(this);
    this.constructTopicAndConfig = this.constructTopicAndConfig.bind(this);
    this.getEventInfoObjs = this.getEventInfoObjs.bind(this);
    this.renderWithdrawContainer = this.renderWithdrawContainer.bind(this);
    this.getActionButtonConfig = this.getActionButtonConfig.bind(this);
    this.renderOptions = this.renderOptions.bind(this);
    this.onAddressChange = this.onAddressChange.bind(this);
  }

  componentWillMount() {
    const {
      setAppLocation,
      lastUsedAddress,
      getBetAndVoteBalances,
      getTransactionsReturn,
      botWinnings,
      qtumWinnings,
      winningAddresses,
    } = this.props;
    const { address } = this.state;

    setAppLocation(AppLocation.withdraw);
    this.fetchData(lastUsedAddress);
  }

  componentWillReceiveProps(nextProps) {
    const {
      syncBlockTime,
      lastUsedAddress,
      getTopicsReturn,
      winningAddresses,
    } = this.props;
    const { address } = this.state;

    // Update page on new block
    if (nextProps.syncBlockTime !== syncBlockTime || nextProps.lastUsedAddress !== lastUsedAddress) {
      this.fetchData(nextProps.lastUsedAddress ? nextProps.lastUsedAddress : lastUsedAddress);
    }

    const topics = nextProps.getTopicsReturn ? nextProps.getTopicsReturn.data : getTopicsReturn.data;
    this.constructTopicAndConfig(topics, nextProps.botWinnings, nextProps.qtumWinnings);
  }

  componentWillUnmount() {
    this.props.clearTxReturn();
  }

  render() {
    const { classes, txReturn, getTransactionsReturn, lastUsedAddress } = this.props;
    const { topic, config } = this.state;

    if (!topic || !config) {
      return null;
    }

    const qtumTotal = _.sum(topic.qtumAmount);
    const botTotal = _.sum(topic.botAmount);

    return (
      <div>
        <BackButton />
        <Paper className={classes.eventDetailPaper}>
          <Grid container spacing={0}>
            <Grid item xs={12} md={8} className={classes.eventDetailContainerGrid}>
              <Typography variant="display1" className={classes.eventDetailTitle}>
                {topic.name}
              </Typography>
              <Grid item xs={12}>
                {this.renderWithdrawContainer()}
                {this.renderOptions()}
                <EventResultHistory oracles={topic.oracles} />
                <EventTxHistory transactions={getTransactionsReturn} options={topic.options} />
              </Grid>
            </Grid>
            <Grid item xs={12} md={4} className={classNames(classes.eventDetailContainerGrid, 'right')}>
              <EventInfo infoObjs={this.getEventInfoObjs()} className={classes.eventDetailInfo} />
              <StepperVertRight steps={config.steps} />
            </Grid>
          </Grid>
          <TransactionSentDialog txReturn={this.props.txReturn} />
        </Paper>
      </div>
    );
  }

  renderWithdrawContainer() {
    const {
      intl,
      classes,
      walletAddresses,
      betBalances,
      voteBalances,
      botWinnings,
      qtumWinnings,
      lastUsedAddress,
      winningAddresses,
    } = this.props;
    const { topic, config } = this.state;

    const resultBetAmount = betBalances[topic.resultIdx];
    const resultVoteAmount = voteBalances[topic.resultIdx];
    const qtumReturnRate = resultBetAmount ? ((qtumWinnings - resultBetAmount) / resultBetAmount) * 100 : 0;
    const botReturnRate = resultVoteAmount ? ((botWinnings - resultVoteAmount) / resultVoteAmount) * 100 : 0;

    return (
      <Paper className={classes.withdrawPaper}>
        <div className={classNames(classes.withdrawContainerSection, !botWinnings && !qtumWinnings ? 'last' : '')}>
          <div className={classes.withdrawContainerSectionIcon}>
            <i className="icon iconfont icon-ic_reward"></i>
          </div>
          <Typography variant="body2" className={classes.withdrawContainerSectionLabel}>
            <FormattedMessage id="str.winningOutcome" defaultMessage="Wining Outcome">
              {(txt) => i18nToUpperCase(txt)}
            </FormattedMessage>
          </Typography>
          <Typography className={classes.withdrawWinningOption}>
            {topic.options[topic.resultIdx]}
          </Typography>
          {
            resultBetAmount || resultVoteAmount ?
              <Typography variant="caption">
                {`${intl.formatMessage(pageMessage.youBet)} ${resultBetAmount} QTUM. ${intl.formatMessage(pageMessage.youVote)} ${resultVoteAmount} BOT.`}
              </Typography> :
              <Typography variant="caption">
                <FormattedMessage
                  id="topic.didNotBetOrVote"
                  defaultMessage="You did not bet or vote on the winning outcome."
                />
              </Typography>
          }
        </div>
        { botWinnings || qtumWinnings ?
          <div>
            <div className={classes.withdrawContainerSection}>
              <div className={classes.withdrawContainerSectionIcon}>
                <i className="icon iconfont icon-ic_token"></i>
              </div>
              <Typography variant="body2" className={classes.withdrawContainerSectionLabel}>
                <FormattedMessage id="withdrawDetail.reward" defaultMessage="REWARD">
                  {(txt) => i18nToUpperCase(txt)}
                </FormattedMessage>
              </Typography>
              <div>
                <div className={classes.withdrawRewardWrapper}>
                  <Typography variant="display1">
                    +{qtumWinnings} <span className={classes.withdrawToken}>QTUM</span>
                  </Typography>
                  <Typography variant="caption">
                    {`${intl.formatMessage(pageMessage.returnRate)} ${qtumReturnRate.toFixed(2)}%`}
                  </Typography>
                </div>
                <div className={classes.withdrawRewardDivider} />
                <div className={classes.withdrawRewardWrapper}>
                  <Typography variant="display1">
                    +{botWinnings} <span className={classes.withdrawToken}>BOT</span>
                  </Typography>
                  <Typography variant="caption">
                    {`${intl.formatMessage(pageMessage.returnRate)} ${botReturnRate.toFixed(2)}%`}
                  </Typography>
                </div>
              </div>
            </div>
            <div className={classNames(classes.withdrawContainerSection, 'last')}>
              <div className={classes.withdrawContainerSectionIcon}>
                <i className="icon iconfont icon-ic_wallet"></i>
              </div>
              <Typography variant="body2" className={classes.withdrawContainerSectionLabel}>
                <FormattedMessage id="withdrawDetail.withdrawTo" defaultMessage="WITHDRAW TO">
                  {(txt) => i18nToUpperCase(txt)}
                </FormattedMessage>
              </Typography>
            </div>
            {this.renderWithdrawList()}
          </div> : null
        }
      </Paper>
    );
  }

  renderWithdrawList = () => {
    const {
      winningAddresses,
    } = this.props;

    if (winningAddresses.length > 0) {
      return (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="dense">
                <FormattedMessage id="str.address" defaultMessage="Address" />
              </TableCell>
              <TableCell padding="dense">
                <FormattedMessage id="str.type" defaultMessage="Type" />
              </TableCell>
              <TableCell padding="dense">
                <FormattedMessage id="str.amount" defaultMessage="Amount" />
              </TableCell>
              <TableCell padding="dense">
                <FormattedMessage id="str.actions" defaultMessage="Actions" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {_.map(winningAddresses, (walletWithinWinnings, index) => (
              this.renderWinningWithdrawRow(walletWithinWinnings, index)
            ))}
          </TableBody>
        </Table>
      );
    }

    return null;
  };

  renderWinningWithdrawRow = (walletWithinWinnings, index) => {
    const { classes } = this.props;
    const config = this.getActionButtonConfig(walletWithinWinnings.address);

    if (!config.show) {
      return null;
    }

    return (
      <TableRow key={walletWithinWinnings.address}>
        <TableCell padding="dense">
          <div>{walletWithinWinnings.address}</div>
          <div className={config.warningTypeClass}>{config.message}</div>
        </TableCell>
        <TableCell padding="dense">Winning</TableCell>
        <TableCell padding="dense">
          {`${walletWithinWinnings.botWon} ${Token.Bot}, ${walletWithinWinnings.botWon} ${Token.Qtum}`}
        </TableCell>
        <TableCell padding="dense">
          <Button
            size="small"
            variant="raised"
            color="primary"
            disabled={config.disabled}
            data-address={walletWithinWinnings.address}
            onClick={this.onWithdrawClicked}
          >
            <FormattedMessage id="str.withdraw" defaultMessage="Withdraw" />
          </Button>
        </TableCell>
      </TableRow>
    );
  };

  getActionButtonConfig = (senderAddress) => {
    const { getTransactionsReturn, winningAddresses, classes } = this.props;
    const { address } = this.state;

    // Already have a pending tx for this Topic
    let pendingTxs = _.filter(getTransactionsReturn, {
      type: TransactionType.Withdraw,
      status: TransactionStatus.Pending,
      topicAddress: address,
      senderAddress,
    });
    if (pendingTxs.length > 0) {
      return {
        show: true,
        disabled: true,
        message: <FormattedMessage
          id="str.pendingTransactionDisabledMsg"
          defaultMessage="You have a pending transaction for this event. Please wait until it's confirmed before doing another transaction."
        />,
        warningTypeClass: classes.pending,
      };
    }

    // Already withdrawn with this address
    pendingTxs = _.filter(getTransactionsReturn, {
      type: TransactionType.Withdraw,
      status: TransactionStatus.Success,
      topicAddress: address,
      senderAddress,
    });
    if (pendingTxs.length > 0) {
      return {
        show: true,
        disabled: true,
        message: <FormattedMessage
          id="withdrawDetail.alreadyWithdrawn"
          defaultMessage="You have already withdrawn with this address."
        />,
        warningTypeClass: classes.withdrawn,
      };
    }

    // Can withdraw winning
    const winniningAddress = _.find(winningAddresses, {
      address: senderAddress,
    });
    if (winniningAddress) {
      return {
        show: true,
        disabled: false,
      };
    }

    return {
      show: true,
      disabled: true,
    };
  };

  renderOptions() {
    const {
      intl,
      classes,
      betBalances,
      voteBalances,
    } = this.props;
    const { topic } = this.state;

    return (
      <div className={classes.withdrawOptionsWrapper}>
        {_.map(topic.options, (option, index) => (
          <div key={`option-${index}`} className={classNames(classes.withdrawContainerSection, 'option')}>
            <div className={classes.eventOptionNum}>{index + 1}</div>
            <Typography variant="title" className={topic.resultIdx === index ? classes.withdrawWinningOptionSmall : null}>
              {option}
            </Typography>
            <div>
              <Typography variant="caption">
                {`${intl.formatMessage(pageMessage.totalBet)} ${topic.qtumAmount[index]} QTUM. ${intl.formatMessage(pageMessage.totalVote)} ${topic.botAmount[index]} BOT.`}
              </Typography>
            </div>
            {
              betBalances[index] || voteBalances[index] ?
                <div>
                  <Typography variant="caption">
                    {`${intl.formatMessage(pageMessage.youBet)} ${betBalances[index]} QTUM. ${intl.formatMessage(pageMessage.youVote)} ${voteBalances[index]} BOT.`}
                  </Typography>
                </div> : null
            }
          </div>
        ))}
      </div>
    );
  }

  getEventInfoObjs() {
    const { topic } = this.state;

    if (_.isEmpty(topic)) {
      return [];
    }

    const qtumTotal = _.sum(topic.qtumAmount);
    const botTotal = _.sum(topic.botAmount);

    let resultSetterQAddress;
    _.map(topic.oracles, (oracle) => {
      const setterAddress = oracle.resultSetterQAddress;
      if (setterAddress) {
        resultSetterQAddress = setterAddress;
      }
    });

    return [
      {
        label: <FormattedMessage id="eventInfo.predictionFund" defaultMessage="Prediction Fund" >{(txt) => i18nToUpperCase(txt)}</FormattedMessage>,
        content: `${qtumTotal} QTUM`,
      }, {
        label: <FormattedMessage id="eventInfo.voteVolumn" defaultMessage="Votting Volume" >{(txt) => i18nToUpperCase(txt)}</FormattedMessage>,
        content: `${botTotal} BOT`,
      }, {
        label: <FormattedMessage id="str.resultSetter" defaultMessage="Result Setter" >{(txt) => i18nToUpperCase(txt)}</FormattedMessage>,
        content: resultSetterQAddress,
      },
    ];
  }

  fetchData(senderAddress) {
    const {
      getTopics,
      getTransactions,
      getBetAndVoteBalances,
      walletAddresses,
      calculateWinnings,
    } = this.props;
    const { address } = this.state;

    // GraphQL calls
    getTopics([{ address }], undefined, 1, 0);
    getTransactions(
      [{ topicAddress: address }],
      { field: 'createdTime', direction: SortBy.Descending },
    );

    // API calls
    getBetAndVoteBalances(address, senderAddress);
    calculateWinnings(address, walletAddresses);
  }

  constructTopicAndConfig(topics, botWinnings, qtumWinnings) {
    const { syncBlockTime } = this.props;
    const { address } = this.state;
    const { locale, messages: localeMessages } = this.props.intl;
    const topic = _.find(topics, { address });

    if (topic) {
      let config;

      if (topic.status === OracleStatus.Withdraw) {
        const centralizedOracle = _.find(topic.oracles, (item) => item.token === Token.Qtum);
        const decentralizedOracles = _.orderBy(
          _.filter(topic.oracles, (item) => item.token === Token.Bot),
          ['blockNum'],
          ['asc'],
        );

        config = {
          steps: CardInfoUtil.getSteps(
            syncBlockTime,
            centralizedOracle,
            decentralizedOracles,
            true,
            locale,
            localeMessages
          ),
        };

        // highlight current step using current field
        config.steps.current = config.steps.value.length - 1;

        this.setState({
          topic,
          config,
        });
      }
    }
  }

  onAddressChange(event) {
    this.props.setLastUsedAddress(event.target.value);
  }

  onWithdrawClicked(event) {
    const {
      createWithdrawTx,
      walletEncrypted,
      walletUnlockedUntil,
      toggleWalletUnlockDialog,
    } = this.props;
    const { topic } = this.state;

    const senderAddress = event.currentTarget.getAttribute('data-address');

    if (walletEncrypted && doesUserNeedToUnlockWallet(walletUnlockedUntil)) {
      toggleWalletUnlockDialog(true);
      return;
    }

    createWithdrawTx(
      TransactionType.Withdraw,
      topic.version,
      topic.address,
      senderAddress,
    );
  }
}
