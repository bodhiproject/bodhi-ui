/* eslint react/no-array-index-key: 0, no-nested-ternary:0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';

import TopActions from './components/TopActions/index';
import EventCardsGridContainer from '../../components/EventCardsGridContainer/index';
import { EventStatus, SortBy } from '../../constants';
import styles from './styles';


@withStyles(styles, { withTheme: true })
@connect((state) => ({
  sortBy: state.Dashboard.get('sortBy'),
}))
export default class Dashboard extends React.Component {
  static propTypes = {
    sortBy: PropTypes.string,
  }

  static defaultProps = {
    sortBy: SortBy.Ascending,
  }

  render() {
    const { sortBy } = this.props;

    return (
      <div>
        <TopActions />
        <EventCardsGridContainer
          eventStatusIndex={EventStatus.Bet}
          sortBy={sortBy}
        />
      </div>
    );
  }
}
