import React from 'react';
import { Grid, Paper } from '@material-ui/core';

export default ({ children, classes }) => (
  <Paper elevation={0} classes={classes}>
    <Grid container spacing={0}>{children}</Grid>
  </Paper>
);
