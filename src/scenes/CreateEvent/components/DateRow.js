import React, { Fragment } from 'react';
import { Grid, TextField } from '@material-ui/core';
import { injectIntl } from 'react-intl';

import { DateTimePickerCombo } from './DateTimePickerCombo';


export const DateRow = injectIntl(({ error, blockNum, intl, ...props }) => (
  <Fragment>
    <Grid item xs={6}>
      <DateTimePickerCombo
        fullWidth
        error={error}
        {...props}
      />
    </Grid>
    <Grid item xs={6}>
      <TextField
        fullWidth
        disabled
        placeholder="Block Number"
        value={blockNum ? `Block: ${blockNum}` : ''}
      />
    </Grid>
  </Fragment>
));
