import React, { PropTypes } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';

import LayoutContentWrapper from '../components/utility/layoutWrapper';
import IsoWidgetsWrapper from './Widgets/widgets-wrapper';
import BottomButtonWidget from './Widgets/bottom-button';
import SingleProgressWidget from './Widgets/progress/progress-single';
import ReportsWidget from './Widgets/report/report-widget';
import basicStyle from '../config/basicStyle';

import dashboardActions from '../redux/dashboard/actions';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentWillMount() {
    this.props.onGetTopics();
  }

  render() {
    const { rowStyle, colStyle } = basicStyle;

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
      xl: 32,
    };

    // Calculate grid number for Col attribute
    const colWidth = {};
    Object.keys(colPerRow).forEach((key) => {
      colWidth[key] = 24 / colPerRow[key];
    });

    const topicArray = [];
    if (this.props.getTopicsSuccess && this.props.getTopicsSuccess.length > 0) {
      this.props.getTopicsSuccess.forEach((entry) => {
        const entryEle =
          (<Col xs={colWidth.xs} sm={colWidth.sm} xl={colWidth.xl} key={entry.name} style={colStyle}>
            <IsoWidgetsWrapper>
              {/* Report Widget */}
              <ReportsWidget
                label={entry.name}
                details={['Raised: 398,841,00 QTUM', 'Ends: 12/21/2017']}
              >
                {entry.resultNames.map((result) =>
                  (<SingleProgressWidget
                    key={result}
                    label={result}
                    percent={_.random(100)}
                    barHeight={12}
                    status="active"
                    fontColor="#4A4A4A"
                    info
                  />))}
              </ReportsWidget>

              <BottomButtonWidget />
            </IsoWidgetsWrapper>
          </Col>);
        topicArray.push(entryEle);
      });
    }

    return (
      <LayoutContentWrapper className="horizontalWrapper" style={{ minHeight: '100vh', paddingTop: '50px', paddingBottom: '50px' }}>
        <Row style={rowStyle} gutter={24} justify="start">
          {topicArray}
        </Row>
      </LayoutContentWrapper>
    );
  }
}

Dashboard.propTypes = {
  getTopicsSuccess: PropTypes.array,
  onGetTopics: PropTypes.func,
};

Dashboard.defaultProps = {
  getTopicsSuccess: [],
  onGetTopics: undefined,
};

const mapStateToProps = (state) => ({
  getTopicsSuccess: state.Dashboard.get('success') && state.Dashboard.get('value'),
  getTopicsError: !state.Dashboard.get('success') && state.Dashboard.get('value'),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetTopics: () => dispatch(dashboardActions.getTopics()),
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
