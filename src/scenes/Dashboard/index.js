/* eslint react/no-array-index-key: 0, no-nested-ternary:0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';

import TopActions from './components/TopActions/index';
import EventCardsGridContainer from '../../components/EventCardsGridContainer/index';
import styles from './styles';

class Dashboard extends React.Component {
  render() {
    const {
      sortBy,
      tabIndex,
    } = this.props;

    return (
      <div>
        <TopActions />
        <EventCardsGridContainer
          eventStatusIndex={tabIndex}
          sortBy={sortBy}
        />
      </div>
    );
  }
}

Dashboard.propTypes = {
  tabIndex: PropTypes.number,
  sortBy: PropTypes.string,
};

Dashboard.defaultProps = {
  tabIndex: 0,
  sortBy: undefined,
};

const mapStateToProps = (state) => ({
  tabIndex: state.Dashboard.get('tabIndex'),
  sortBy: state.Dashboard.get('sortBy'),
});

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(Dashboard));
