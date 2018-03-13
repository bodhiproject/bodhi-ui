/* eslint react/no-array-index-key: 0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier

import React, { PropTypes } from 'react';
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

import StepperVertRight from '../../../components/StepperVertRight/index';
import EventInfo from '../components/EventInfo/index';
import EventTxHistory from '../components/EventTxHistory/index';
import TransactionSentDialog from '../../../components/TransactionSentDialog/index';
import topicActions from '../../../redux/Topic/actions';
import graphqlActions from '../../../redux/Graphql/actions';
import appActions from '../../../redux/App/actions';
import { Token, OracleStatus } from '../../../constants';
import CardInfoUtil from '../../../helpers/cardInfoUtil';
import { i18nToUpperCase } from '../../../helpers/i18nUtil';

import styles from './styles';

const pageMessage = defineMessages({
  winning: {
    id: 'withdrawDetail.winningOutcome',
    defaultMessage: 'Winning Outcome',
  },
  reward: {
    id: 'withdrawDetail.reward',
    defaultMessage: 'REWARD',
  },
  withdrawTo: {
    id: 'withdrawDetail.withdrawTo',
    defaultMessage: 'WITHDRAW TO',
  },
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
  constructor(props) {
    super(props);

    this.state = {
      address: this.props.match.params.address,
      topic: undefined,
      config: undefined,
      transactions: [],
    };

    this.onWithdrawClicked = this.onWithdrawClicked.bind(this);
    this.executeTopicAndTxsRequest = this.executeTopicAndTxsRequest.bind(this);
    this.constructTopicAndConfig = this.constructTopicAndConfig.bind(this);
    this.handleWalletChange = this.handleWalletChange.bind(this);
    this.getEventInfoObjs = this.getEventInfoObjs.bind(this);
    this.renderWithdrawContainer = this.renderWithdrawContainer.bind(this);
    this.renderOptions = this.renderOptions.bind(this);
  }

  componentWillMount() {
    const {
      getTopicsReturn,
      getTransactionsReturn,
      botWinnings,
      qtumWinnings,
    } = this.props;

    this.executeTopicAndTxsRequest();
    this.calculateWinnings();

    const topic = _.find(getTopicsReturn, { address: this.state.address });
    this.constructTopicAndConfig(topic, botWinnings, qtumWinnings);
    this.setState({ transactions: getTransactionsReturn });
  }

  componentWillReceiveProps(nextProps) {
    const {
      getTopicsReturn,
      getTransactionsReturn,
      botWinnings,
      qtumWinnings,
      syncBlockTime,
      lastUsedAddress,
    } = nextProps;


    // Update page on new block
    if (syncBlockTime !== this.props.syncBlockTime || lastUsedAddress !== this.props.lastUsedAddress) {
      this.executeTopicAndTxsRequest();
      this.calculateWinnings();
    }

    const topic = _.find(getTopicsReturn, { address: this.state.address });
    this.constructTopicAndConfig(topic, botWinnings, qtumWinnings);
    this.setState({ transactions: getTransactionsReturn });
  }

  componentWillUnmount() {
    this.props.clearTxReturn();
  }

  render() {
    const { classes, txReturn } = this.props;
    const { topic, transactions, config } = this.state;

    // TODO: is this necessary?
    if (!topic || !config) {
      // TODO: render no result page
      return <div></div>;
    }

    const qtumTotal = _.sum(topic.qtumAmount);
    const botTotal = _.sum(topic.botAmount);

    return (
      <Paper className={classes.eventDetailPaper}>
        <Grid container spacing={0}>
          <Grid item xs={12} md={8} className={classes.eventDetailContainerGrid}>
            <Typography variant="display1" className={classes.eventDetailTitle}>
              {topic.name}
            </Typography>
            <Grid item xs={12} lg={9}>
              {this.renderWithdrawContainer()}
              {this.renderOptions()}
              <EventTxHistory transactions={transactions} options={topic.options} />
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

  renderWithdrawContainer() {
    const {
      classes,
      txReturn,
      walletAddresses,
      botWinnings,
      qtumWinnings,
    } = this.props;
    const { topic, transactions, config } = this.state;

    // TODO (DERIC): CHANGE THIS TO PERSONAL AMOUNT AND RATE
    const resultBetAmount = topic.qtumAmount[topic.resultIdx];
    const resultVoteAmount = topic.botAmount[topic.resultIdx];
    const qtumReturnRate = resultBetAmount ? ((qtumWinnings - resultBetAmount) / resultBetAmount) * 100 : 0;
    const botReturnRate = resultVoteAmount ? ((botWinnings - resultVoteAmount) / resultVoteAmount) * 100 : 0;

    return (
      <Paper className={classes.withdrawPaper}>
        <div className={classes.withdrawContainerSection}>
          <div className={classes.withdrawContainerSectionIcon}>
            <i className="icon iconfont icon-ic_reward"></i>
          </div>
          <Typography variant="body2" className={classes.withdrawContainerSectionLabel}>
            {this.props.intl.formatMessage(pageMessage.winning).toUpperCase()}
          </Typography>
          <Typography className={classes.withdrawWinningOption}>
            {topic.options[topic.resultIdx]}
          </Typography>
          {
            resultBetAmount || resultVoteAmount ?
              <Typography variant="caption">
                {this.props.intl.formatMessage(pageMessage.youBet)}
                {resultBetAmount} QTUM. {this.props.intl.formatMessage(pageMessage.youVote)}
                {resultVoteAmount} BOT.
              </Typography> :
              <Typography variant="caption">
                You did not bet or vote on the winning outcome.
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
                {this.props.intl.formatMessage(pageMessage.reward)}
              </Typography>
              <div>
                <div className={classes.withdrawRewardWrapper}>
                  <Typography variant="display1">
                    +{qtumWinnings} <span className={classes.withdrawToken}>QTUM</span>
                  </Typography>
                  <Typography variant="caption">
                    {this.props.intl.formatMessage(pageMessage.returnRate)}
                    {qtumReturnRate.toFixed(2)}%
                  </Typography>
                </div>
                <div className={classes.withdrawRewardDivider} />
                <div className={classes.withdrawRewardWrapper}>
                  <Typography variant="display1">
                    +{botWinnings} <span className={classes.withdrawToken}>BOT</span>
                  </Typography>
                  <Typography variant="caption">
                    {this.props.intl.formatMessage(pageMessage.returnRate)}
                    {botReturnRate.toFixed(2)}%
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
            {this.props.intl.formatMessage(pageMessage.withdrawTo)}
          </Typography>
          <Select
            native
            fullWidth
            value={0}
            onChange={this.handleAddrChange}
            inputProps={{
              id: 'address',
            }}
          >
            {walletAddresses.map((item, index) => (
              <option key={item.address} value={index}>{item.address}</option>
            ))}
          </Select>
        </div>
        <Button
          variant="raised"
          fullWidth
          size="large"
          color="primary"
          disabled={this.state.isApproving}
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

  renderOptions() {
    const { classes } = this.props;
    const { topic, botWinnings, qtumWinnings } = this.state;

    return (
      <div className={classes.withdrawOptionsWrapper}>
        {_.map(topic.options, (option, index) => (
          <div key={`option-${index}`} className={classNames(classes.withdrawContainerSection, 'option')}>
            <div className={classes.eventOptionNum}>{index + 1}</div>
            <Typography variant="title" className={topic.resultIdx === index ? classes.withdrawWinningOptionSmall : null}>
              {option}
            </Typography>
            { // TODO (DERIC): CHANGE THIS TO PERSONAL AMOUNT AND RATE
              topic.qtumAmount[index] || topic.botAmount[index] ?
                <Typography variant="caption">
                  {this.props.intl.formatMessage(pageMessage.youBet)}
                  {topic.qtumAmount[index]} QTUM. {this.props.intl.formatMessage(pageMessage.youVote)}
                  {topic.botAmount[index]} BOT.
                </Typography> : null
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

  executeTopicAndTxsRequest() {
    this.props.getTopics([
      { address: this.state.address },
    ]);
    this.props.getTransactions([
      { topicAddress: this.state.address },
    ]);
  }

  constructTopicAndConfig(topic, botWinnings, qtumWinnings) {
    const { syncBlockTime } = this.props;
    const { locale, messages: localeMessages } = this.props.intl;

    if (topic) {
      let config;

      // only shows Topic which are in WITHDRAW state
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

  calculateWinnings() {
    const { calculateWinnings, lastUsedAddress } = this.props;

    calculateWinnings(
      this.state.address,
      lastUsedAddress,
    );
  }

  handleWalletChange(address) {
    this.props.setLastUsedAddress(address);
  }

  onWithdrawClicked() {
    const { createWithdrawTx, lastUsedAddress } = this.props;
    const { topic } = this.state;

    createWithdrawTx(
      topic.version,
      topic.address,
      lastUsedAddress,
    );
  }
}

TopicPage.propTypes = {
  classes: PropTypes.object.isRequired,
  getTopics: PropTypes.func,
  getTopicsReturn: PropTypes.array,
  getTransactions: PropTypes.func,
  getTransactionsReturn: PropTypes.array,
  createWithdrawTx: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  syncBlockTime: PropTypes.number,
  walletAddresses: PropTypes.array.isRequired,
  lastUsedAddress: PropTypes.string.isRequired,
  setLastUsedAddress: PropTypes.func.isRequired,
  calculateWinnings: PropTypes.func,
  botWinnings: PropTypes.number,
  qtumWinnings: PropTypes.number,
  clearTxReturn: PropTypes.func,
  // eslint-disable-next-line react/no-typos
  intl: intlShape.isRequired,
  txReturn: PropTypes.object,
};

TopicPage.defaultProps = {
  getTopics: undefined,
  getTopicsReturn: undefined,
  getTransactions: undefined,
  getTransactionsReturn: [],
  syncBlockTime: undefined,
  clearTxReturn: undefined,
  calculateWinnings: undefined,
  botWinnings: undefined,
  qtumWinnings: undefined,
  txReturn: undefined,
};

const mapStateToProps = (state) => ({
  syncBlockTime: state.App.get('syncBlockTime'),
  walletAddresses: state.App.get('walletAddresses'),
  lastUsedAddress: state.App.get('lastUsedAddress'),
  getTopicsReturn: state.Graphql.get('getTopicsReturn'),
  getTransactionsReturn: state.Graphql.get('getTransactionsReturn'),
  txReturn: state.Graphql.get('txReturn'),
  botWinnings: state.Topic.get('botWinnings'),
  qtumWinnings: state.Topic.get('qtumWinnings'),
});

function mapDispatchToProps(dispatch) {
  return {
    calculateWinnings: (contractAddress, senderAddress) =>
      dispatch(topicActions.calculateWinnings(contractAddress, senderAddress)),
    getTopics: () => dispatch(graphqlActions.getTopics()),
    getTransactions: (filters, orderBy) => dispatch(graphqlActions.getTransactions(filters, orderBy)),
    createWithdrawTx: (version, topicAddress, senderAddress) =>
      dispatch(graphqlActions.createWithdrawTx(version, topicAddress, senderAddress)),
    clearTxReturn: () => dispatch(graphqlActions.clearTxReturn()),
    setLastUsedAddress: (address) => dispatch(appActions.setLastUsedAddress(address)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(injectIntl(TopicPage)));
