import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
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


@inject('store')
@observer
class SelectAddressDialog extends Component {
  static propTypes = {
    onClosed: PropTypes.func.isRequired,
  };

  render() {
    const { selectAddressDialog: { isVisible }, wallet: { addresses } } = this.props.store;

    return (
      <Dialog
        open={isVisible}
        onClose={this.handleClose}
      >
        <DialogTitle>
          <FormattedMessage id="selectAddressDialog.selectResultSetter" defaultMessage="Select Result Setter" />
        </DialogTitle>
        <div>
          <List>
            {addresses.map((item) => (
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
