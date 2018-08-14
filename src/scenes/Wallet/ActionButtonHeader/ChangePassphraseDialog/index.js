import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  withStyles,
} from '@material-ui/core';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import _ from 'lodash';
import { inject, observer } from 'mobx-react';

const messages = defineMessages({
  oldPassphrase: {
    id: 'str.oldPassphrase',
    defaultMessage: 'OLD PASSPHRASE',
  },
  newPassphrase: {
    id: 'str.newPassphrase',
    defaultMessage: 'NEW PASSPHRASE',
  },
});


@injectIntl
@withStyles(null, { withTheme: true })
@inject('store')
@observer
export default class ChangePassphraseDialog extends Component {
  static propTypes = {
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    dialogVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    closeEncryptDialog: PropTypes.func.isRequired,
  };

  state = {
    oldPassphrase: '',
    newPassphrase: '',
  };

  submitPasswordChange = () => {
    const { oldPassphrase, newPassphrase } = this.state;
    const { closeEncryptDialog, onClose, store: { wallet: { changePassphrase } } } = this.props;
    changePassphrase(oldPassphrase, newPassphrase);
    closeEncryptDialog();
    onClose();
  }

  render() {
    const { dialogVisible, onClose, intl } = this.props;
    const { oldPassphrase, newPassphrase } = this.state;
    return (
      <Dialog
        open={dialogVisible}
        onClose={onClose}
      >
        <DialogTitle>
          <FormattedMessage id="str.changePassphrase" defaultMessage="Change your passphrase" />
        </DialogTitle>
        <DialogContent>
          <div>
            <Typography variant="title" ></Typography>
            <TextField
              autoFocus
              margin="normal"
              id="oldPassphrase"
              label={intl.formatMessage(messages.oldPassphrase)}
              type="password"
              fullWidth
              onChange={(e) => this.setState({ oldPassphrase: e.target.value })}
              error={_.isEmpty(oldPassphrase)}
              required
            />
            <TextField
              margin="normal"
              id="newPassphrase"
              label={intl.formatMessage(messages.newPassphrase)}
              type="password"
              fullWidth
              onChange={(e) => this.setState({ newPassphrase: e.target.value })}
              error={_.isEmpty(newPassphrase)}
              required
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>
            <FormattedMessage id="str.close" defaultMessage="Close" />
          </Button>
          <Button color="primary" onClick={this.submitPasswordChange}>
            <FormattedMessage id="str.ok" defaultMessage="Ok" />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
