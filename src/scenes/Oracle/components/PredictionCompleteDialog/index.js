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
    const { requestReturn } = this.props;

    return (
      <Dialog
        open={Boolean(requestReturn)}
        onClose={this.handleAlertClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{requestReturn && requestReturn.result ? 'Success!' : 'Oops, something went wrong'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {requestReturn && requestReturn.result ?
              'The transaction is broadcasted to blockchain. You can view details at https://testnet.qtum.org/tx/'.concat(requestReturn && requestReturn.result.txid).concat('!') :
              requestReturn && requestReturn.error
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
  requestReturn: PropTypes.object,
};

PredictionCompleteDialog.defaultProps = {
  requestReturn: undefined,
};

export default PredictionCompleteDialog;
