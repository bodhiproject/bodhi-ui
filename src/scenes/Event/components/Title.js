import React from 'react';
import { Typography, withStyles } from '@material-ui/core';

import styles from './styles';

export const Title = withStyles(styles)(({ classes, text }) => (
  <Typography variant="display1" className={classes.title}>
    {text}
  </Typography>
));
