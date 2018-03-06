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

import styles from './styles';

const ID_QTUM = 'qtum';
const ID_BOT = 'bot';

const messages = defineMessages({
  youCanWithdraw: {
    id: 'withdrawDialog.youCanWithdraw',
    defaultMessage: 'You can withdraw up to:',
  },
});

class WithdrawDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedToken: ID_QTUM,
    };

    this.getFromToFields = this.getFromToFields.bind(this);
    this.getAmountFields = this.getAmountFields.bind(this);
    this.onTokenChange = this.onTokenChange.bind(this);
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
          <Typography variant="title">
            <FormattedMessage id="withdrawDialog.title" default="Withdraw QTUM/BOT" />
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {this.getFromToFields()}
            {this.getAmountFields()}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>
            <FormattedMessage id="str.close" default="Close" />
          </Button>
          <Button color="primary">
            <FormattedMessage id="withdrawDialog.send" default="Send" />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  getFromToFields() {
    const {
      classes,
      walletAddress,
    } = this.props;

    return (
      <div>
        <Typography variant="body1" className={classes.destLabel}>
          <FormattedMessage id="str.from" default="From" />
        </Typography>
        <Typography variant="title" className={classes.fromAddress}>{walletAddress}</Typography>
        <Typography variant="body1">
          <FormattedMessage id="str.to" default="To" />
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          id="toAddress"
          type="string"
          fullWidth
          className={classes.toAddress}
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
    const { selectedToken } = this.state;

    let withdrawLimit;
    switch (selectedToken) {
      case ID_QTUM: {
        withdrawLimit = qtumAmount;
        break;
      }
      case ID_BOT: {
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
        <div className={classes.withdrawInputContainer}>
          <TextField
            margin="dense"
            id="amount"
            label="Amount"
            type="number"
            fullWidth
            className={classes.amountInput}
          />
          <Select
            value={selectedToken}
            onChange={this.onTokenChange}
            inputProps={{ name: 'selectedToken', id: 'selectedToken' }}
          >
            <MenuItem value={ID_QTUM}>QTUM</MenuItem>
            <MenuItem value={ID_BOT}>BOT</MenuItem>
          </Select>
        </div>
        <Typography variant="body1">
          {`${withdrawAmountText} ${withdrawLimit}`}
        </Typography>
      </div>
    );
  }

  onTokenChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
}

WithdrawDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  dialogVisible: PropTypes.bool.isRequired,
  walletAddress: PropTypes.string,
  qtumAmount: PropTypes.number,
  botAmount: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-typos
  intl: intlShape.isRequired,
};

WithdrawDialog.defaultProps = {
  walletAddress: undefined,
  qtumAmount: 0,
  botAmount: 0,
};

const mapStateToProps = (state) => ({
});

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(WithdrawDialog)));
