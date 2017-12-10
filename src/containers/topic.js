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

const RadioGroup = Radio.Group;

class TopicPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      radioValue: 1,
    };

    this.onRadioGroupChange = this.onRadioGroupChange.bind(this);
  }

  componentWillMount() {
    // Retrive topic data if state doesn't already have it
    if (_.isUndefined(this.props.getTopicsSuccess)) {
      this.props.onGetTopics();
    }
  }

  onRadioGroupChange(evt) {
    this.setState({
      radioValue: evt.target.value,
    });
  }

  /** Confirm button on click handler passed down to CardVoting */
  onSubmit() {
    console.log('this.state.radioValue', this.state.radioValue);
  }

  render() {
    const { match, getTopicsSuccess, editingToggled } = this.props;
    const { topicAddress } = match.params;

    const topic = _.find(getTopicsSuccess, { address: topicAddress });

    let topicElement;

    if (topic) {
      console.log('Found topic', topic);
      const lastOracle = _.last(topic.oracles);
      const timeline = [{
        label: 'Prediction end block',
        value: lastOracle.endBlock,
      }, {
        label: 'Result end block',
        value: topic.resultSettingEndBlock,
      }];

      const totalBalance = _.sum(lastOracle.amounts);
      const betBalance = _.map(lastOracle.optionIdxs, (optIndex, index) => ({
        name: topic.options[optIndex],
        value: `${lastOracle.amounts[index]} ${lastOracle.token}`,
        percent: _.floor((lastOracle.amounts[index] / totalBalance) * 100),
      }));

      topicElement = (<Row
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

            <CardVoting amount={totalBalance} token={lastOracle.token} voteBalance={betBalance} onClick={this.onSubmit}>
              {editingToggled
                ?
                (
                  <RadioGroup onChange={this.onRadioGroupChange} value={this.state.radioValue} size="large" defaultValue={1}>
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
    } else {
      console.log('topic not load yet');
    }

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
  getTopicsSuccess: PropTypes.oneOfType([
    PropTypes.array, // Result array
    PropTypes.string, // error message
    PropTypes.bool, // No result
  ]),
  editingToggled: PropTypes.bool,
  match: PropTypes.object,
  onGetTopics: PropTypes.func,

};

TopicPage.defaultProps = {
  getTopicsSuccess: undefined,
  editingToggled: false,
  match: {},
  onGetTopics: undefined,

};

const mapStateToProps = (state) => ({
  getTopicsSuccess: state.Dashboard.get('success') && state.Dashboard.get('value'),
  editingToggled: state.Topic.get('toggled'),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetTopics: () => dispatch(dashboardActions.getTopics()),
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(TopicPage);
