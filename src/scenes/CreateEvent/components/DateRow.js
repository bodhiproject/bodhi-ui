import React from 'react';
import { Grid, TextField } from '@material-ui/core';

import { DateTimePickerCombo } from './DateTimePickerCombo';


export const DateRow = ({ error, blockNum, intl, isOpen, ...props }) => (
  <Grid container>
    <Grid item xs={12} sm={6}>
      <DateTimePickerCombo
        fullWidth
        error={error}
        {...props}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        disabled
        placeholder="Block Number"
        value={blockNum ? `Block: ${blockNum}` : ''}
      />
    </Grid>
  </Grid>
);
