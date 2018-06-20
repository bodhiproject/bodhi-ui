import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import _ from 'lodash';

import styles from './styles';
import graphqlActions from '../../../../redux/Graphql/actions';
import appActions from '../../../../redux/App/actions';
import { Token, TransactionType } from '../../../../constants';
import { decimalToSatoshi } from '../../../../helpers/utility';
import Tracking from '../../../../helpers/mixpanelUtil';


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
@connect((state) => ({
  walletAddresses: state.App.get('walletAddresses'),
}), (dispatch) => ({
  createTransferTx: (senderAddress, receiverAddress, token, amount) =>
    dispatch(graphqlActions.createTransferTx(senderAddress, receiverAddress, token, amount)),
  setTxConfirmInfoAndCallback: (txDesc, txAmount, txToken, txInfo, confirmCallback) => dispatch(appActions.setTxConfirmInfoAndCallback(txDesc, txAmount, txToken, txInfo, confirmCallback)),
}))
export default class WithdrawDialog extends Component {
  static propTypes = {
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    classes: PropTypes.object.isRequired,
    dialogVisible: PropTypes.bool.isRequired,
    walletAddress: PropTypes.string,
    botAmount: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    onWithdraw: PropTypes.func.isRequired,
    createTransferTx: PropTypes.func,
    walletAddresses: PropTypes.array.isRequired,
    setTxConfirmInfoAndCallback: PropTypes.func.isRequired,
  };

  static defaultProps = {
    walletAddress: undefined,
    botAmount: undefined,
    createTransferTx: undefined,
  };

  state = {
    toAddress: '',
    withdrawAmount: 0,
    selectedToken: Token.Qtum,
  };

  render() {
    const { dialogVisible, walletAddress, onClose } = this.props;

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
          <Button color="primary" onClick={this.confirmSend}>
            <FormattedMessage id="withdrawDialog.send" defaultMessage="Send" />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  getFromToFields = () => {
    const { classes, walletAddress, intl } = this.props;
    const { toAddress } = this.state;

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
          onChange={this.onToAddressChange}
          error={_.isEmpty(toAddress)}
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
      walletAddresses,
    } = this.props;
    const { withdrawAmount, selectedToken } = this.state;

    let withdrawLimit = 0;
    switch (selectedToken) {
      case Token.Qtum: {
        withdrawLimit = _.sumBy(walletAddresses, (wallet) => wallet.qtum ? wallet.qtum : 0);
        break;
      }
      case Token.Bot: {
        withdrawLimit = botAmount;
        break;
      }
      default: {
        throw new Error(`Invalid selectedToken ${selectedToken}`);
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
            onChange={this.onAmountChange}
            error={withdrawAmount < 0 || _.isEmpty(withdrawAmount)}
            required
          />
          <Select
            value={selectedToken}
            onChange={this.onTokenChange}
            inputProps={{ name: 'selectedToken', id: 'selectedToken' }}
          >
            <MenuItem value={Token.Qtum}>QTUM</MenuItem>
            <MenuItem value={Token.Bot}>BOT</MenuItem>
          </Select>
        </div>
        <Typography variant="body1">
          {`${withdrawAmountText} ${withdrawLimit}`}
        </Typography>
      </div>
    );
  };

  onToAddressChange = (event) => {
    this.setState({
      toAddress: event.target.value,
    });
  };

  onAmountChange = (event) => {
    this.setState({
      withdrawAmount: event.target.value,
    });
  };

  onTokenChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  submitSend = () => {
    const { walletAddress, createTransferTx } = this.props;
    const { toAddress, withdrawAmount, selectedToken } = this.state;

    let amount = withdrawAmount;
    if (selectedToken === Token.Bot) {
      amount = decimalToSatoshi(withdrawAmount);
    }

    createTransferTx(walletAddress, toAddress, selectedToken, amount);
    this.props.onWithdraw();

    Tracking.track('myWallet-withdraw');
  };

  confirmSend = () => {
    const { toAddress, withdrawAmount, selectedToken } = this.state;
    const { walletAddress, intl, setTxConfirmInfoAndCallback } = this.props;
    const self = this;

    setTxConfirmInfoAndCallback(
      intl.formatMessage(messages.confirmSendMsg, { address: toAddress }),
      withdrawAmount,
      selectedToken,
      {
        type: TransactionType.Transfer,
        token: selectedToken,
        amount: withdrawAmount,
        optionIdx: undefined,
        topicAddress: undefined,
        oracleAddress: undefined,
        senderAddress: walletAddress,
      },
      () => {
        self.submitSend();
      }
    );
  }
}
