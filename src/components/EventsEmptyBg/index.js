import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import EventIcon from 'material-ui-icons/Event';
import { withStyles } from 'material-ui/styles';

import styles from './styles';

class EventsEmptyBg extends React.PureComponent {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.eventsEmptyWrapper}>
        <EventIcon className={classes.eventsEmptyIcon} fontSize />
        <Typography variant="body1">No Event at Current Status</Typography>
      </div>
    );
  }
}

EventsEmptyBg.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(EventsEmptyBg);
