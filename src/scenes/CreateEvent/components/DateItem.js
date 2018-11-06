import React from 'react';
import { Grid, Typography, withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';

import { DateTimePickerCombo } from './DateTimePickerCombo';
import styles from './styles';

export const DateItem = withStyles(styles, { withTheme: true })(injectIntl(({ classes, intl, error, blockNum, isOpen, ...props }) => (
  <Grid item xs={12} sm={6} className={classes.dateItem}>
    <DateTimePickerCombo fullWidth error={error} {...props} estblockNum={blockNum ? `~ ${intl.formatMessage({ id: 'str.block', defaultMessage: 'Block' })} ${blockNum}` : ''} />
  </Grid>
)));
