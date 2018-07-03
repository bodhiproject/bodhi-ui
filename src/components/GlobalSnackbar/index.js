import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Snackbar, IconButton } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

import Config from '../../config/app';


@inject('store')
@observer
export default class GlobalSnackbar extends Component {
  render() {
    const { isVisible, message, onClose } = this.props.store.globalSnackbar;

    return (
      <Snackbar
        open={isVisible}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        autoHideDuration={Config.intervals.snackbarLong}
        onClose={this.onCloseClicked}
        message={message}
        action={[
          <IconButton key="close" color="inherit" onClick={onClose}>
            <CloseIcon />
          </IconButton>,
        ]}
      />
    );
  }
}
