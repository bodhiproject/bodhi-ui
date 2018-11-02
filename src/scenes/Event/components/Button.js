import React from 'react';
import { Button as _Button, withStyles } from '@material-ui/core';
import styles from './styles';

export const Button = withStyles(styles, { withTheme: true })(({ classes, ...props }) => (
  <_Button
    fullWidth
    size='large'
    variant='contained'
    className={classes.oracleButton}
    {...props}
  />
));
