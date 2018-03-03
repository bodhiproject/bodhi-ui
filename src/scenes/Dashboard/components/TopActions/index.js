import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Select, Button, Menu, Icon, Dropdown } from 'antd';
import _ from 'lodash';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import dashboardActions from '../../../../redux/Dashboard/actions';
import { SortBy } from '../../../../constants';

const MenuItem = Menu.Item;

class TopActions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sortOption: undefined,
    };

    this.onSortOptionSelected = this.onSortOptionSelected.bind(this);
  }

  onSortOptionSelected(item) {
    this.setState({
      sortOption: item.key,
    });
    this.props.sortOrderChanged(item.key);
  }

  render() {
    const sortMenu = (
      <Menu onClick={this.onSortOptionSelected}>
        <MenuItem key={SortBy.Ascending}><FormattedMessage id="sort.asc" defaultMessage="Ascending" /></MenuItem>
        <MenuItem key={SortBy.Descending}><FormattedMessage id="sort.desc" defaultMessage="Descending" /></MenuItem>
      </Menu>
    );

    let sortButtonText;
    let sortButtonIcon;
    if (this.state.sortOption === SortBy.Ascending) {
      sortButtonText = <FormattedMessage id="sort.asc" defaultMessage="Ascending" />;
      sortButtonIcon = <Icon type="arrow-up" />;
    } else if (this.state.sortOption === SortBy.Descending) {
      sortButtonText = <FormattedMessage id="sort.desc" defaultMessage="Descending" />;
      sortButtonIcon = <Icon type="arrow-down" />;
    } else {
      sortButtonText = <FormattedMessage id="sort.default" defaultMessage="Sort" />;
      sortButtonIcon = <Icon type="down-circle-o" />;
    }

    return (
      <div className="tabBtnGroup">
        <Row>
          <Col xs={20}>
            <Link to="/create-topic" >
              <Button type="primary" size="large">
                + <FormattedMessage id="dashboard.create" />
              </Button>
            </Link>
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

TopActions.propTypes = {
  sortOrderChanged: PropTypes.func,
};

TopActions.defaultProps = {
  sortOrderChanged: undefined,
};

const mapStateToProps = (state) => ({});

function mapDispatchToProps(dispatch) {
  return {
    sortOrderChanged: (sortBy) => dispatch(dashboardActions.sortOrderChanged(sortBy)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(TopActions));
