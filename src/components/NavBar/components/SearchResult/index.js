import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withStyles, Grid } from '@material-ui/core';

import styles from './styles';
import Search from '../../../../scenes/Search';

@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class SearchResult extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.resultWrapper}>
        <Grid container className={classes.result} justify="center">
          <Search />
        </Grid>
      </div>
    );
  }
}
