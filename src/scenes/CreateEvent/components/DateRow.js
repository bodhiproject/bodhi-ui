import React, { Fragment } from 'react';
import { Grid, FormControl, FormHelperText, TextField } from '@material-ui/core';
import { injectIntl } from 'react-intl';


export const DateRow = injectIntl(({ error, blockNum, intl, ...props }) => (
  <Fragment>
    <Grid item xs={6}>
      <FormControl fullWidth>
        <TextField
          fullWidth
          error={Boolean(error)}
          type="datetime-local"
          {...props}
        />
        {Boolean(error) && <FormHelperText error>{intl.formatMessage({ id: error })}</FormHelperText>}
      </FormControl>
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
