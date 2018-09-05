import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import {
  withStyles,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
import { FormattedMessage, injectIntl } from 'react-intl';

import styles from './styles';

@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class ErrorDialog extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  clearGlobalMessage = () => {
    // Clear error object in MobX store
    this.props.store.ui.clearGlobalMessage();
  }

  render() {
    const { classes, intl } = this.props;
    const storeMessage = this.props.store.ui.globalMessage;

    return storeMessage && (
      <Dialog open={Boolean(storeMessage)}>
        <DialogTitle>{storeMessage.title.id ? intl.formatMessage({ id: storeMessage.title.id, defaultMessage: storeMessage.title.defaultMessage }) : storeMessage.title}</DialogTitle>
        <DialogContent>
          {storeMessage.messageType === 'ERROR' && <Typography className={classes.errorRoute}>{storeMessage.additionalMessage}</Typography>}
          <Typography className={storeMessage.messageType === 'ERROR' ? classes.globalMessageError : classes.globalMessageDefault}>
            {storeMessage.message.id ? intl.formatMessage({ id: storeMessage.message.id, defaultMessage: storeMessage.message.defaultMessage }) : storeMessage.message}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.clearGlobalMessage}>
            <FormattedMessage id="str.ok" defaultMessage="OK" />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
