import React, { Component, Fragment } from 'react';
import { Dialog, DialogActions, Button, withStyles } from '@material-ui/core';
import { KeyboardArrowRight as KeyboardArrowRightIcon, KeyboardArrowLeft as KeyboardArrowLeftIcon } from '@material-ui/icons';
import { injectIntl, FormattedMessage } from 'react-intl';
import { observer, inject } from 'mobx-react';
import BasePicker from 'material-ui-pickers/_shared/BasePicker';
import Calendar from 'material-ui-pickers/DatePicker/Calendar';
import TimePickerView from 'material-ui-pickers/TimePicker/TimePickerView';
import * as pickerViewType from 'material-ui-pickers/constants/date-picker-view';
import moment from 'moment';

import { DateTimePickerDialogTab } from './DateTimePickerDialogTab';
import styles from './styles';

@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export class DateTimePickerDialog extends Component {
  componentDidMount() {
    const { value } = this.props;
    this.setDateTime(moment.unix(value));
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
  }

  handleSecondsChange = (dateTime) => {
    this.setDateTime(dateTime);
  }

  handleTabChange = (pickerView) => this.setPickerView(pickerView);

  render() {
    const { dateTime, pickerView } = this.state;
    const { classes } = this.props;
    return (
      <Fragment>
        <Dialog open>
          <DateTimePickerDialogTab
            className={classes.pickerTab}
            onChange={this.handleTabChange}
            pickerView={pickerView}
            date={dateTime}
          />
          <div className={classes.pickerPaper}>
            <BasePicker value={dateTime}>{
              () => (
                <div>
                  {pickerView === pickerViewType.DATE && (
                    <div className={classes.pickerCalendar}>
                      <Calendar
                        classes={{ transitionContainer: classes.pickersCalendarHeader }}
                        date={dateTime}
                        onChange={this.handleDateChange}
                        leftArrowIcon={<KeyboardArrowLeftIcon />}
                        rightArrowIcon={<KeyboardArrowRightIcon />}
                      />
                    </div>
                  )
                  }
                  {(pickerView === pickerViewType.HOUR || pickerView === pickerViewType.MINUTES) && (
                    <div>
                      <TimePickerView
                        date={dateTime}
                        ampm={false}
                        onHourChange={this.handleHourChange}
                        type={pickerView}
                        onMinutesChange={this.handleMinutesChange}
                        onSecondsChange={this.handleSecondsChange}
                      />
                    </div>
                  )}
                </div>
              )
            }
            </BasePicker>
          </div>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              <FormattedMessage id="str.ok" defaultMessage="OK" />
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}
