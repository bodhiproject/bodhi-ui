import React from 'react';
import { Grid, TextField, withStyles } from '@material-ui/core';

import { DateTimePickerCombo } from './DateTimePickerCombo';
import styles from './styles';

export const DateRow = withStyles(styles, { withTheme: true })(({ classes, error, blockNum, intl, isOpen, ...props }) => (
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
        InputProps={{ classes: { input: classes.createEventTextField } }}
        placeholder="Block Number"
        value={blockNum ? `Block: ${blockNum}` : ''}
      />
    </Grid>
  </Grid>
));
