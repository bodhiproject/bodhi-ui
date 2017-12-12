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
import { listUnspent } from '../helpers/blockchain/contract';

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

  render() {
    const tokenQtum = 'QTUM';
    const tokenBot = 'BOT';
    const numShowInOptions = 3;

    // Specify how many col in each row
    const colPerRow = {
      xs: 1,
      sm: 3,
      xl: 4,
    };

    const rowGutter = {
      xs: 0,
      sm: 16, // Set gutter to 16 + 8 * n, with n being a natural number
      md: 24,
      lg: 24,
      xl: 32,
      xxl: 32,
    };

    // Calculate grid number for Col attribute
    const colWidth = {};
    Object.keys(colPerRow).forEach((key) => {
      colWidth[key] = 24 / colPerRow[key];
    });

    listUnspent();

    const centralizedOracles = [];
    const decentralizedOracles = [];
    if (this.props.getOraclesSuccess && this.props.getOraclesSuccess.length > 0) {
      _.each(this.props.getOraclesSuccess, (entry) => {
        if (entry.token === tokenQtum) {
          centralizedOracles.push(entry);
        } else if (entry.token === tokenBot) {
          decentralizedOracles.push(entry);
        }
      });
    }
    const topicEvents = this.props.getTopicsSuccess;

    // const rowItems = getCentralizedOracleItems(centralizedOracles, colWidth, numShowInOptions);
    // const rowItems = getDecentralizedOracleItems(decentralizedOracles, colWidth, numShowInOptions);
    const rowItems = getFinishedItems(topicEvents, colWidth, numShowInOptions);

    console.log(topicEvents);
    return (
      <LayoutContentWrapper className="horizontalWrapper" style={{ minHeight: '100vh', paddingTop: '50px', paddingBottom: '50px' }}>
        <TabBtnGroup
          buttons={[{
            text: 'OnGoing',
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

function getCentralizedOracleItems(centralizedOracles, colWidth, numShowInOptions) {
  const rowItems = [];
  if (centralizedOracles.length > 0) {
    _.each(centralizedOracles, (entry) => {
      let qtumTotal = 0;
      for (let i = 0; i < entry.amounts.length; i++) {
        qtumTotal += entry.amounts[i];
      }

      const raisedString = 'Raised: '.concat(qtumTotal).concat(' QTUM');
      const endBlockString = `Ends: ${entry.endBlock ? entry.endBlock : 45000}`;

      const entryEle = (
        <Col xs={colWidth.xs} sm={colWidth.sm} xl={colWidth.xl} key={entry.address} style={{ marginBottom: '24px' }}>
          <IsoWidgetsWrapper>
            {/* Report Widget */}
            <ReportsWidget
              label={entry.name}
              details={[raisedString, endBlockString]}
            >
              {entry.options.slice(0, numShowInOptions).map((result, index) => (
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

            <BottomButtonWidget pathname={`/topic/${entry.address}`} />
          </IsoWidgetsWrapper>
        </Col>
      );

      rowItems.push(entryEle);
    });
  }
  return rowItems;
}

function getDecentralizedOracleItems(decentralizedOracles, colWidth, numShowInOptions) {
  const rowItems = [];
  if (decentralizedOracles.length > 0) {
    _.each(decentralizedOracles, (entry) => {
      let botTotal = 0;
      for (let i = 0; i < entry.amounts.length; i++) {
        botTotal += entry.amounts[i];
      }

      const raisedString = 'Raised: '.concat(botTotal).concat(' BOT');
      const endBlockString = `Ends: ${entry.endBlock ? entry.endBlock : 45000}`;

      const entryEle = (
        <Col xs={colWidth.xs} sm={colWidth.sm} xl={colWidth.xl} key={entry.address} style={{ marginBottom: '24px' }}>
          <IsoWidgetsWrapper>
            {/* Report Widget */}
            <ReportsWidget
              label={entry.name}
              details={[raisedString, endBlockString]}
            >
              {entry.options.slice(0, numShowInOptions).map((result, index) => (
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

            <BottomButtonWidget pathname={`/topic/${entry.address}`} />
          </IsoWidgetsWrapper>
        </Col>
      );

      rowItems.push(entryEle);
    });
  }
  return rowItems;
}

function getFinishedItems(topicEvents, colWidth, numShowInOptions) {
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

    const raisedString = 'Raised: '.concat(qtumTotal).concat(' QTUM, ').concat(botTotal).concat(' BOT');
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
  onGetOracles: PropTypes.func,
};

Dashboard.defaultProps = {
  getTopicsSuccess: [],
  onGetTopics: undefined,
  getOraclesSuccess: [],
  onGetOracles: undefined,
};

const mapStateToProps = (state) => ({
  getTopicsSuccess: state.Dashboard.get('success') && state.Dashboard.get('value'),
  getTopicsError: !state.Dashboard.get('success') && state.Dashboard.get('value'),
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
