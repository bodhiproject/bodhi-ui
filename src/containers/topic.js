import React, { PropTypes } from 'react';
import { Row, Col, Breadcrumb, Radio } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import CardInfo from '../components/bodhi-dls/cardInfo';
import CardVoting from '../components/bodhi-dls/cardVoting';
import ProgressBar from '../components/bodhi-dls/progressBar';
import LayoutContentWrapper from '../components/utility/layoutWrapper';
import IsoWidgetsWrapper from './Widgets/widgets-wrapper';
import dashboardActions from '../redux/dashboard/actions';
import topicActions from '../redux/topic/actions';

const RadioGroup = Radio.Group;
const DEFAULT_RADIO_VALUE = 0;
class TopicPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      address: this.props.match.params.address,
      topic: undefined, // Topic object for this page
      radioValue: DEFAULT_RADIO_VALUE, // Selected index of optionsIdx[]
    };

    this.onRadioGroupChange = this.onRadioGroupChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    const { getTopicsSuccess, onGetTopics } = this.props;

    // Retrive topic data if state doesn't already have it
    if (_.isUndefined(getTopicsSuccess)) {
      console.log('calling onGetTopics');
      onGetTopics();
    } else {
      const topic = _.find(getTopicsSuccess, { address: this.state.address });
      this.setState({ topic });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { getTopicsSuccess } = nextProps;

    if (!_.isEmpty(getTopicsSuccess)) {
      const topic = _.find(getTopicsSuccess, { address: this.state.address });

      this.setState({ topic });
    } else {
      console.log('getOraclesSuccess is empty');
    }
  }

  onRadioGroupChange(evt) {
    console.log(`Radio value change from ${this.state.radioValue} to ${evt.target.value}`);

    this.setState({
      radioValue: evt.target.value,
    });
  }

  /** Confirm button on click handler passed down to CardVoting */
  onSubmit(obj) {
    const { topic, radioValue } = this.state;

    const selectedIndex = topic.optionIdxs[radioValue - 1];
    const { amount } = obj;

    const walletAddrIndex = [0];
    const senderAddress = this.props.walletAddrs[walletAddrIndex];
    const contractAddress = 'fe99572f3f4fbd3ad266f2578726b24bd0583396';

    console.log(`contractAddress is ${contractAddress}, selectedIndex is ${selectedIndex}, amount is ${amount}, senderAddress is ${senderAddress}`);

    this.props.onBet(contractAddress, selectedIndex, amount, senderAddress);
  }

  render() {
    const { editingToggled, betResult } = this.props;
    const { topic } = this.state;

    if (!topic) {
      // TODO: render no result page
      return <div></div>;
    }

    const timeline = [{
      label: 'Prediction start block',
      value: topic.blockNum,
    }, {
      label: 'Prediction end block',
      value: topic.endBlock,
    }];

    const totalBalance = _.sum(topic.amounts);
    const { token } = topic;
    const betBalance = _.map(topic.optionIdxs, (optIndex, index) => ({
      name: topic.options[optIndex],
      value: `${topic.amounts[index]} ${topic.token}`,
      percent: _.floor((topic.amounts[index] / totalBalance) * 100),
    }));

    const topicElement = (<Row
      gutter={28}
      justify="center"
    >

      <Col xl={12} lg={12}>
        <IsoWidgetsWrapper padding="32px" >

          <CardInfo
            title={topic.name}
            timeline={timeline}
          >

          </CardInfo>
        </IsoWidgetsWrapper>

      </Col>
      <Col xl={12} lg={12}>
        <IsoWidgetsWrapper padding="32px">
          <CardVoting
            amount={totalBalance}
            token={token}
            voteBalance={betBalance}
            onSubmit={this.onSubmit}
            radioIndex={this.state.radioValue}
            result={betResult}
          >
            {editingToggled
              ?
              (
                <RadioGroup onChange={this.onRadioGroupChange} value={this.state.radioValue} size="large" defaultValue={DEFAULT_RADIO_VALUE}>
                  {betBalance.map((entry, index) => (
                    <Radio value={index + 1} key={entry.name}>
                      <ProgressBar
                        label={entry.name}
                        value={entry.value}
                        percent={entry.percent}
                        barHeight={12}
                        info
                      />
                    </Radio>))
                  }
                </RadioGroup>
              )
              :
              betBalance.map((entry) => (
                <ProgressBar
                  key={entry.name}
                  label={entry.name}
                  value={entry.value}
                  percent={entry.percent}
                  barHeight={12}
                  info
                  marginBottom={18}
                />))
            }
          </CardVoting>
        </IsoWidgetsWrapper>
      </Col>

    </Row>);

    return (
      <LayoutContentWrapper className="horizontalWrapper" style={{ minHeight: '100vh' }}>
        <Row style={{ width: '100%', height: '48px' }}>
          <Breadcrumb style={{ fontSize: '16px' }}>
            <Breadcrumb.Item><Link to="/">Event</Link></Breadcrumb.Item>
            <Breadcrumb.Item>Ongoing</Breadcrumb.Item>
          </Breadcrumb>
        </Row>
        <Row style={{ width: '100%' }}>
          {topicElement}
        </Row>
      </LayoutContentWrapper>
    );
  }
}

TopicPage.propTypes = {
  onGetTopics: PropTypes.func,
  getTopicsSuccess: PropTypes.oneOfType([
    PropTypes.array, // Result array
    PropTypes.string, // error message
    PropTypes.bool, // No result
  ]),
  editingToggled: PropTypes.bool,
  match: PropTypes.object,
  onBet: PropTypes.func,
  betResult: PropTypes.object,
  walletAddrs: PropTypes.array,
};

TopicPage.defaultProps = {
  getTopicsSuccess: undefined,
  onGetTopics: undefined,
  editingToggled: false,
  match: {},
  onBet: undefined,
  betResult: undefined,
  walletAddrs: [],
};

const mapStateToProps = (state) => ({
  getTopicsSuccess: state.Dashboard.get('success') && state.Dashboard.get('value'),
  editingToggled: state.Topic.get('toggled'),
  betResult: state.Topic.get('bet_result'),
  walletAddrs: state.App.get('walletAddrs'),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetTopics: () => dispatch(dashboardActions.getTopics()),
    onBet: (contractAddress, index, amount, senderAddress) =>
      dispatch(topicActions.onBet(contractAddress, index, amount, senderAddress)),
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(TopicPage);
