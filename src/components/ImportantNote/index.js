import React from 'react';
import { withStyles, IconButton, Tooltip, Typography } from '@material-ui/core';
import cx from 'classnames';

import styles from './styles';

const ImportantNote = ({ classes, heading, message, ...props }) => (
  heading && message && (
    <div {...props}>
      <div className={classes.iconHeadingContainer}>
        <Tooltip title={<span>{message}</span>}>
          <IconButton className={classes.iconButton} disableRipple>
            <i className={cx('icon iconfont icon-ic_info', classes.icon)} />
          </IconButton>
        </Tooltip>
        <Typography className={classes.heading}>{heading}</Typography>
      </div>
    </div>
  )
);

export default withStyles(styles)((ImportantNote));
