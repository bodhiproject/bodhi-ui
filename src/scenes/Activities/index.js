import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Tabs, { Tab } from 'material-ui/Tabs';
import { withStyles } from 'material-ui/styles';

import EventCardsGridContainer from '../../components/EventCardsGridContainer/index';
import { EventStatus } from '../../constants';
import styles from './styles';

class Activities extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabIdx: 0,
    };

    this.handleTabChange = this.handleTabChange.bind(this);
  }

  render() {
    const { classes } = this.props;
    const { tabIdx } = this.state;

    return (
      <div>
        <Tabs indicatorColor="primary" value={tabIdx} onChange={this.handleTabChange} className={classes.activitiesTabWrapper}>
          <Tab label="Result Setting" />
          <Tab label="Finalize" />
          <Tab label="Withdraw" />
          <Tab label="Activities History" />
        </Tabs>
        <div className={classes.activitiesTabContainer}>
          {tabIdx === 0 && <EventCardsGridContainer eventStatusIndex={EventStatus.Set} />}
          {tabIdx === 1 && <EventCardsGridContainer eventStatusIndex={EventStatus.Finalize} />}
          {tabIdx === 2 && <EventCardsGridContainer eventStatusIndex={EventStatus.Withdraw} />}
          {tabIdx === 3 && <div>Activities history</div>}
        </div>
      </div>
    );
  }

  handleTabChange(event, value) {
    this.setState({ tabIdx: value });
  }
}

Activities.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Activities);
