import React from 'react';
import { withStyles } from '@material-ui/core';
import { DateRange, AccessTime } from '@material-ui/icons';
import { DateTimePicker as _DateTimePicker } from '@material-ui/pickers';
import moment from 'moment';
import styles from './styles';

const formatDate = (date) => date.format('MMM D, YYYY H:mm');

const DateTimePicker = ({ classes, dateUnix, onChange }) => (
  <_DateTimePicker
    variant="inline"
    value={moment.unix(dateUnix)}
    onChange={onChange}
    onAccept={onChange}
    disablePast
    ampm={false}
    dateRangeIcon={<DateRange className={classes.tabIcon} />}
    timeIcon={<AccessTime className={classes.tabIcon} />}
    fullWidth
    InputProps={{ classes: {
      root: classes.pickerRoot,
      input: classes.pickerInput,
    } }}
    labelFunc={(date) => formatDate(date)}
  />
);

export default withStyles(styles, { withTheme: true })(DateTimePicker);
