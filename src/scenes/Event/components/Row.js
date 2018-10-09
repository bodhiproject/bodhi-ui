import React from 'react';
import { Grid, Paper, withStyles } from '@material-ui/core';

import styles from './styles';

export const Row = withStyles(styles)(({ children, ...props }) => (
  <Paper elevation={0} {...props}>
    <Grid container spacing={0}>{children}</Grid>
  </Paper>
));
