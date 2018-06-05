import React from 'react';
import { withStyles } from 'material-ui';
import styles from './styles';


const Loading = ({ classes, ...props }) => <div className={classes.loading} />; // eslint-disable-line

export default withStyles(styles, { withTheme: true })(Loading);
