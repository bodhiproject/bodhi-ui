import React from 'react';
import { DateTimePicker as _DateTimePicker } from '@material-ui/pickers';

const DateTimePicker = ({ date, onChange }) => (
  <div>
    <_DateTimePicker
      variant="inline"
      value={date}
      onChange={onChange}
    />
  </div>
);

export default DateTimePicker;
