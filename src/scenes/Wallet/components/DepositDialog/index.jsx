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
            <FormattedMessage id="depositDialog.title" default="QTUM/BOT Deposit Address" />
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="body1">{walletAddress}</Typography>
            <Typography variant="body1">{`QTUM: ${qtumAmount}`}</Typography>
            <Typography variant="body1">{`BOT: ${botAmount}`}</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            <FormattedMessage id="str.close" default="Close" />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

DepositDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  dialogVisible: PropTypes.bool.isRequired,
  walletAddress: PropTypes.string,
  qtumAmount: PropTypes.number,
  botAmount: PropTypes.number,
  onClose: PropTypes.func.isRequired,
};

DepositDialog.defaultProps = {
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

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(DepositDialog)));
