import React, { Fragment, Component } from 'react';
import { inject, observer } from 'mobx-react';
import { TextField, FormControl, FormHelperText, InputAdornment, IconButton } from '@material-ui/core';
import { Event as EventIcon } from '@material-ui/icons';
import { injectIntl } from 'react-intl';
import moment from 'moment';

import { DateTimePickerDialog } from './DateTimePickerDialog';

@injectIntl
@inject('store')
@observer
export class DateTimePickerCombo extends Component {
  state = {
    isDatePickerOpen: false,
  }

  onPickerReturn = (dateTime) => {
    this.props.onChange({ target: { value: dateTime.format('YYYY-MM-DDTHH:mm') } });
    this.setState({ isDatePickerOpen: false });
  }

  render() {
    const { value, fullWidth, error, errorMsg, errorText, blockNum, intl, ...props } = this.props;
    const { isDatePickerOpen } = this.state;
    return (
      <Fragment>
        <FormControl fullWidth={fullWidth}>
          <TextField
            fullWidth={fullWidth}
            value={moment.unix(value).format('YYYY-MM-DDTHH:mm')}
            error={Boolean(error)}
            type="datetime-local"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    color="inherit"
                    onClick={() => this.setState({ isDatePickerOpen: true })}
                  >
                    <EventIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            {...props}
          />
          {Boolean(error) && <FormHelperText error>{intl.formatMessage({ id: error })}</FormHelperText>}
        </FormControl>
        {isDatePickerOpen && (
          <DateTimePickerDialog
            value={value}
            onChange={this.onPickerReturn}
          />
        )}
      </Fragment>
    );
  }
}
