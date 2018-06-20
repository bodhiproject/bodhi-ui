/* eslint react/no-array-index-key: 0, no-nested-ternary:0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';

import TopActions from './components/TopActions';
import EventCardsGridContainer from '../../components/EventCardsGridContainer';
import { EventStatus, SortBy, AppLocation } from '../../constants';
import styles from './styles';


@withStyles(styles, { withTheme: true })
@connect((state) => ({
  sortBy: state.Dashboard.get('sortBy'),
}))
@inject('store')
@observer
export default class Dashboard extends Component {
  static propTypes = {
    sortBy: PropTypes.string,
  }

  static defaultProps = {
    sortBy: SortBy.Ascending,
  }

  componentDidMount() {
    this.props.store.ui.location = AppLocation.vote;
  }

  render() {
    const { sortBy } = this.props;

    return (
      <div>
        <TopActions />
        <EventCardsGridContainer
          eventStatusIndex={EventStatus.Vote}
          sortBy={sortBy}
        />
      </div>
    );
  }
}
