import React, { useState } from 'react';
import { DateTimePicker as _DateTimePicker } from '@material-ui/pickers';

function DateTimePicker() {
  const [selectedDate, handleDateChange] = useState(new Date());

  return (
    <div>
      <_DateTimePicker
        variant="inline"
        value={selectedDate}
        onChange={handleDateChange}
      />
    </div>
  );
}

export default DateTimePicker;
