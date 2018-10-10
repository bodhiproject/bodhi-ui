import React from 'react';
import { Typography, withStyles } from '@material-ui/core';

import styles from './styles';

export const Title = withStyles(styles)(({ children, classes }) => (
  <Typography variant="display1" className={classes.title}>
    {children}
  </Typography>
));
