import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import List, { ListItem, ListItemAvatar, ListItemText } from 'material-ui/List';
import Dialog, { DialogTitle } from 'material-ui/Dialog';
import Typography from 'material-ui/Typography';
import { FormattedMessage, injectIntl } from 'react-intl';

import styles from './styles';

class SelectAddressDialog extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dialogVisible: PropTypes.bool.isRequired,
    walletAddresses: PropTypes.array.isRequired,
    onClosed: PropTypes.func.isRequired,
  };

  render() {
    const {
      classes,
      dialogVisible,
      walletAddresses,
    } = this.props;

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
