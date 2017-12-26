/* eslint react/no-array-index-key: 0, no-nested-ternary:0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier

import React, { PropTypes } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';

import LayoutContentWrapper from '../components/utility/layoutWrapper';
import IsoWidgetsWrapper from './Widgets/widgets-wrapper';
import BottomButtonWidget from './Widgets/bottom-button';
import SingleProgressWidget from './Widgets/progress/progress-single';
import ReportsWidget from './Widgets/report/report-widget';
import TabBtnGroup from '../components/bodhi-dls/tabBtnGroup';
import dashboardActions from '../redux/dashboard/actions';

const TAB_BETTING = 0;
const TAB_SETTING = 1;
const TAB_VOTING = 2;
const TAB_COMPLETED = 3;
const DEFAULT_TAB_INDEX = TAB_BETTING;
const QTUM = 'QTUM';
const BOT = 'BOT';
const NUM_SHOW_IN_OPTIONS = 3;
const COL_PER_ROW = { // Specify how many col in each row
  xs: 1,
  sm: 3,
  xl: 4,
};
const ROW_GUTTER = {
  xs: 0,
  sm: 16, // Set gutter to 16 + 8 * n, with n being a natural number
  md: 24,
  lg: 24,
  xl: 32,
  xxl: 32,
};

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentWillMount() {
    this.props.onGetTopics();
    this.props.onGetOracles();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tabIndex !== this.props.tabIndex) {
      this.props.onGetTopics();
      this.props.onGetOracles();
    }
  }

  render() {
    const { tabIndex, getTopicsSuccess, getOraclesSuccess } = this.props;

    // Sorting all topics and oracles by blockNum in descending order now
    const topicEvents = _.orderBy(getTopicsSuccess, ['blockNum'], ['desc']);
    const allOracles = _.orderBy(getOraclesSuccess, ['blockNum'], ['desc']);

    let rowItems;
    switch (tabIndex) {
      case TAB_BETTING: {
        rowItems = buildOracleColElement(_.filter(allOracles, { token: 'QTUM', status: 'VOTING' }));
        break;
      }
      case TAB_SETTING: {
        rowItems = buildOracleColElement(_.filter(allOracles, { token: 'QTUM', status: 'WAITRESULT' }));
        break;
      }
      case TAB_VOTING: {
        rowItems = buildOracleColElement(_.filter(allOracles, (oracle) => oracle.token === BOT && oracle.status !== 'WITHDRAW'));
        break;
      }
      case TAB_COMPLETED: {
        rowItems = getFinishedItems(_.filter(topicEvents, { status: 'WITHDRAW' }));
        break;
      }
      default: {
        throw new RangeError('Invalid tab position');
      }
    }

    return (
      <LayoutContentWrapper
        className="horizontalWrapper"
        style={{ minHeight: '100vh', paddingTop: '50px', paddingBottom: '50px' }}
      >
        <TabBtnGroup
          buttons={[{
            text: 'Betting',
          }, {
            text: 'Setting',
          }, {
            text: 'Voting',
          }, {
            text: 'Completed',
          }]}
        />
        <Row
          // style={rowStyle}
          gutter={28}
          justify="center"
        >
          {rowItems}
        </Row>
      </LayoutContentWrapper>
    );
  }
}

/**
 * Build Col in Betting, Setting and Voting tabs using Oracles array
 * @param  {[type]} oracles [description]
 * @return {[type]}         [description]
 */
function buildOracleColElement(oracles) {
  // Calculate grid number for Col attribute
  const colWidth = {};

  Object.keys(COL_PER_ROW).forEach((key) => {
    colWidth[key] = 24 / COL_PER_ROW[key];
  });

  const rowItems = [];

  _.each(oracles, (oracle) => {
    const totalBalance = _.sum(oracle.amounts);

    const raisedString = `Raised: ${totalBalance} ${oracle.token}`;
    const endBlockString = `Ends: ${oracle.endBlock ? oracle.endBlock : '45000'}`;

    let displayOptions = [];

    // Determine what options showing in progress bars
    if (oracle.token === 'BOT') {
      displayOptions = _.filter(oracle.options, (option, index) => {
        // If index of option is in optionsIdx array
        if (oracle.optionIdxs.indexOf(index) >= 0) {
          return option;
        }

        return false;
      });
    } else {
      displayOptions = _.map(oracle.options, _.clone);
    }

    // Trim options array to only NUM_SHOW_IN_OPTIONS (3) elements
    if (!_.isEmpty(displayOptions) && displayOptions.length > NUM_SHOW_IN_OPTIONS) {
      displayOptions = displayOptions.slice(0, NUM_SHOW_IN_OPTIONS);
    }

    // Constructing opitons elements
    let optionsEle = null;

    if (!_.isEmpty(displayOptions)) {
      optionsEle = displayOptions.map((result, index) => (
        <SingleProgressWidget
          key={`option${index}`}
          label={result}
          percent={totalBalance === 0 ? totalBalance : _.floor((oracle.amounts[index] / totalBalance) * 100)}
          barHeight={12}
          fontColor="#4A4A4A"
        />
      ));
    }

    // Make sure length of options element array is NUM_SHOW_IN_OPTIONS (3) so that every card has the same height
    // Ideally there should a be loop in case NUM_SHOW_IN_OPTIONS is greater than 3
    if (optionsEle && optionsEle.length < NUM_SHOW_IN_OPTIONS) {
      for (let i = optionsEle.length; i < NUM_SHOW_IN_OPTIONS; i += 1) {
        optionsEle.push(<div key={`option-placeholder-${i}`} style={{ height: '48px', marginTop: '18px', marginBottom: '18px' }}></div>);
      }
    }

    // Constructing Card element on the right
    const oracleEle = (
      <Col
        xs={colWidth.xs}
        sm={colWidth.sm}
        xl={colWidth.xl}
        key={oracle.address}
        style={{ marginBottom: '24px' }}
      >
        <IsoWidgetsWrapper>
          {/* Report Widget */}
          <ReportsWidget
            label={oracle.name}
            details={[raisedString, endBlockString]}
          >
            {optionsEle}
          </ReportsWidget>
          <BottomButtonWidget
            pathname={`/oracle/${oracle.address}`}
            text={oracle.token === QTUM ? (oracle.status === 'WAITRESULT' ? 'Set Result' : 'Participate') : 'Vote'}
          />
        </IsoWidgetsWrapper>
      </Col>
    );

    rowItems.push(oracleEle);
  });

  return rowItems;
}

/**
 * Build Col in Completed tab using topics array
 * @param  {[type]} topicEvents [description]
 * @return {[type]}             [description]
 */
function getFinishedItems(topicEvents) {
  // Calculate grid number for Col attribute
  const colWidth = {};

  Object.keys(COL_PER_ROW).forEach((key) => {
    colWidth[key] = 24 / COL_PER_ROW[key];
  });

  const rowItems = [];

  _.each(topicEvents, (topic) => {
    const qtumTotal = _.sum(topic.qtumAmount);
    const botTotal = _.sum(topic.botAmount);

    const raisedString = `Raised: ${qtumTotal} QTUM, ${botTotal} BOT`;
    const endBlockString = `Ends: ${topic.endBlock ? topic.endBlock : ''}`;

    let optionBalances = _.map(topic.options, (opt, idx) => {
      const qtumAmount = topic.qtumAmount[idx];
      const botAmount = topic.botAmount[idx];

      return {
        name: opt,
        value: `${qtumAmount} ${QTUM}, ${botAmount} ${BOT}`,
        percent: qtumTotal === 0 ? qtumTotal : _.floor((qtumAmount / qtumTotal) * 100),
        secondaryPercent: botTotal === 0 ? botTotal : _.floor((botAmount / botTotal) * 100),
      };
    });

    // Trim options array to only NUM_SHOW_IN_OPTIONS (3) elements
    if (!_.isEmpty(optionBalances) && optionBalances.length > NUM_SHOW_IN_OPTIONS) {
      optionBalances = optionBalances.slice(0, NUM_SHOW_IN_OPTIONS);
    }

    // Constructing opitons elements
    let optionsEle = null;

    if (!_.isEmpty(optionBalances)) {
      optionsEle = optionBalances.map((item, index) => (
        <SingleProgressWidget
          key={`option${index}`}
          label={item.name}
          percent={item.percent}
          barHeight={12}
          fontColor="#4A4A4A"
          barColor={topic.resultIdx === index ? '' : 'grey'}
          secondaryPercent={item.secondaryPercent}
          secondaryBarHeight={item.secondaryBarHeight}
        />
      ));
    }

    // Make sure length of options element array is NUM_SHOW_IN_OPTIONS (3) so that every card has the same height
    // Ideally there should a be loop in case NUM_SHOW_IN_OPTIONS is greater than 3
    if (optionsEle && optionsEle.length < NUM_SHOW_IN_OPTIONS) {
      for (let i = optionsEle.length; i < NUM_SHOW_IN_OPTIONS; i += 1) {
        optionsEle.push(<div key={`option-placeholder-${i}`} style={{ height: '72px', marginTop: '18px', marginBottom: '18px' }}></div>);
      }
    }

    const topicEle = (
      <Col xs={colWidth.xs} sm={colWidth.sm} xl={colWidth.xl} key={topic.address} style={{ marginBottom: '24px' }}>
        <IsoWidgetsWrapper>
          {/* Report Widget */}
          <ReportsWidget
            label={topic.name}
            details={[raisedString, endBlockString]}
          >
            {optionsEle}
          </ReportsWidget>

          <BottomButtonWidget pathname={`/topic/${topic.address}`} text="Check out" />
        </IsoWidgetsWrapper>
      </Col>
    );

    rowItems.push(topicEle);
  });
  return rowItems;
}

Dashboard.propTypes = {
  getTopicsSuccess: PropTypes.oneOfType([
    PropTypes.array, // Result array
    PropTypes.string, // error message
    PropTypes.bool, // No result
  ]),
  onGetTopics: PropTypes.func,
  getOraclesSuccess: PropTypes.oneOfType([
    PropTypes.array, // Result array
    PropTypes.string, // error message
    PropTypes.bool, // No result
  ]),
  // getOraclesError: PropTypes.string,
  onGetOracles: PropTypes.func,
  tabIndex: PropTypes.number,
};

Dashboard.defaultProps = {
  getTopicsSuccess: [],
  onGetTopics: undefined,
  getOraclesSuccess: [],
  // getOraclesError: '',
  onGetOracles: undefined,
  tabIndex: DEFAULT_TAB_INDEX,
};

const mapStateToProps = (state) => ({
  getTopicsSuccess: state.Dashboard.get('success') && state.Dashboard.get('value'),
  getTopicsError: !state.Dashboard.get('success') && state.Dashboard.get('value'),
  tabIndex: state.Dashboard.get('tabIndex'),
  getOraclesSuccess: state.Dashboard.get('allOraclesSuccess') && state.Dashboard.get('allOraclesValue'),
  getOraclesError: !state.Dashboard.get('allOraclesSuccess') && state.Dashboard.get('allOraclesValue'),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetTopics: () => dispatch(dashboardActions.getTopics()),
    onGetOracles: () => dispatch(dashboardActions.getOracles()),
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
