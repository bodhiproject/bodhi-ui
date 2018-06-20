import React from 'react';
import PropTypes from 'prop-types';
import { Link as _Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core';

import styles from './styles';


export const Link = withStyles(styles)(({ active = false, classes, className, children, dispatch, ...props }) => (
  <_Link {...props} className={`${className} ${classes.navBarLink}`}>
    {children}
    {active && <img src="/images/nav-arrow.png" className={classes.navArrow} alt="cool" />}
  </_Link>
));

Link.propTypes = {
  active: PropTypes.bool,
  classes: PropTypes.func,
  className: PropTypes.object,
  children: PropTypes.node.isRequired,
};

Link.defaultProps = {
  active: false,
  classes: undefined,
  className: undefined,
};
