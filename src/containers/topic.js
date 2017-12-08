import React, { PropTypes } from 'react';
import { Row, Col, Breadcrumb } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import LayoutContentWrapper from '../components/utility/layoutWrapper';
import IsoWidgetsWrapper from './Widgets/widgets-wrapper';
import BottomButtonWidget from './Widgets/bottom-button';
import SingleProgressWidget from './Widgets/progress/progress-single';
import ReportsWidget from './Widgets/report/report-widget';
import TabBtnGroup from '../components/bodhi-dls/tabBtnGroup';
import dashboardActions from '../redux/dashboard/actions';

class TopicPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentWillMount() {
    console.log('componentWillMount');
    // this.props.onGetTopics();
  }

  render() {
    return (
      <LayoutContentWrapper className="horizontalWrapper" style={{ minHeight: '100vh', paddingTop: '50px', paddingBottom: '50px' }}>
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/">Event</Link></Breadcrumb.Item>
          <Breadcrumb.Item>Ongoing</Breadcrumb.Item>
        </Breadcrumb>
      </LayoutContentWrapper>
    );
  }
}

TopicPage.propTypes = {
  // getTopicsSuccess: PropTypes.oneOfType([
  //   PropTypes.array, // Result array
  //   PropTypes.string, // error message
  //   PropTypes.bool, // No result
  // ]),
  // onGetTopics: PropTypes.func,
};

TopicPage.defaultProps = {
  // getTopicsSuccess: [],
  // onGetTopics: undefined,
};

const mapStateToProps = (state) => ({
  // getTopicsSuccess: state.TopicPage.get('success') && state.TopicPage.get('value'),
  // getTopicsError: !state.TopicPage.get('success') && state.TopicPage.get('value'),
});

function mapDispatchToProps(dispatch) {
  return {
    // onGetTopics: () => dispatch(dashboardActions.getTopics()),
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(TopicPage);
