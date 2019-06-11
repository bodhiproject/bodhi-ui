import React from 'react';
import { LinearProgress, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import cx from 'classnames';
import styles from './styles';


const Progress = ({ classes, invalid, className, ...props }) => (
  <LinearProgress
    {...props}
    className={cx(className, classes, {
      [classes.invalid]: invalid,
      [classes.root]: true,
    })}
    classes={{ dashedColorSecondary: classes.dashedColorSecondary, dashed: classes.dashed }}
  />
);

Progress.propTypes = {
  classes: PropTypes.object.isRequired,
  invalid: PropTypes.bool.isRequired,
  className: PropTypes.string, // eslint-disable-line
};

export default withStyles(styles)(Progress);
