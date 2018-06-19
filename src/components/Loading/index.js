import React from 'react';
import { withStyles } from 'material-ui';
import styles from './styles';


const Loading = ({ classes, text, ...props }) => <Col><div className={classes.loading} {...props} />{text}</Col>;

const Col = withStyles(styles)(({ classes, ...props }) => <div className={classes.col} {...props} />);

export default withStyles(styles, { withTheme: true })(Loading);
