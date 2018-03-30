import React from 'react';
import PropTypes from 'prop-types';
import { Link as _Link } from 'react-router-dom';
import classNames from 'classnames';
import { withStyles } from 'material-ui';
import styles from './styles';


export const Link = withStyles(styles)(({ active = false, classes, className, ...props }) => (
  <_Link
    {...props}
    className={classNames(className, classes.navBarLink, {
      [classes.navArrow]: active,
    })}
  />
));

Link.propTypes = {
  active: PropTypes.bool.isRequired,
  classes: PropTypes.func,
  className: PropTypes.object,
};
