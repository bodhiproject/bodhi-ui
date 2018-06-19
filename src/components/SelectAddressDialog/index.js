import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  withStyles,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
} from '@material-ui/core';
import { FormattedMessage, injectIntl } from 'react-intl';

import styles from './styles';


class SelectAddressDialog extends Component {
  static propTypes = {
    dialogVisible: PropTypes.bool.isRequired,
    walletAddresses: PropTypes.array.isRequired,
    onClosed: PropTypes.func.isRequired,
  };

  render() {
    const { dialogVisible, walletAddresses } = this.props;

    return (
      <Dialog
        open={dialogVisible}
        onClose={this.handleClose}
      >
        <DialogTitle>
          <FormattedMessage id="selectAddressDialog.selectResultSetter" defaultMessage="Select Result Setter" />
        </DialogTitle>
        <div>
          <List>
            {walletAddresses.map((item) => (
              <ListItem
                button
                onClick={() => this.handleListItemClick(item.address)}
                key={item.address}
              >
                <ListItemText primary={item.address} />
              </ListItem>
            ))}
          </List>
        </div>
      </Dialog>
    );
  }

  handleClose = () => {
    this.props.onClosed('');
  };

  handleListItemClick = (value) => {
    this.props.onClosed(value);
  };
}

export default injectIntl(withStyles(styles, { withTheme: true })(SelectAddressDialog));
