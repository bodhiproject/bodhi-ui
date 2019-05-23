import React from 'react';
import { Grid, withStyles } from '@material-ui/core';
import styles from './styles';

export default withStyles(styles)(({ classes, ...props }) => (
  <Grid item xs={12} md={8} className={classes.grid} {...props} />
));
