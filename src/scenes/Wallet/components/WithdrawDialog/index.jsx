import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Dialog, { DialogTitle, DialogContent, DialogContentText, DialogActions } from 'material-ui/Dialog';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import _ from 'lodash';

import styles from './styles';
import graphqlActions from '../../../../redux/Graphql/actions';
import { Token } from '../../../../constants';
import { decimalToSatoshi } from '../../../../helpers/utility';

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
});

class WithdrawDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      toAddress: '',
      withdrawAmount: 0,
      selectedToken: Token.Qtum,
    };

    this.getFromToFields = this.getFromToFields.bind(this);
    this.getAmountFields = this.getAmountFields.bind(this);
    this.onToAddressChange = this.onToAddressChange.bind(this);
    this.onAmountChange = this.onAmountChange.bind(this);
    this.onTokenChange = this.onTokenChange.bind(this);
    this.onSendClicked = this.onSendClicked.bind(this);
  }

  render() {
    const {
      dialogVisible,
      walletAddress,
      onClose,
    } = this.props;

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
          <Button color="primary" onClick={this.onSendClicked}>
            <FormattedMessage id="withdrawDialog.send" defaultMessage="Send" />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  getFromToFields() {
    const {
      classes,
      walletAddress,
      intl,
    } = this.props;
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
  }

  getAmountFields() {
    const {
      classes,
      intl,
      qtumAmount,
      botAmount,
    } = this.props;
    const { withdrawAmount, selectedToken } = this.state;

    let withdrawLimit;
    switch (selectedToken) {
      case Token.Qtum: {
        withdrawLimit = qtumAmount;
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
  }

  onToAddressChange(event) {
    this.setState({
      toAddress: event.target.value,
    });
  }

  onAmountChange(event) {
    this.setState({
      withdrawAmount: event.target.value,
    });
  }

  onTokenChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  onSendClicked() {
    const { walletAddress, createTransferTx } = this.props;
    const { toAddress, withdrawAmount, selectedToken } = this.state;

    let amount = withdrawAmount;
    if (selectedToken === Token.Bot) {
      amount = decimalToSatoshi(withdrawAmount);
    }

    createTransferTx(walletAddress, toAddress, selectedToken, amount);
    this.props.onWithdraw();
  }
}

WithdrawDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  dialogVisible: PropTypes.bool.isRequired,
  walletAddress: PropTypes.string,
  qtumAmount: PropTypes.string,
  botAmount: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onWithdraw: PropTypes.func.isRequired,
  createTransferTx: PropTypes.func,
  // eslint-disable-next-line react/no-typos
  intl: intlShape.isRequired,
};

WithdrawDialog.defaultProps = {
  walletAddress: undefined,
  qtumAmount: undefined,
  botAmount: undefined,
  createTransferTx: undefined,
};

const mapStateToProps = (state) => ({
});

function mapDispatchToProps(dispatch) {
  return {
    createTransferTx: (senderAddress, receiverAddress, token, amount) =>
      dispatch(graphqlActions.createTransferTx(senderAddress, receiverAddress, token, amount)),
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(WithdrawDialog)));
