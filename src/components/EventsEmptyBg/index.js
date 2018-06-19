import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { withStyles, Typography } from '@material-ui/core';
import { Event as EventIcon } from '@material-ui/icons';

import styles from './styles';


const EventsEmptyBg = ({ classes }) => (
  <div className={classes.eventsEmptyWrapper}>
    <EventIcon className={classes.eventsEmptyIcon} />
    <Typography variant="body1"><FormattedMessage id="dashboard.empty" defaultMessage="No Event at Current Status" /> </Typography>
  </div>
);

EventsEmptyBg.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(EventsEmptyBg);
