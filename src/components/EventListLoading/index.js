import React from 'react';
import { withStyles } from '@material-ui/core';
import { defineMessages } from 'react-intl';

import Loading from '../Loading';
import styles from './styles';

const messages = defineMessages({
  loadEventListMsg: {
    id: 'load.eventList',
    defaultMessage: 'loading',
  },
});

export const Row = withStyles(styles)(({ classes, ...props }) => (
  <div className={classes.row} {...props} />
));

export default withStyles(styles)(({ classes }) => <Row><Loading className={classes.loading} text={messages.loadEventListMsg} /></Row>);
