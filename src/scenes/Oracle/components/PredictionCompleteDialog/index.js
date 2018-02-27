import React, { PropTypes } from 'react';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

class PredictionCompleteDialog extends React.PureComponent {
  render() {
    const { txReturn } = this.props;

    return (
      <Dialog
        open={Boolean(txReturn)}
        onClose={this.handleAlertClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {txReturn && txReturn.txid ? 'Success!' : 'Oops, something went wrong'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {txReturn && txReturn.txid
              ? `Transaction sent. Waiting for confirmations.\nhttps://testnet.qtum.org/tx/${txReturn.txid}`
              : txReturn && txReturn.error
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleAlertClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  handleAlertClose() {
    window.location.reload();
  }
}

PredictionCompleteDialog.propTypes = {
  txReturn: PropTypes.object,
};

PredictionCompleteDialog.defaultProps = {
  txReturn: undefined,
};

export default PredictionCompleteDialog;
