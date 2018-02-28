/* eslint-disable prefer-destructuring */

import React, { Component, PropTypes } from 'react';
import { Row, Col, Select, Button, Menu, Icon, Dropdown } from 'antd';
import _ from 'lodash';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import dashboardActions from '../../redux/dashboard/actions';
import { SortBy } from '../../constants';

const MenuItem = Menu.Item;

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
        <FormattedMessage id={`dashboard.${entry.text}`} />
      </Button>
    ));

    const sortMenu = (
      <Menu onClick={this.onSortOptionSelected}>
        <MenuItem key={SortBy.Ascending}><FormattedMessage id="sort.asc" /></MenuItem>
        <MenuItem key={SortBy.Descending}><FormattedMessage id="sort.desc" /></MenuItem>
      </Menu>
    );

    let sortButtonText;
    let sortButtonIcon;
    if (this.state.sortOption === SortBy.Ascending) {
      sortButtonText = this.props.intl.formatMessage({ id: 'sort.asc' });
      sortButtonIcon = <Icon type="arrow-up" />;
    } else if (this.state.sortOption === SortBy.Descending) {
      sortButtonText = this.props.intl.formatMessage({ id: 'sort.desc' });
      sortButtonIcon = <Icon type="arrow-down" />;
    } else {
      sortButtonText = this.props.intl.formatMessage({ id: 'sort.default' });
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
  // eslint-disable-next-line react/no-typos
  intl: intlShape.isRequired,
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(TabBtnGroup));
