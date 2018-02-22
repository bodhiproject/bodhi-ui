import React, { PropTypes } from 'react';
import { Row, Col, Breadcrumb } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import CardInfo from '../components/bodhi-dls/cardInfo';
import CardFinished from '../components/bodhi-dls/cardFinished';
import ProgressBar from '../components/bodhi-dls/progressBar';
import LayoutContentWrapper from '../components/utility/layoutWrapper';
import IsoWidgetsWrapper from './Widgets/widgets-wrapper';
import dashboardActions from '../redux/dashboard/actions';
import topicActions from '../redux/topic/actions';
import { Token, OracleStatus } from '../constants';
import CardInfoUtil from '../helpers/cardInfoUtil';

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
    this.calculateWinnings();
  }

  componentWillReceiveProps(nextProps) {
    const {
      getTopicsSuccess,
      calculateBotWinningsReturn,
      calculateQtumWinningsReturn,
      syncBlockTime,
    } = nextProps;

    // Update page on new block
    if (syncBlockTime !== this.props.syncBlockTime) {
      this.executeTopicsRequest();
    }

    // Wallet address changed, call calculate winnings again
    if (this.props.selectedWalletAddress !== nextProps.selectedWalletAddress) {
      this.calculateWinnings();
    }

    const topic = _.find(getTopicsSuccess, { address: this.state.address });
    topic.botWinnings = calculateBotWinningsReturn;
    topic.qtumWinnings = calculateQtumWinningsReturn;

    this.pageConfiguration(topic);
  }

  componentWillUnmount() {
    this.props.onClearRequestReturn();
    this.props.clearEditingToggled();
  }

  render() {
    const { requestReturn } = this.props;
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
              result={requestReturn}
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
      <LayoutContentWrapper className="horizontalWrapper" style={{ minHeight: '100vh' }}>
        <Row style={{ width: '100%', height: '48px' }}>
          <Breadcrumb style={{ fontSize: '16px' }}>
            <Breadcrumb.Item><Link to="/">Event</Link></Breadcrumb.Item>
            <Breadcrumb.Item>Completed</Breadcrumb.Item>
          </Breadcrumb>
        </Row>
        <Row style={{ width: '100%' }}>
          {topicElement}
        </Row>
      </LayoutContentWrapper>
    );
  }

  executeTopicsRequest() {
    this.props.getTopics([
      { address: this.state.address },
    ]);
  }

  calculateWinnings() {
    try {
      const {
        selectedWalletAddress,
        onCalculateWinnings,
      } = this.props;

      onCalculateWinnings(this.state.address, selectedWalletAddress);
    } catch (err) {
      console.log(err.message);
    }
  }

  /** Withdraw button on click handler passed down to CardFinished */
  onWithdrawClicked() {
    const senderAddress = this.getCurrentSenderAddress();
    const contractAddress = this.state.topic.address;

    this.props.onWithdraw(contractAddress, senderAddress);
  }

  /** Return selected address on Topbar as sender * */
  getCurrentSenderAddress() {
    const { walletAddrs, walletAddrsIndex } = this.props;
    return walletAddrs[walletAddrsIndex].address;
  }

  /**
   * Configure UI elements in this.state.config and set topic object in this.state
   * @param  {object} topic object
   * @return {}
   */
  pageConfiguration(topic) {
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
          text: `You can withdraw ${(topic.botWinnings && topic.botWinnings.toFixed(2)) || 0} ${Token.Bot} 
            & ${(topic.qtumWinnings && topic.qtumWinnings.toFixed(2)) || 0} ${Token.Qtum}.`,
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
  getTopicsSuccess: PropTypes.oneOfType([
    PropTypes.array, // Result array
    PropTypes.string, // error message
    PropTypes.bool, // No result
  ]),
  match: PropTypes.object.isRequired,
  requestReturn: PropTypes.object,
  syncBlockTime: PropTypes.number,
  walletAddrs: PropTypes.array,
  walletAddrsIndex: PropTypes.number,
  selectedWalletAddress: PropTypes.string,
  onCalculateWinnings: PropTypes.func,
  calculateBotWinningsReturn: PropTypes.number,
  calculateQtumWinningsReturn: PropTypes.number,
  onWithdraw: PropTypes.func.isRequired,
  onClearRequestReturn: PropTypes.func,
  clearEditingToggled: PropTypes.func,
};

TopicPage.defaultProps = {
  getTopics: undefined,
  getTopicsSuccess: undefined,
  requestReturn: undefined,
  syncBlockTime: undefined,
  walletAddrs: [],
  walletAddrsIndex: 0,
  selectedWalletAddress: undefined,
  onClearRequestReturn: undefined,
  clearEditingToggled: undefined,
  onCalculateWinnings: undefined,
  calculateBotWinningsReturn: undefined,
  calculateQtumWinningsReturn: undefined,
};

const mapStateToProps = (state) => ({
  getTopicsSuccess: state.Dashboard.get('success') && state.Dashboard.get('value'),
  requestReturn: state.Topic.get('req_return'),
  calculateBotWinningsReturn: state.Topic.get('calculate_bot_winnings_return'),
  calculateQtumWinningsReturn: state.Topic.get('calculate_qtum_winnings_return'),
  syncBlockTime: state.App.get('syncBlockTime'),
  walletAddrs: state.App.get('walletAddrs'),
  walletAddrsIndex: state.App.get('walletAddrsIndex'),
  selectedWalletAddress: state.App.get('selected_wallet_address'),
});

function mapDispatchToProps(dispatch) {
  return {
    getTopics: () => dispatch(dashboardActions.getTopics()),
    onCalculateWinnings: (contractAddress, senderAddress) =>
      dispatch(topicActions.onCalculateWinnings(contractAddress, senderAddress)),
    onWithdraw: (contractAddress, senderAddress) => dispatch(topicActions.onWithdraw(contractAddress, senderAddress)),
    onClearRequestReturn: () => dispatch(topicActions.onClearRequestReturn()),
    clearEditingToggled: () => dispatch(topicActions.clearEditingToggled()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TopicPage);
