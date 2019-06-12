import React from 'react';
import { withStyles } from '@material-ui/core';
import { DateRange, AccessTime } from '@material-ui/icons';
import { DateTimePicker as _DateTimePicker } from '@material-ui/pickers';
import moment from 'moment';
import styles from './styles';

const DateTimePicker = ({ classes, dateUnix, onChange }) => (
  <div>
    <_DateTimePicker
      variant="inline"
      value={moment.unix(dateUnix)}
      onChange={onChange}
      onAccept={onChange}
      disablePast
      dateRangeIcon={<DateRange className={classes.tabIcon} />}
      timeIcon={<AccessTime className={classes.tabIcon} />}
    />
  </div>
);

export default withStyles(styles, { withTheme: true })(DateTimePicker);
