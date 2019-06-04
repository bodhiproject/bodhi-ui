import React from 'react';
import { DateTimePicker as _DateTimePicker } from '@material-ui/pickers';
import moment from 'moment';

const DateTimePicker = ({ dateUnix, onChange }) => (
  <div>
    <_DateTimePicker
      variant="inline"
      value={moment.unix(dateUnix)}
      onChange={onChange}
      onAccept={onChange}
      disablePast
    />
  </div>
);

export default DateTimePicker;
