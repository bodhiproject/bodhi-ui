import React, { PropTypes } from 'react';
import { Row, Col, Breadcrumb } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import CardInfo from '../../components/bodhi-dls/cardInfo';
import CardFinished from '../../components/bodhi-dls/cardFinished';
import ProgressBar from '../../components/bodhi-dls/progressBar';
import IsoWidgetsWrapper from '../Widgets/widgets-wrapper';
import topicActions from '../../redux/Topic/actions';
import graphqlActions from '../../redux/Graphql/actions';
import stateActions from '../../redux/State/actions';
import { Token, OracleStatus } from '../../constants';
import CardInfoUtil from '../../helpers/cardInfoUtil';

class TopicPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      address: this.props.match.params.address,
      topic: undefined,
      config: undefined,
    };

    this.onWithdrawClicked = this.onWithdrawClicked.bind(this);
    this.getCurrentSenderAddress = this.getCurrentSenderAddress.bind(this);
    this.pageConfiguration = this.pageConfiguration.bind(this);
  }

  componentWillMount() {
    this.executeTopicsRequest();
    this.calculateWinnings(this.props.selectedWalletAddress);
  }

  componentWillReceiveProps(nextProps) {
    const {
      getTopicsReturn,
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
    this.pageConfiguration(topic, botWinnings, qtumWinnings);
  }

  componentWillUnmount() {
    this.props.clearTxReturn();
    this.props.clearEditingToggled();
  }

  render() {
    const { txReturn } = this.props;
    const { topic, config } = this.state;

    if (!topic || !config) {
      // TODO: render no result page
      return <div></div>;
    }

    const qtumTotal = _.sum(topic.qtumAmount);
    const botTotal = _.sum(topic.botAmount);

    const progressValues = _.map(topic.options, (opt, idx) => {
      const qtumAmount = topic.qtumAmount[idx];
      const botAmount = topic.botAmount[idx];

      return {
        name: opt,
        value: `${qtumAmount.toFixed(2)} ${Token.Qtum}, ${botAmount.toFixed(2)} ${Token.Bot}`,
        percent: qtumTotal === 0 ? qtumTotal : _.round((qtumAmount / qtumTotal) * 100),
        secondaryPercent: botTotal === 0 ? botTotal : _.round((botAmount / botTotal) * 100),
      };
    });

    const topicElement = (<Row
      gutter={28}
      justify="center"
    >

      {config.cardInfo ?
        <Col xl={12} lg={12}>
          <IsoWidgetsWrapper padding="32px" >
            <CardInfo
              title={topic.name}
              config={config.cardInfo}
            >
            </CardInfo>
          </IsoWidgetsWrapper>
        </Col> : null}

      {config.cardAction ?
        <Col xl={12} lg={12}>
          <IsoWidgetsWrapper padding="32px">
            <CardFinished
              amount={qtumTotal}
              onWithdraw={this.onWithdrawClicked}
              radioIndex={topic.resultIdx}
              result={txReturn}
            >
              {_.map(progressValues, (entry, index) => (
                <ProgressBar
                  key={`progress ${index}`}
                  label={entry.name}
                  value={entry.value}
                  percent={entry.percent}
                  barHeight={12}
                  barColor={topic.resultIdx === index ? '' : 'grey'}
                  secondaryPercent={entry.secondaryPercent}
                  secondaryBarHeight={10}
                  marginBottom={18}
                />))}
            </CardFinished>
          </IsoWidgetsWrapper>
        </Col>
        : null}
    </Row>);

    return (
      <div>
        <Row style={{ width: '100%', height: '48px' }}>
          <Breadcrumb style={{ fontSize: '16px' }}>
            <Breadcrumb.Item><Link to="/"><FormattedMessage id="topbar.event" /></Link></Breadcrumb.Item>
            <Breadcrumb.Item><FormattedMessage id="topbar.completed" /></Breadcrumb.Item>
          </Breadcrumb>
        </Row>
        <Row style={{ width: '100%' }}>
          {topicElement}
        </Row>
      </div>
    );
  }

  executeTopicsRequest() {
    this.props.getTopics([
      { address: this.state.address },
    ]);
  }

  calculateWinnings(walletAddress) {
    const { calculateWinnings } = this.props;

    calculateWinnings(this.state.address, walletAddress);
  }

  /** Withdraw button on click handler passed down to CardFinished */
  onWithdrawClicked() {
    const senderAddress = this.getCurrentSenderAddress();
    const contractAddress = this.state.topic.address;

    this.props.createWithdrawTx(contractAddress, senderAddress);
  }

  /** Return selected address on Topbar as sender * */
  getCurrentSenderAddress() {
    const { walletAddrs, walletAddrsIndex } = this.props;
    return walletAddrs[walletAddrsIndex].address;
  }

  pageConfiguration(topic, botWinnings, qtumWinnings) {
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
          cardInfo: {
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
        config.cardInfo.messages.push({
          text: `${this.props.intl.formatMessage({ id: 'cardfinish.withdraw' })} 
            ${(botWinnings && botWinnings.toFixed(2)) || 0} ${Token.Bot} 
            & ${(qtumWinnings && qtumWinnings.toFixed(2)) || 0} ${Token.Qtum}.`,
          type: 'default',
        });

        // Highlight current step using current field
        config.cardInfo.steps.current = config.cardInfo.steps.value.length - 1;

        this.setState({
          topic,
          config,
        });
      }
    }
  }
}

TopicPage.propTypes = {
  getTopics: PropTypes.func,
  getTopicsReturn: PropTypes.array,
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
  clearEditingToggled: PropTypes.func,
  // eslint-disable-next-line react/no-typos
  intl: intlShape.isRequired,
  txReturn: PropTypes.object,
};

TopicPage.defaultProps = {
  getTopics: undefined,
  getTopicsReturn: undefined,
  syncBlockTime: undefined,
  walletAddrs: [],
  walletAddrsIndex: 0,
  selectedWalletAddress: undefined,
  clearTxReturn: undefined,
  clearEditingToggled: undefined,
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
  txReturn: state.Graphql.get('txReturn'),
  botWinnings: state.Topic.get('botWinnings'),
  qtumWinnings: state.Topic.get('qtumWinnings'),
});

function mapDispatchToProps(dispatch) {
  return {
    calculateWinnings: (contractAddress, senderAddress) =>
      dispatch(topicActions.calculateWinnings(contractAddress, senderAddress)),
    getTopics: () => dispatch(graphqlActions.getTopics()),
    createWithdrawTx: (topicAddress, senderAddress) =>
      dispatch(graphqlActions.createWithdrawTx(topicAddress, senderAddress)),
    clearTxReturn: () => dispatch(graphqlActions.clearTxReturn()),
    clearEditingToggled: () => dispatch(stateActions.clearEditingToggled()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(TopicPage));
