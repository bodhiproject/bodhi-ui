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
import { listUnspent, getBlockCount, bet, setResult, getBetBalances, getVoteBalances, getTotalBets, getTotalVotes,
  getResult, finished } from '../helpers/blockchain/contract';

const TAB_BETTING = 0;
const TAB_WAITING = 1;
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
      currentTab: TAB_BETTING,
    };
  }

  componentWillMount() {
    this.props.onGetTopics();
    this.props.onGetOracles();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.tabIndex !== nextProps.tabIndex) {
      console.log(`tab index changed from ${this.props.tabIndex} to ${nextProps.tabIndex}`);
      this.setState({
        currentTab: nextProps.tabIndex,
      });
    }
  }

  render() {
    // Calculate grid number for Col attribute
    const colWidth = {};
    Object.keys(COL_PER_ROW).forEach((key) => {
      colWidth[key] = 24 / COL_PER_ROW[key];
    });

    const centralizedOracles = [];
    const decentralizedOracles = [];
    let topicEvents = [];

    if (this.props.getOraclesSuccess && this.props.getOraclesSuccess.length > 0) {
      _.each(this.props.getOraclesSuccess, (entry) => {
        if (entry.token === QTUM) {
          centralizedOracles.push(entry);
        } else if (entry.token === BOT) {
          decentralizedOracles.push(entry);
        }
      });
    }

    if (this.props.getTopicsSuccess && this.props.getTopicsSuccess.length > 0) {
      topicEvents = this.props.getTopicsSuccess;
    }

    let rowItems;
    switch (this.state.currentTab) {
      case TAB_BETTING: {
        rowItems = getCentralizedOracleItems(centralizedOracles, colWidth);
        break;
      }
      case TAB_WAITING: {
        rowItems = getCentralizedOracleItems(centralizedOracles, colWidth);
        break;
      }
      case TAB_VOTING: {
        rowItems = getDecentralizedOracleItems(decentralizedOracles, colWidth);
        break;
      }
      case TAB_COMPLETED: {
        rowItems = getFinishedItems(topicEvents, colWidth);
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
            text: 'Waiting',
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

function getCentralizedOracleItems(centralizedOracles, colWidth) {
  const rowItems = [];
  if (centralizedOracles.length > 0) {
    _.each(centralizedOracles, (entry) => {
      let qtumTotal = 0;
      for (let i = 0; i < entry.amounts.length; i++) {
        qtumTotal += entry.amounts[i];
      }

      const raisedString = `Raised: ${qtumTotal} ${QTUM}`;
      const endBlockString = `Ends: ${entry.endBlock ? entry.endBlock : 45000}`;

      const entryEle = (
        <Col
          xs={colWidth.xs}
          sm={colWidth.sm}
          xl={colWidth.xl}
          key={entry.address}
          style={{ marginBottom: '24px' }}
        >
          <IsoWidgetsWrapper>
            {/* Report Widget */}
            <ReportsWidget
              label={entry.name}
              details={[raisedString, endBlockString]}
            >
              {entry.options.slice(0, NUM_SHOW_IN_OPTIONS).map((result, index) => (
                <SingleProgressWidget
                  key={result}
                  label={result}
                  percent={_.floor((entry.amounts[index] / qtumTotal) * 100)}
                  barHeight={12}
                  status="active"
                  fontColor="#4A4A4A"
                  info
                />
              ))}
            </ReportsWidget>
            <BottomButtonWidget pathname={`/oracle/${entry.address}`} />
          </IsoWidgetsWrapper>
        </Col>
      );

      rowItems.push(entryEle);
    });
  }
  return rowItems;
}

function getDecentralizedOracleItems(decentralizedOracles, colWidth) {
  const rowItems = [];
  if (decentralizedOracles.length > 0) {
    _.each(decentralizedOracles, (entry) => {
      let botTotal = 0;
      for (let i = 0; i < entry.amounts.length; i++) {
        botTotal += entry.amounts[i];
      }

      const raisedString = `Raised: ${botTotal} ${BOT}`;
      const endBlockString = `Ends: ${entry.endBlock ? entry.endBlock : 45000}`;

      const entryEle = (
        <Col xs={colWidth.xs} sm={colWidth.sm} xl={colWidth.xl} key={entry.address} style={{ marginBottom: '24px' }}>
          <IsoWidgetsWrapper>
            {/* Report Widget */}
            <ReportsWidget
              label={entry.name}
              details={[raisedString, endBlockString]}
            >
              {entry.options.slice(0, NUM_SHOW_IN_OPTIONS).map((result, index) => (
                <SingleProgressWidget
                  key={result}
                  label={result}
                  percent={_.floor((entry.amounts[index] / botTotal) * 100)}
                  barHeight={12}
                  status="active"
                  fontColor="#4A4A4A"
                  info
                />
              ))}
            </ReportsWidget>

            <BottomButtonWidget pathname={`/oracle/${entry.address}`} />
          </IsoWidgetsWrapper>
        </Col>
      );

      rowItems.push(entryEle);
    });
  }
  return rowItems;
}

function getFinishedItems(topicEvents, colWidth) {
  const rowItems = [];
  _.each(topicEvents, (entry) => {
    let qtumTotal = 0;
    for (let i = 0; i < entry.qtumAmount.length; i++) {
      qtumTotal += entry.qtumAmount[i];
    }
    let botTotal = 0;
    for (let i = 0; i < entry.botAmount.length; i++) {
      botTotal += entry.botAmount[i];
    }

    const raisedString = `Raised: ${qtumTotal} ${QTUM}, ${botTotal} ${BOT}`;
    const endBlockString = `Ends: ${entry.endBlock ? entry.endBlock : 45000}`;
    const winningResultName = entry.options[entry.resultIdx];

    const entryEle = (
      <Col xs={colWidth.xs} sm={colWidth.sm} xl={colWidth.xl} key={entry.address} style={{ marginBottom: '24px' }}>
        <IsoWidgetsWrapper>
          {/* Report Widget */}
          <ReportsWidget
            label={entry.name}
            details={[raisedString, endBlockString]}
          >
            <SingleProgressWidget
              key={winningResultName}
              label={winningResultName}
              percent={_.floor((entry.botAmount[entry.resultIdx] / botTotal) * 100)}
              barHeight={12}
              status="active"
              fontColor="#4A4A4A"
              info
            />
          </ReportsWidget>

          <BottomButtonWidget pathname={`/topic/${entry.address}`} />
        </IsoWidgetsWrapper>
      </Col>
    );

    rowItems.push(entryEle);
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
