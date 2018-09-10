import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import {
  Modal,
  withStyles,
  Collapse,
} from '@material-ui/core';

import styles from './styles';

@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class SearchModal extends Component {
  render() {
    const { classes, store: { ui: { searchBarMode } } } = this.props;
    console.log(searchBarMode);
    return (
      <div className={classes.resultWrapper}>
        <Modal
          open={searchBarMode}
          hideBackdrop
          className={classes.fullScreenModal}
        >
          <Collapse in={searchBarMode}>
            <div />
          </Collapse>
        </Modal>
      </div>
    );
  }
}
