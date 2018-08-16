/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  TextField,
  Button,
  Typography,
  withStyles,
} from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import _ from 'lodash';
import { Token } from 'constants';

import styles from './styles';


const messages = defineMessages({
  to: {
    id: 'str.to',
    defaultMessage: 'To',
  },
  amount: {
    id: 'str.amount',
    defaultMessage: 'Amount',
  },
  youCanWithdraw: {
    id: 'withdrawDialog.youCanWithdraw',
    defaultMessage: 'You can withdraw up to:',
  },
  confirmSendMsg: {
    id: 'txConfirmMsg.send',
    defaultMessage: 'send to address {address}',
  },
});

@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class WithdrawDialog extends Component {
  static propTypes = {
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    classes: PropTypes.object.isRequired,
    dialogVisible: PropTypes.bool.isRequired,
    walletAddress: PropTypes.string,
    botAmount: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    onWithdraw: PropTypes.func.isRequired,
  };

  static defaultProps = {
    walletAddress: undefined,
    botAmount: undefined,
  };

  render() {
    const { dialogVisible, walletAddress, onClose, store: { wallet } } = this.props;

    if (!walletAddress) {
      return null;
    }

    return (
      <Dialog
        open={dialogVisible}
        onClose={onClose}
      >
        <DialogTitle>
          <FormattedMessage id="withdrawDialog.title" defaultMessage="Withdraw QTUM/BOT" />
        </DialogTitle>
        <DialogContent>
          {this.getFromToFields()}
          {this.getAmountFields()}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>
            <FormattedMessage id="str.close" defaultMessage="Close" />
          </Button>
          <Button color="primary" onClick={wallet.prepareWithdraw.bind(this, walletAddress)}>
            <FormattedMessage id="withdrawDialog.send" defaultMessage="Send" />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  getFromToFields = () => {
    const { classes, walletAddress, intl, store: { wallet } } = this.props;
    const { toAddress } = wallet;

    return (
      <div>
        <Typography variant="body1" className={classes.fromLabel}>
          <FormattedMessage id="str.from" defaultMessage="From" />
        </Typography>
        <Typography variant="title" className={classes.fromAddress}>{walletAddress}</Typography>
        <TextField
          autoFocus
          margin="dense"
          id="toAddress"
          label={intl.formatMessage(messages.to)}
          type="string"
          fullWidth
          className={classes.toAddress}
          onChange={wallet.onToAddressChange.bind(this, event)} // eslint-disable-line
          error={wallet.withdrawDialogError.walletAddress !== ''} // 
          required
        />
      </div>
    );
  };

  getAmountFields = () => {
    const {
      classes,
      intl,
      botAmount,
      store: { wallet },
    } = this.props;
    const { withdrawAmount, selectedToken } = wallet;

    let withdrawLimit = 0;
    switch (wallet.selectedToken) {
      case Token.QTUM: {
        withdrawLimit = _.sumBy(wallet.addresses, (w) => w.qtum ? w.qtum : 0);
        break;
      }
      case Token.BOT: {
        withdrawLimit = botAmount;
        break;
      }
      default: {
        throw new Error(`Invalid selectedToken ${wallet.selectedToken}`);
      }
    }

    const withdrawAmountText = intl.formatMessage(messages.youCanWithdraw);

    return (
      <div>
        <div className={classes.inputContainer}>
          <TextField
            margin="dense"
            id="amount"
            label={intl.formatMessage(messages.amount)}
            type="number"
            className={classes.amountInput}
            onChange={wallet.onAmountChange.bind(this, event)} // eslint-disable-line
            error={wallet.withdrawDialogError.botAmount !== ''} // 
            required
          />
          <Select
            value={selectedToken}
            onChange={wallet.onTokenChange.bind(this, event)} // eslint-disable-line
            inputProps={{ name: 'selectedToken', id: 'selectedToken' }}
          >
            <MenuItem value={Token.QTUM}>QTUM</MenuItem>
            <MenuItem value={Token.BOT}>BOT</MenuItem>
          </Select>
        </div>
        <Typography variant="body1">
          {`${withdrawAmountText} ${withdrawLimit}`}
        </Typography>
      </div>
    );
  };
}
