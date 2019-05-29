import React from 'react';
import { Grid, Typography, withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';

import { DateTimePickerCombo } from './DateTimePickerCombo';
import styles from './styles';

export const DateRow = withStyles(styles, { withTheme: true })(injectIntl(({ classes, intl, error, blockNum, isOpen, ...props }) => (
  <Grid container direction="row" alignItems="center">
    <Grid item xs={10} sm={8}>
      <DateTimePickerCombo fullWidth error={error} {...props} />
    </Grid>
  </Grid>
)));
