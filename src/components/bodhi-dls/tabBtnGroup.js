/* eslint-disable prefer-destructuring */

import React, { Component, PropTypes } from 'react';
import { Row, Col, Select, Button, Menu, Icon, Dropdown } from 'antd';
import _ from 'lodash';
import { connect } from 'react-redux';

import dashboardActions from '../../redux/dashboard/actions';

const MenuItem = Menu.Item;

const SORT_ASC = 'ASC';
const SORT_DESC = 'DESC';

class TabBtnGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sortOption: undefined,
    };

    this.onTabBtnClicked = this.onTabBtnClicked.bind(this);
    this.onSortOptionSelected = this.onSortOptionSelected.bind(this);
  }

  onTabBtnClicked(event) {
    const { index } = event.target.dataset;

    this.props.tabViewChanged(parseInt(index, 10));
  }

  onSortOptionSelected(item) {
    this.setState({
      sortOption: item.key,
    });
    this.props.sortOrderChanged(item.key);
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

    const sortMenu = (
      <Menu onClick={this.onSortOptionSelected}>
        <MenuItem key={SORT_ASC}>Ascending</MenuItem>
        <MenuItem key={SORT_DESC}>Descending</MenuItem>
      </Menu>
    );

    let sortButtonText;
    let sortButtonIcon;
    if (this.state.sortOption === SORT_ASC) {
      sortButtonText = 'Ascending';
      sortButtonIcon = <Icon type="arrow-up" />;
    } else if (this.state.sortOption === SORT_DESC) {
      sortButtonText = 'Descending';
      sortButtonIcon = <Icon type="arrow-down" />;
    } else {
      sortButtonText = 'Sort';
      sortButtonIcon = <Icon type="down-circle-o" />;
    }

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
              <Dropdown overlay={sortMenu}>
                <Button size="large" style={{ width: 144 }}>
                  {sortButtonText} {sortButtonIcon}
                </Button>
              </Dropdown>
            </div>
          </Col>
        </Row>
      </div>);
  }
}

TabBtnGroup.propTypes = {
  buttons: PropTypes.array.isRequired,
  tabIndex: PropTypes.number,
  tabViewChanged: PropTypes.func,
  sortOrderChanged: PropTypes.func,
};

TabBtnGroup.defaultProps = {
  tabIndex: 0,
  tabViewChanged: undefined,
  sortOrderChanged: undefined,
};

const mapStateToProps = (state) => ({
  tabIndex: state.Dashboard.get('tabIndex'),
});

function mapDispatchToProps(dispatch) {
  return {
    tabViewChanged: (index) => dispatch(dashboardActions.tabViewChanged(index)),
    sortOrderChanged: (sortBy) => dispatch(dashboardActions.sortOrderChanged(sortBy)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TabBtnGroup);
