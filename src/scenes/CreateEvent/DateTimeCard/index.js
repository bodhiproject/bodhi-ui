import React from 'react';
import {
  FormControl,
  FormHelperText,
  Grid,
  withStyles,
} from '@material-ui/core';
import { injectIntl } from 'react-intl';
import { DateTimePicker } from 'components';
import styles from '../styles';

const DateTimeCard = ({ intl, dateUnix, error, onChange }) => (
  <Grid container direction="row" alignItems="center">
    <Grid item xs={12}>
      <FormControl fullWidth>
        <DateTimePicker dateUnix={dateUnix} onChange={onChange} />
        {error && (
          <FormHelperText error>
            {intl.formatMessage({ id: error })}
          </FormHelperText>
        )}
      </FormControl>
    </Grid>
  </Grid>
);

export default withStyles(styles, { withTheme: true })(injectIntl(DateTimeCard));
