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

import styles from './styles';
import StepperVertRight from '../../../components/StepperVertRight/index';
import EventInfo from '../components/EventInfo/index';
import EventTxHistory from '../components/EventTxHistory/index';
import EventResultHistory from '../components/EventTxHistory/resultHistory';
import EventWarning from '../../../components/EventWarning/index';
import TransactionSentDialog from '../../../components/TransactionSentDialog/index';
import appActions from '../../../redux/App/actions';
import topicActions from '../../../redux/Topic/actions';
import graphqlActions from '../../../redux/Graphql/actions';
import { Token, OracleStatus, TransactionStatus, EventWarningType } from '../../../constants';
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
    defaultMessage: 'You bet ',
  },
  youVote: {
    id: 'withdrawDetail.youVote',
    defaultMessage: 'You vote ',
  },
});

class TopicPage extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    getTopics: PropTypes.func.isRequired,
    getTopicsReturn: PropTypes.array,
    getTransactions: PropTypes.func.isRequired,
    getTransactionsReturn: PropTypes.array,
    getBetAndVoteBalances: PropTypes.func.isRequired,
    betBalances: PropTypes.array,
    voteBalances: PropTypes.array,
    calculateWinnings: PropTypes.func.isRequired,
    botWinnings: PropTypes.number,
    qtumWinnings: PropTypes.number,
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
      lastUsedAddress,
      getBetAndVoteBalances,
      getTopicsReturn,
      getTransactionsReturn,
      botWinnings,
      qtumWinnings,
    } = this.props;
    const { address } = this.state;

    this.fetchData(lastUsedAddress);
  }

  componentWillReceiveProps(nextProps) {
    const {
      syncBlockTime,
      lastUsedAddress,
      getTopicsReturn,
    } = this.props;
    const { address } = this.state;

    // Update page on new block
    if (nextProps.syncBlockTime !== syncBlockTime || nextProps.lastUsedAddress !== lastUsedAddress) {
      this.fetchData(nextProps.lastUsedAddress ? nextProps.lastUsedAddress : lastUsedAddress);
    }

    const topics = nextProps.getTopicsReturn ? nextProps.getTopicsReturn : getTopicsReturn;
    this.constructTopicAndConfig(topics, nextProps.botWinnings, nextProps.qtumWinnings);
  }

  componentWillUnmount() {
    this.props.clearTxReturn();
  }

  render() {
    const { classes, txReturn, getTransactionsReturn } = this.props;
    const { topic, config } = this.state;

    if (!topic || !config) {
      return null;
    }

    const qtumTotal = _.sum(topic.qtumAmount);
    const botTotal = _.sum(topic.botAmount);
    const actionButtonConfig = this.getActionButtonConfig();

    return (
      <Paper className={classes.eventDetailPaper}>
        <Grid container spacing={0}>
          <Grid item xs={12} md={8} className={classes.eventDetailContainerGrid}>
            <Typography variant="display1" className={classes.eventDetailTitle}>
              {topic.name}
            </Typography>
            <Grid item xs={12} lg={9}>
              <EventWarning message={actionButtonConfig.message} typeClass={actionButtonConfig.warningTypeClass} />
              {this.renderWithdrawContainer(actionButtonConfig)}
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
    );
  }

  renderWithdrawContainer(actionButtonConfig) {
    const {
      intl,
      classes,
      walletAddresses,
      betBalances,
      voteBalances,
      botWinnings,
      qtumWinnings,
      lastUsedAddress,
    } = this.props;
    const { topic, config } = this.state;

    const resultBetAmount = betBalances[topic.resultIdx];
    const resultVoteAmount = voteBalances[topic.resultIdx];
    const qtumReturnRate = resultBetAmount ? ((qtumWinnings - resultBetAmount) / resultBetAmount) * 100 : 0;
    const botReturnRate = resultVoteAmount ? ((botWinnings - resultVoteAmount) / resultVoteAmount) * 100 : 0;

    return (
      <Paper className={classes.withdrawPaper}>
        <div className={classes.withdrawContainerSection}>
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
        {
          botWinnings || qtumWinnings || true ?
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
            </div> : null
        }
        <div className={classNames(classes.withdrawContainerSection, 'last')}>
          <div className={classes.withdrawContainerSectionIcon}>
            <i className="icon iconfont icon-ic_wallet"></i>
          </div>
          <Typography variant="body2" className={classes.withdrawContainerSectionLabel}>
            <FormattedMessage id="withdrawDetail.withdrawTo" defaultMessage="WITHDRAW TO">
              {(txt) => i18nToUpperCase(txt)}
            </FormattedMessage>
          </Typography>
          <Select
            native
            fullWidth
            value={lastUsedAddress}
            onChange={this.onAddressChange}
            inputProps={{ id: 'address' }}
          >
            {walletAddresses.map((item) => (
              <option key={item.address} value={item.address}>{item.address}</option>
            ))}
          </Select>
        </div>
        <Button
          variant="raised"
          fullWidth
          size="large"
          color="primary"
          disabled={actionButtonConfig.disabled}
          onClick={this.onWithdrawClicked}
          className={classes.eventActionButton}
        >
          {
            this.state.isApproving ?
              <CircularProgress className={classes.progress} size={30} style={{ color: 'white' }} /> :
              <FormattedMessage id="str.withdraw" defaultMessage="Withdraw" />
          }
        </Button>
      </Paper>
    );
  }

  getActionButtonConfig() {
    const { getTransactionsReturn, lastUsedAddress } = this.props;
    const { address } = this.state;

    // Already have a pending tx for this Topic
    let pendingTxs = _.filter(getTransactionsReturn, { topicAddress: address, status: TransactionStatus.Pending });
    if (pendingTxs.length > 0) {
      return {
        disabled: true,
        message: <FormattedMessage
          id="str.pendingTransactionDisabledMsg"
          defaultMessage="You have a pending transaction for this event. Please wait until it's confirmed before doing another transaction."
        />,
        warningTypeClass: EventWarningType.Highlight,
      };
    }

    // Already withdrawn with this address
    pendingTxs = _.filter(getTransactionsReturn, {
      topicAddress: address,
      status: TransactionStatus.Success,
      senderAddress: lastUsedAddress,
    });
    if (pendingTxs.length > 0) {
      return {
        disabled: true,
        message: <FormattedMessage
          id="withdrawDetail.alreadyWithdrawn"
          defaultMessage="You have already withdrawn with this address."
        />,
        warningTypeClass: EventWarningType.Info,
      };
    }

    return {
      disabled: false,
    };
  }

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
            {
              betBalances[index] || voteBalances[index]
                ? <Typography variant="caption">
                  {`${intl.formatMessage(pageMessage.youBet)} ${betBalances[index]} QTUM. ${intl.formatMessage(pageMessage.youVote)} ${voteBalances[index]} BOT.`}
                </Typography>
                : null
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
        label: <FormattedMessage id="eventInfo.resultSetter" defaultMessage="Result Setter" >{(txt) => i18nToUpperCase(txt)}</FormattedMessage>,
        content: resultSetterQAddress,
      },
    ];
  }

  fetchData(senderAddress) {
    const {
      getTopics,
      getTransactions,
      getBetAndVoteBalances,
      calculateWinnings,
    } = this.props;
    const { address } = this.state;

    // GraphQL calls
    getTopics([{ address }]);
    getTransactions([{ topicAddress: address }]);

    // API calls
    getBetAndVoteBalances(address, senderAddress);
    calculateWinnings(address, senderAddress);
  }

  constructTopicAndConfig(getTopicsReturn, botWinnings, qtumWinnings) {
    const { syncBlockTime } = this.props;
    const { address } = this.state;
    const { locale, messages: localeMessages } = this.props.intl;
    const topic = _.find(getTopicsReturn, { address });

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

  onWithdrawClicked() {
    const {
      createWithdrawTx,
      lastUsedAddress,
      walletEncrypted,
      walletUnlockedUntil,
      toggleWalletUnlockDialog,
    } = this.props;
    const { topic } = this.state;

    if (walletEncrypted && doesUserNeedToUnlockWallet(walletUnlockedUntil)) {
      toggleWalletUnlockDialog(true);
      return;
    }

    createWithdrawTx(
      topic.version,
      topic.address,
      lastUsedAddress,
    );
  }
}

const mapStateToProps = (state) => ({
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
});

function mapDispatchToProps(dispatch) {
  return {
    getBetAndVoteBalances: (contractAddress, senderAddress) =>
      dispatch(topicActions.getBetAndVoteBalances(contractAddress, senderAddress)),
    calculateWinnings: (contractAddress, senderAddress) =>
      dispatch(topicActions.calculateWinnings(contractAddress, senderAddress)),
    getTopics: () => dispatch(graphqlActions.getTopics()),
    getTransactions: (filters, orderBy) => dispatch(graphqlActions.getTransactions(filters, orderBy)),
    createWithdrawTx: (version, topicAddress, senderAddress) =>
      dispatch(graphqlActions.createWithdrawTx(version, topicAddress, senderAddress)),
    clearTxReturn: () => dispatch(graphqlActions.clearTxReturn()),
    toggleWalletUnlockDialog: (isVisible) => dispatch(appActions.toggleWalletUnlockDialog(isVisible)),
    setLastUsedAddress: (address) => dispatch(appActions.setLastUsedAddress(address)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(injectIntl(TopicPage)));
