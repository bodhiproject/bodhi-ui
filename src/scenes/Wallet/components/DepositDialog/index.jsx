import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Dialog, { DialogTitle, DialogContent, DialogContentText, DialogActions } from 'material-ui/Dialog';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import styles from './styles';

class DepositDialog extends React.Component {
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
          <FormattedMessage id="depositDialog.title" defaultMessage="QTUM/BOT Deposit Address" />
        </DialogTitle>
        <DialogContent>
          <Typography variant="title" className={classes.depositAddress}>
            {walletAddress}
          </Typography>
          <Typography variant="body1" className={classes.qtumAmount}>
            {`QTUM: ${qtumAmount}`}
          </Typography>
          <Typography variant="body1">
            {`BOT: ${botAmount}`}
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

DepositDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  dialogVisible: PropTypes.bool.isRequired,
  walletAddress: PropTypes.string,
  qtumAmount: PropTypes.string,
  botAmount: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onCopyClicked: PropTypes.func.isRequired,
};

DepositDialog.defaultProps = {
  walletAddress: undefined,
  qtumAmount: undefined,
  botAmount: undefined,
};

const mapStateToProps = (state) => ({
});

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(DepositDialog)));
