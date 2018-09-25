import React from 'react';
import { withStyles, Typography } from '@material-ui/core';
import cx from 'classnames';

import styles from './styles';

export const ImportantNote = withStyles(styles)(({ classes, heading, message, ...props }) => !!(heading && message) && (
  <div {...props}>
    <div className={classes.iconHeadingContainer}>
      <i className={cx('icon iconfont icon-ic_info', classes.icon)} />
      <Typography className={classes.heading}>{heading}</Typography>
    </div>
    <Typography className={classes.message}>{message}</Typography>
  </div>
));
