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
import { FormattedMessage, injectIntl } from 'react-intl';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import styles from './styles';

class WithdrawDialog extends React.Component {
  render() {
    const {
      classes,
      dialogVisible,
      walletAddress,
      qtumAmount,
      botAmount,
      onClose,
      onCopyClicked,
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
            <Typography variant="title" className={classes.depositAddress}>{walletAddress}</Typography>
            <div className={classes.withdrawInputContainer}>
              <TextField
                autoFocus
                margin="dense"
                id="amount"
                label="Amount"
                type="number"
                fullWidth
                className={classes.amountInput}
              />
              <Select
                value={1}
                inputProps={{ name: 'age', id: 'age-simple' }}
              >
                <MenuItem value={1}>QTUM</MenuItem>
                <MenuItem value={2}>BOT</MenuItem>
              </Select>
            </div>
            <Typography variant="body1" className={classes.qtumAmount}>{`QTUM: ${qtumAmount}`}</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>
            <FormattedMessage id="str.close" default="Close" />
          </Button>
          <CopyToClipboard text={walletAddress} onCopy={onCopyClicked}>
            <Button color="primary">
              <FormattedMessage id="str.copy" default="Copy" />
            </Button>
          </CopyToClipboard>
        </DialogActions>
      </Dialog>
    );
  }
}

WithdrawDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  dialogVisible: PropTypes.bool.isRequired,
  walletAddress: PropTypes.string,
  qtumAmount: PropTypes.number,
  botAmount: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  onCopyClicked: PropTypes.func.isRequired,
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
