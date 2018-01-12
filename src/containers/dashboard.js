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
import appActions from '../redux/app/actions';
import { Token, OracleStatus } from '../constants';

const TAB_BETTING = 0;
const TAB_SETTING = 1;
const TAB_VOTING = 2;
const TAB_COMPLETED = 3;
const DEFAULT_TAB_INDEX = TAB_BETTING;
const NUM_SHOW_IN_OPTIONS = 3;
const COL_PER_ROW = { // Specify how many col in each row
  xs: 1,
  sm: 3,
  md: 3,
  lg: 4,
  xl: 4,
  xxl: 4,
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
    const {
      onGetTopics,
      onGetOracles,
      syncProgress,
      isSyncing,
    } = nextProps;

    if (nextProps.tabIndex !== this.props.tabIndex) {
      onGetOracles();
      onGetTopics();
    }

    // Refresh page if sync is complete
    if (isSyncing && syncProgress === 100) {
      onGetOracles();
      onGetTopics();

      this.props.toggleSyncing(false);
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
        rowItems = buildOracleColElement(_.filter(allOracles, { token: Token.Qtum, status: OracleStatus.Voting }));
        break;
      }
      case TAB_SETTING: {
        rowItems = buildOracleColElement(_.filter(allOracles, (oracle) => oracle.token === Token.Qtum && (oracle.status === OracleStatus.WaitResult || oracle.status === OracleStatus.OpenResultSet)));
        break;
      }
      case TAB_VOTING: {
        rowItems = buildOracleColElement(_.filter(allOracles, (oracle) => oracle.token === Token.Bot && oracle.status !== OracleStatus.Withdraw));
        break;
      }
      case TAB_COMPLETED: {
        rowItems = getFinishedItems(_.filter(topicEvents, { status: OracleStatus.Withdraw }));
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

    const raisedString = `Raised: ${totalBalance.toFixed(2)} ${oracle.token}`;
    const endBlockString = `Ends: ${oracle.endBlock ? oracle.endBlock : '45000'}`;

    let displayOptions = [];

    // Determine what options showing in progress bars
    if (oracle.token === Token.Bot) {
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

    const threshold = oracle.consensusThreshold;

    // Constructing opitons elements
    let optionsEle = null;

    if (!_.isEmpty(displayOptions)) {
      if (oracle.token === Token.Bot) {
        optionsEle = displayOptions.map((result, index) => (
          <SingleProgressWidget
            key={`option${index}`}
            label={result}
            percent={threshold === 0 ? threshold : _.round((oracle.amounts[oracle.optionIdxs[index]] / threshold) * 100)}
            barHeight={12}
            fontColor="#4A4A4A"
          />
        ));
      } else {
        optionsEle = displayOptions.map((result, index) => (
          <SingleProgressWidget
            key={`option${index}`}
            label={result}
            percent={totalBalance === 0 ? totalBalance : _.round((oracle.amounts[index] / totalBalance) * 100)}
            barHeight={12}
            fontColor="#4A4A4A"
          />
        ));
      }
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
            text={oracle.token === Token.Qtum ? (oracle.status === OracleStatus.WaitResult ? 'Set Result' : 'Participate') : 'Vote'}
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

    const raisedString = `Raised: ${qtumTotal.toFixed(2)} ${Token.Qtum}, ${botTotal.toFixed(2)} ${Token.Bot}`;
    const endBlockString = `Ends: ${topic.endBlock ? topic.endBlock : ''}`;

    let optionBalances = _.map(topic.options, (opt, idx) => {
      const qtumAmount = topic.qtumAmount[idx];
      const botAmount = topic.botAmount[idx];

      return {
        name: opt,
        value: `${qtumAmount} ${Token.Qtum}, ${botAmount} ${Token.Bot}`,
        percent: qtumTotal === 0 ? qtumTotal : _.round((qtumAmount / qtumTotal) * 100),
        secondaryPercent: botTotal === 0 ? botTotal : _.round((botAmount / botTotal) * 100),
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
  toggleSyncing: PropTypes.func,
  syncProgress: PropTypes.number,
  isSyncing: PropTypes.bool,
};

Dashboard.defaultProps = {
  getTopicsSuccess: [],
  onGetTopics: undefined,
  getOraclesSuccess: [],
  // getOraclesError: '',
  onGetOracles: undefined,
  tabIndex: DEFAULT_TAB_INDEX,
  toggleSyncing: undefined,
  syncProgress: undefined,
  isSyncing: false,
};

const mapStateToProps = (state) => ({
  getTopicsSuccess: state.Dashboard.get('success') && state.Dashboard.get('value'),
  getTopicsError: !state.Dashboard.get('success') && state.Dashboard.get('value'),
  tabIndex: state.Dashboard.get('tabIndex'),
  getOraclesSuccess: state.Dashboard.get('allOraclesSuccess') && state.Dashboard.get('allOraclesValue'),
  getOraclesError: !state.Dashboard.get('allOraclesSuccess') && state.Dashboard.get('allOraclesValue'),
  syncProgress: state.App.get('syncProgress'),
  isSyncing: state.App.get('isSyncing'),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetTopics: () => dispatch(dashboardActions.getTopics()),
    onGetOracles: () => dispatch(dashboardActions.getOracles()),
    toggleSyncing: (isSyncing) => dispatch(appActions.toggleSyncing(isSyncing)),
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
