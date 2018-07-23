import React, { Fragment } from 'react';
import { Grid, FormControl, FormHelperText, TextField } from '@material-ui/core';


export const DateRow = ({ error, blockNum, ...props }) => (
  <Fragment>
    <Grid item xs={6}>
      <FormControl fullWidth>
        <TextField
          fullWidth
          error={Boolean(error)}
          type="datetime-local"
          {...props}
        />
        {Boolean(error) && <FormHelperText error>{error}</FormHelperText>}
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
);
