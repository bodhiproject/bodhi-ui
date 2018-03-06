import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import { withStyles } from 'material-ui/styles';
import { injectIntl, intlShape, defineMessages } from 'react-intl';

import styles from './styles';

const messages = defineMessages({
  successMsg: {
    id: 'transactionSentDialog.successMsg',
    defaultMessage: 'Success',
  },
  failureMsg: {
    id: 'transactionSentDialog.failureMsg',
    defaultMessage: 'Oops, something went wrong',
  },
  waitingMsg: {
    id: 'transactionSentDialog.waitingMsg',
    defaultMessage: 'Transaction sent. Waiting for confirmations.',
  },
  transactionId: {
    id: 'str.transactionId',
    defaultMessage: 'Transaction ID',
  },
});

class TransactionSentDialog extends React.PureComponent {
  constructor(props) {
    super(props);

    this.getSuccessText = this.getSuccessText.bind(this);
    this.getErrorText = this.getErrorText.bind(this);
  }

  render() {
    const { classes, txReturn } = this.props;

    let text;
    if (txReturn) {
      text = txReturn && txReturn.txid ? this.getSuccessText() : this.getErrorText();
    } else {
      text = {
        title: '',
        body1: '',
        body2: '',
      };
    }

    return (
      <Dialog
        open={Boolean(txReturn)}
        onClose={this.handleAlertClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{text.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography variant="body1" className={classes.bodyText1}>{text.body1}</Typography>
            <Typography variant="body1">{text.body2}</Typography>
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

  getSuccessText() {
    const { intl, txReturn } = this.props;
    return {
      title: intl.formatMessage(messages.successMsg),
      body1: `${intl.formatMessage(messages.waitingMsg)}`,
      body2: `${intl.formatMessage(messages.transactionId)}: ${txReturn.txid}`,
    };
  }

  getErrorText() {
    const { intl, txReturn } = this.props;
    return {
      title: intl.formatMessage(messages.failureMsg),
      body1: txReturn.error,
      body2: '',
    };
  }

  handleAlertClose() {
    window.location.reload();
  }
}

TransactionSentDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  txReturn: PropTypes.object,
  // eslint-disable-next-line react/no-typos
  intl: intlShape.isRequired,
};

TransactionSentDialog.defaultProps = {
  txReturn: undefined,
};

export default injectIntl(withStyles(styles, { withTheme: true })(TransactionSentDialog));
