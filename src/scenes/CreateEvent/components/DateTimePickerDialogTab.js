import React, { Component } from 'react';
import { Tabs, Tab, withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import { observer, inject } from 'mobx-react';
import * as pickerViewType from 'material-ui-pickers/constants/date-picker-view';

import styles from './styles';

@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export class DateTimePickerDialogTab extends Component {
  pickerViewToIndex = (pickerView) => {
    if (pickerView === pickerViewType.DATE || pickerView === pickerViewType.YEAR) {
      return 'date';
    }
    return 'time';
  }

  indexToPickerView = (index) => index === 'date' ? pickerViewType.DATE : pickerViewType.HOUR;

  momentToDate = (momentDate) => momentDate.format('YYYY/MM/DD');

  momentToTime = (momentTime) => momentTime.format('HH:mm');

  handleChange = (event, value) => this.props.onChange(this.indexToPickerView(value));

  render() {
    const { pickerView, date, classes } = this.props;
    return (
      <Tabs
        indicatorColor="primary"
        fullWidth
        value={this.pickerViewToIndex(pickerView)}
        onChange={this.handleChange}
      >
        <Tab
          value='date'
          label={this.momentToDate(date)}
          className={classes.pickerTab}
        />
        <Tab
          value='time'
          label={this.momentToTime(date)}
          className={classes.pickerTab}
        />
      </Tabs>
    );
  }
}
