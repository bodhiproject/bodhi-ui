import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  withStyles,
  Typography,
  Button,
} from '@material-ui/core';
import { FormattedMessage, injectIntl } from 'react-intl';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import styles from './styles';


@withStyles(styles, { withTheme: true })
@injectIntl
export default class DepositDialog extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dialogVisible: PropTypes.bool.isRequired,
    walletAddress: PropTypes.string,
    nakaAmount: PropTypes.string,
    nbotAmount: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    onCopyClicked: PropTypes.func.isRequired,
  }

  static defaultProps = {
    walletAddress: undefined,
    nakaAmount: undefined,
    nbotAmount: undefined,
  }

  render() {
    const {
      classes,
      dialogVisible,
      walletAddress,
      nakaAmount,
      nbotAmount,
      onClose,
      onCopyClicked,
    } = this.props;

    if (!walletAddress) {
      return null;
    }

    return (
      <Dialog open={dialogVisible} onClose={onClose}>
        <DialogTitle>
          <FormattedMessage id="depositDialog.title" defaultMessage="NAKA/NBOT Deposit Address" />
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" className={classes.depositAddress}>
            {walletAddress}
          </Typography>
          <Typography variant="body2" className={classes.nakaAmount}>
            {`NAKA: ${nakaAmount}`}
          </Typography>
          <Typography variant="body2">
            {`NBOT: ${nbotAmount}`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>
            <FormattedMessage id="str.close" defaultMessage="Close" />
          </Button>
          <CopyToClipboard text={walletAddress} onCopy={onCopyClicked}>
            <Button color="primary">
              <FormattedMessage id="str.copy" defaultMessage="Copy" />
            </Button>
          </CopyToClipboard>
        </DialogActions>
      </Dialog>
    );
  }
}
