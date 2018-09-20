import React from 'react';
import { Grid, withStyles } from '@material-ui/core';
import styles from './styles';

export const Content = withStyles(styles)(({ classes, ...props }) => (
  <Grid item xs={12} md={8} className={classes.oracleContent} {...props} />
));
