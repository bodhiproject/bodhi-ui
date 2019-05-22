import React from 'react';
import { Grid, Paper } from '@material-ui/core';

export default ({ children }) => (
  <Paper elevation={0}>
    <Grid container spacing={0}>{children}</Grid>
  </Paper>
);
