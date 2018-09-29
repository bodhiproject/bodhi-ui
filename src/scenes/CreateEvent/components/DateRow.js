import React from 'react';
import { Grid, Typography, withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';

import { DateTimePickerCombo } from './DateTimePickerCombo';
import styles from './styles';

export const DateRow = withStyles(styles, { withTheme: true })(injectIntl(({ classes, intl, error, blockNum, isOpen, ...props }) => (
  <Grid container direction="row" alignItems="center">
    <Grid item xs={12} sm={6}>
      <DateTimePickerCombo fullWidth error={error} {...props} />
    </Grid>
    <Grid item xs>
      <Typography variant="body2">
        {blockNum ? `~ ${intl.formatMessage({ id: 'str.block', defaultMessage: 'Block' })} ${blockNum}` : ''}
      </Typography>
    </Grid>
  </Grid>
)));
