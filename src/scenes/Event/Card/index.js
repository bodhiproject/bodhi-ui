import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import styles from './styles';

@withStyles(styles, { withTheme: true })
export default class Card extends Component {
  render() {
    const { children, classes } = this.props;

    return (
      <div className={classes.card}>
        {children}
      </div>
    );
  }
}
