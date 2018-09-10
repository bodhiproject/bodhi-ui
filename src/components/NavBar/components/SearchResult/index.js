import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import {
  Modal,
  withStyles,
  Collapse,
} from '@material-ui/core';

import styles from './styles';
import Search from '../../../../scenes/Search';

@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class SearchResult extends Component {
  render() {
    const { classes, store: { ui: { searchBarMode } } } = this.props;
    console.log(searchBarMode);
    return (
      <div className={classes.resultWrapper}>
        <div className={classes.result}>
          <Search />
        </div>
        <Modal
          open={searchBarMode}
          hideBackdrop
        >
          <Collapse in={searchBarMode}>
            <div className={classes.testFullScreen} />
          </Collapse>
        </Modal>
      </div>
    );
  }
}
