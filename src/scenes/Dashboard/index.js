/* eslint react/no-array-index-key: 0, no-nested-ternary:0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';

import TopActions from './components/TopActions/index';
import EventCardsGridContainer from '../../components/EventCardsGridContainer/index';
import { EventStatus, SortBy } from '../../constants';
import styles from './styles';

class Dashboard extends React.Component {
  render() {
    const {
      sortBy,
    } = this.props;

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

Dashboard.propTypes = {
  sortBy: PropTypes.string,
};

Dashboard.defaultProps = {
  sortBy: SortBy.Ascending,
};

const mapStateToProps = (state) => ({
  sortBy: state.Dashboard.get('sortBy'),
});

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(Dashboard));
