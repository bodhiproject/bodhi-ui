import React from 'react';
import { Grid, withStyles } from '@material-ui/core';
import styles from './styles';

export default withStyles(styles)(({ classes, noSideBar, ...props }) => (
  <Grid item xs={12} md={(noSideBar && 12) || 8} className={classes.grid} {...props} />
));
