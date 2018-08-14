import React, { Component } from 'react';
import { Tabs, Tab } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import { observer, inject } from 'mobx-react';
import * as pickerViewType from 'material-ui-pickers/constants/date-picker-view';


@inject('store')
@observer
@injectIntl
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
    const { pickerView, date } = this.props;
    return (
      <Tabs
        color="primary"
        fullWidth
        value={this.pickerViewToIndex(pickerView)}
        onChange={this.handleChange}
      >
        <Tab value='date' label={this.momentToDate(date)} />
        <Tab value='time' label={this.momentToTime(date)} />
      </Tabs>
    );
  }
}
