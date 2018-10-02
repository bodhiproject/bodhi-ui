import React from 'react';
import { injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core';
import styles from './styles';

export const Loading = withStyles(styles)(injectIntl(({ classes, text, intl, ...props }) => (
  <div className={classes.col} {...props} >
    <div className={classes.loading} {...props} />
    {text && intl.formatMessage({ id: text.id, defaultMessage: text.defaultMessage })}
  </div>
)));
