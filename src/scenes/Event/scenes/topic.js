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
import { Token, OracleStatus } from '../../../constants';
import CardInfoUtil from '../../../helpers/cardInfoUtil';

import styles from './styles';

const pageMessage = defineMessages({
  winning: {
    id: 'withdrawDetail.winningOutcome',
    defaultMessage: 'WINNING OUTCOME',
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
    defaultMessage: 'You bet ',
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
      currentWalletIdx: this.props.walletAddrsIndex ? this.props.walletAddrsIndex : 0,
    };

    this.onWithdrawClicked = this.onWithdrawClicked.bind(this);
    this.getSelectedAddress = this.getSelectedAddress.bind(this);
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
    } = nextProps;


    // Update page on new block
    if (syncBlockTime !== this.props.syncBlockTime) {
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
      walletAddrs,
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
            {this.props.intl.formatMessage(pageMessage.winning)}
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
                <i className="icon iconfont icon-coin"></i>
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
                    {qtumReturnRate}%
                  </Typography>
                </div>
                <div className={classes.withdrawRewardDivider} />
                <div className={classes.withdrawRewardWrapper}>
                  <Typography variant="display1">
                    +{botWinnings} <span className={classes.withdrawToken}>BOT</span>
                  </Typography>
                  <Typography variant="caption">
                    {this.props.intl.formatMessage(pageMessage.returnRate)}
                    {botReturnRate}%
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
            {walletAddrs.map((item, index) => (
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
              'Withdraw'
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
          <div className={classNames(classes.withdrawContainerSection, 'option')}>
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
        label: <FormattedMessage id="eventInfo.predictionFund" defaultMessage="PREDICTION FUNDING" />,
        content: `${qtumTotal} QTUM`,
      }, {
        label: <FormattedMessage id="eventInfo.voteVolumn" defaultMessage="VOTING VOLUME" />,
        content: `${botTotal} BOT`,
      }, {
        label: <FormattedMessage id="eventInfo.resultSetter" defaultMessage="RESULT SETTER" />,
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
    ], undefined);
  }

  constructTopicAndConfig(topic, botWinnings, qtumWinnings) {
    const { syncBlockTime } = this.props;

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
    if (this.props.walletAddrs.length) {
      this.props.calculateWinnings(
        this.state.address,
        this.getSelectedAddress()
      );
    }
  }

  handleWalletChange(idx) {
    this.setState({ currentWalletIdx: idx });
    this.calculateWinnings();
  }

  getSelectedAddress() {
    return this.props.walletAddrs[this.state.currentWalletIdx].address;
  }

  onWithdrawClicked() {
    const { topic } = this.state;

    this.props.createWithdrawTx(
      topic.version,
      topic.address,
      this.getSelectedAddress()
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
  walletAddrs: PropTypes.array,
  walletAddrsIndex: PropTypes.number,
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
  walletAddrs: [],
  walletAddrsIndex: 0,
  clearTxReturn: undefined,
  calculateWinnings: undefined,
  botWinnings: undefined,
  qtumWinnings: undefined,
  txReturn: undefined,
};

const mapStateToProps = (state) => ({
  syncBlockTime: state.App.get('syncBlockTime'),
  walletAddrs: state.App.get('walletAddrs'),
  walletAddrsIndex: state.App.get('walletAddrsIndex'),
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(injectIntl(TopicPage)));
