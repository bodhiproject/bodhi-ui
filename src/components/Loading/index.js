import React from 'react';
import { injectIntl } from 'react-intl';
import { CircularProgress, withStyles } from '@material-ui/core';
import styles from './styles';

export default withStyles(styles)(injectIntl(({ classes, text, intl, ...props }) => (
  <div className={classes.col} {...props} >
    <CircularProgress color="primary" />
    {text && intl.formatMessage({ id: text.id, defaultMessage: text.defaultMessage })}
  </div>
)));
