import React, { Fragment } from 'react';
import { Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import BasePicker from 'material-ui-pickers/_shared/BasePicker';
import Calendar from 'material-ui-pickers/DatePicker/Calendar';
import TimePickerView from 'material-ui-pickers/TimePicker/TimePickerView';

export const DateTimePickerDialog = injectIntl(({ date, ...props }) => (
  <Fragment>
    <Dialog aria-labelledby="simple-dialog-title">
      <DialogTitle id="simple-dialog-title">Date Select</DialogTitle>
      <DialogContent>
        <BasePicker value={date}>
          {
            ({
              handleAccept,
              handleChange,
              handleClear,
              handleDismiss,
              handleSetTodayDate,
              handleTextFieldChange,
              pick12hOr24hFormat,
            }) => (
              <div>
                <div className="picker">
                  <Calendar date={date} onChange={handleChange} />
                </div>
                <TimePickerView
                  date={date}
                  ampm={false}
                  onHourChange={handleChange}
                  type="hours"
                />
              </div>
            )
          }
        </BasePicker>
      </DialogContent>
    </Dialog>
  </Fragment>
));
