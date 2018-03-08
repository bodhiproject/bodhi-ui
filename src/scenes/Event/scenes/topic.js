/* eslint react/no-array-index-key: 0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier

import React, { PropTypes } from 'react';
import { Row, Col, Breadcrumb } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import { CircularProgress } from 'material-ui/Progress';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';

import StepperVertRight from '../../../components/StepperVertRight/index';
import CardInfo from '../../../components/bodhi-dls/cardInfo';
import CardFinished from '../../../components/bodhi-dls/cardFinished';
import EventInfo from '../components/EventInfo/index';
import EventTxHistory from '../components/EventTxHistory/index';
import TransactionSentDialog from '../../../components/TransactionSentDialog/index';
import ProgressBar from '../../../components/bodhi-dls/progressBar';
import IsoWidgetsWrapper from '../../Widgets/widgets-wrapper';
import topicActions from '../../../redux/Topic/actions';
import graphqlActions from '../../../redux/Graphql/actions';
import stateActions from '../../../redux/State/actions';
import { Token, OracleStatus } from '../../../constants';
import CardInfoUtil from '../../../helpers/cardInfoUtil';
import styles from './styles';

const pageMessage = defineMessages({
  withdraw: {
    id: 'cardFinish.withdraw',
    defaultMessage: 'You can withdraw',
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
    this.getCurrentSenderAddress = this.getCurrentSenderAddress.bind(this);
    this.executeTopicsRequest = this.executeTopicsRequest.bind(this);
    this.constructTopicAndConfig = this.constructTopicAndConfig.bind(this);
    this.handleWalletChange = this.handleWalletChange.bind(this);
  }

  componentWillMount() {
    this.executeTopicsRequest();
    this.calculateWinnings(this.props.selectedWalletAddress);
  }

  componentWillReceiveProps(nextProps) {
    const {
      getTopicsReturn,
      getTransactionsReturn,
      botWinnings,
      qtumWinnings,
      syncBlockTime,
      selectedWalletAddress,
    } = nextProps;

    // Update page on new block
    if (syncBlockTime !== this.props.syncBlockTime) {
      this.executeTopicsRequest();
    }

    // Wallet address changed, call calculate winnings again
    if (this.props.selectedWalletAddress !== selectedWalletAddress) {
      this.calculateWinnings(selectedWalletAddress);
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
              <EventTxHistory transactions={transactions} options={topic.options} />
            </Grid>
          </Grid>
          <Grid item xs={12} md={4} className={classNames(classes.eventDetailContainerGrid, 'right')}>
            <EventInfo oracle={topic} className={classes.eventDetailInfo} />
            <StepperVertRight steps={config.topicInfo.steps} />
          </Grid>
        </Grid>
        <TransactionSentDialog txReturn={this.props.txReturn} />
      </Paper>
    );
  }

  handleWalletChange(idx) {
    this.setState({ currentWalletIdx: idx });
  }

  getCurrentWalletAddr() {
    return this.props.walletAddrs[this.state.currentWalletIdx].address;
  }

  executeTopicsRequest() {
    this.props.getTopics([
      { address: this.state.address },
    ]);
    this.props.getTransactions([
      { topicAddress: this.state.address },
    ], undefined);
  }

  calculateWinnings(walletAddress) {
    const { calculateWinnings } = this.props;

    calculateWinnings(this.state.address, walletAddress);
  }

  /** Withdraw button on click handler passed down to CardFinished */
  onWithdrawClicked() {
    const { topic } = this.state;

    this.props.createWithdrawTx(topic.version, topic.address, this.getCurrentSenderAddress());
  }

  /** Return selected address on Topbar as sender * */
  getCurrentSenderAddress() {
    const { walletAddrs, walletAddrsIndex } = this.props;
    return walletAddrs[walletAddrsIndex].address;
  }

  constructTopicAndConfig(topic, botWinnings, qtumWinnings) {
    const { syncBlockTime } = this.props;

    if (topic) {
      let config;

      // Only shows Topic which are in WITHDRAW state
      if (topic.status === OracleStatus.Withdraw) {
        const centralizedOracle = _.find(topic.oracles, (item) => item.token === Token.Qtum);
        const decentralizedOracles = _.orderBy(
          _.filter(topic.oracles, (item) => item.token === Token.Bot),
          ['blockNum'],
          ['asc'],
        );

        config = {
          name: 'COMPLETED',
          breadcrumbLabel: 'Completed',
          topicInfo: {
            steps: CardInfoUtil.getSteps(
              syncBlockTime,
              centralizedOracle,
              decentralizedOracles,
              true,
            ),
            messages: [
            ],
          },
          cardAction: {
            skipToggle: true,
            beforeToggle: {
              btnText: 'Finalize',
            },
          },
        };

        // Add withdrawal amount
        config.topicInfo.messages.push({
          text: `${this.props.intl.formatMessage(pageMessage.withdraw)} ${(topic.botWinnings && topic.botWinnings.toFixed(2)) || 0} ${Token.Bot} 
            & ${(topic.qtumWinnings && topic.qtumWinnings.toFixed(2)) || 0} ${Token.Qtum}.`,
          type: 'default',
        });

        // Highlight current step using current field
        config.topicInfo.steps.current = config.topicInfo.steps.value.length - 1;

        this.setState({
          topic,
          config,
        });
      }
    }
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
  selectedWalletAddress: PropTypes.string,
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
  selectedWalletAddress: undefined,
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
  selectedWalletAddress: state.App.get('selectedWalletAddress'),
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
