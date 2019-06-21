import React from 'react';
import { withStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Routes } from 'constants';

import styles from './styles';
import ImageLocaleWrapper from './components/ImageLocaleWrapper';

const BodhiLogo = ({ classes, onClick }) => (
  <Link to={Routes.PREDICTION}>
    <ImageLocaleWrapper
      appliedLanguages={['zh-Hans-CN']}
      src="/images/bodhi-logo.svg"
      alt="bodhi-logo"
      className={classes.navBarLogo}
      onClick={onClick}
    />
  </Link>
);

export default withStyles(styles, { withTheme: true })(BodhiLogo);
