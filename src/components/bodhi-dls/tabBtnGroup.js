import React, { Component, PropTypes } from 'react';
import { Row, Col, Button, Icon } from 'antd';
import _ from 'lodash';
import { connect } from 'react-redux';

import dashboardActions from '../../redux/dashboard/actions';

class TabBtnGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.onTabBtnClicked = this.onTabBtnClicked.bind(this);
    this.onSortBtnClicked = this.onSortBtnClicked.bind(this);
  }

  onTabBtnClicked(event) {
    const { index } = event.target.dataset;

    this.props.tabViewChanged(parseInt(index, 10));
  }

  onSortBtnClicked(event) {

  }

  render() {
    const buttonArray = this.props.buttons.map((entry, index) => (

      <Button
        key={entry.text}
        type={index === _.toNumber(this.props.tabIndex) ? 'primary' : 'default'}
        onClick={this.onTabBtnClicked}
        data-index={index}
      >
        {entry.text}
      </Button>
    ));

    return (
      <div className="tabBtnGroup">
        <Row>
          <Col xs={20}>
            <div className="viewBtnGroup">
              {buttonArray}
            </div>
          </Col>
          <Col xs={4}>
            <div className="controlBtnGroup">
              <Button
                type="default"
                onClick={this.onSortBtnClicked}
              >
              Sort
                <Icon type="down-circle-o" />
              </Button>
            </div>
          </Col>
        </Row>
      </div>);
  }
}

TabBtnGroup.propTypes = {
  buttons: PropTypes.array.isRequired,
  tabViewChanged: PropTypes.func,
  tabIndex: PropTypes.number,
};

TabBtnGroup.defaultProps = {
  tabViewChanged: undefined,
  tabIndex: 0,
};

const mapStateToProps = (state) => ({
  tabIndex: state.Dashboard.get('tabIndex'),
});

function mapDispatchToProps(dispatch) {
  return {
    tabViewChanged: (index) => dispatch(dashboardActions.tabViewChanged(index)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TabBtnGroup);
