import React from 'react';
import { withStyles } from '@material-ui/core';

import Loading from '../Loading';
import styles from './styles';

export const Row = withStyles(styles)(({ classes, ...props }) => (
  <div className={classes.row} {...props} />
));

export default withStyles(styles)(({ classes }) => <Row><Loading className={classes.loading} text="loading" /></Row>);
