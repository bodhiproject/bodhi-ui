import React, { Fragment } from 'react';
import { TextField, FormControl, FormHelperText } from '@material-ui/core';
import { injectIntl } from 'react-intl';

export const DateTimePickerCombo = injectIntl(({ fullWidth, error, errorMsg, errorText, blockNum, intl, ...props }) => (
  <Fragment>
    <FormControl fullWidth={fullWidth}>
      <TextField
        fullWidth={fullWidth}
        error={Boolean(error)}
        type="datetime-local"
        {...props}
      />
      {Boolean(error) && <FormHelperText error>{intl.formatMessage({ id: error })}</FormHelperText>}
    </FormControl>
  </Fragment>
));
