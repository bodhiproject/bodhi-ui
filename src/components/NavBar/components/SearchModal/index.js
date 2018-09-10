import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import {
  Modal,
  withStyles,
} from '@material-ui/core';

import styles from './styles';

@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class SearchModal extends Component {
  render() {
    const { store: { ui: { searchBarMode } } } = this.props;
    console.log(searchBarMode);
    return (
      <Modal
        open={searchBarMode}
      >
        <div>???</div>
      </Modal>
    );
  }
}
