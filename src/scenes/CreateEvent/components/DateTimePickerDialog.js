import React, { Component, Fragment } from 'react';
import { Dialog, DialogContent } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import { observer, inject } from 'mobx-react';
import BasePicker from 'material-ui-pickers/_shared/BasePicker';
import Calendar from 'material-ui-pickers/DatePicker/Calendar';
import TimePickerView from 'material-ui-pickers/TimePicker/TimePickerView';
import * as pickerViewType from 'material-ui-pickers/constants/date-picker-view';
import moment from 'moment';

@inject('store')
@observer
@injectIntl
export class DateTimePickerDialog extends Component {
  componentDidMount() {
    const { value } = this.props;
    this.setDateTime(moment(value));
  }

  state = {
    pickerView: pickerViewType.DATE,
    dateTime: moment(),
  }

  setPickerView = (pickerView) => {
    this.setState({ pickerView });
  }

  setDateTime = (dateTime) => {
    this.setState({ dateTime });
  }

  handleClose = () => {
    this.props.onChange(this.state.dateTime);
  }

  handleDateChange = (dateTime) => {
    this.setDateTime(dateTime);
    this.setPickerView(pickerViewType.HOUR);
  }

  handleHourChange = (dateTime) => {
    this.setDateTime(dateTime);
    this.setPickerView(pickerViewType.MINUTES);
  }

  handleMinutesChange = (dateTime) => {
    this.setDateTime(dateTime);
    this.handleClose();
  }

  handleSecondsChange = (dateTime) => {
    this.setDateTime(dateTime);
    this.handleClose();
  }

  render() {
    const { dateTime, pickerView } = this.state;
    return (
      <Fragment>
        <Dialog open>
          <DialogContent>
            <BasePicker value={dateTime}>
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
                    { pickerView === pickerViewType.DATE &&
                    <div className="picker">
                      <Calendar
                        date={dateTime}
                        onChange={this.handleDateChange}
                      />
                    </div>
                    }
                    { (pickerView === pickerViewType.HOUR || pickerView === pickerViewType.MINUTES) &&
                    <TimePickerView
                      date={dateTime}
                      ampm={false}
                      onHourChange={this.handleHourChange}
                      type={pickerView}
                      onMinutesChange={this.handleMinutesChange}
                      onSecondsChange={this.handleSecondsChange}
                    />
                    }
                  </div>
                )
              }
            </BasePicker>
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}
