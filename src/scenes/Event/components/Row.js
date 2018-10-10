import React from 'react';
import { Grid, Paper, withStyles } from '@material-ui/core';

import styles from './styles';

export const Row = withStyles(styles)(({ children }) => (
  <Paper elevation={0}>
    <Grid container spacing={0}>{children}</Grid>
  </Paper>
));
