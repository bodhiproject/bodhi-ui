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

    let contentText;
    if (txReturn) {
      contentText = txReturn && txReturn.txid ? this.getSuccessText() : this.getErrorText();
    } else {
      contentText = {
        title: '',
        bodyPrimary: '',
        bodySecondary: '',
      };
    }

    return (
      <Dialog
        open={Boolean(txReturn)}
        onClose={this.handleAlertClose}
      >
        <DialogTitle id="alert-dialog-title">{contentText.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography variant="body1" className={classes.bodyText1}>{contentText.bodyPrimary}</Typography>
            <Typography variant="body1">{contentText.bodySecondary}</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary">
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
      bodyPrimary: `${intl.formatMessage(messages.waitingMsg)}`,
      bodySecondary: `${intl.formatMessage(messages.transactionId)}: ${txReturn.txid}`,
    };
  }

  getErrorText() {
    const { intl, txReturn } = this.props;
    return {
      title: intl.formatMessage(messages.failureMsg),
      bodyPrimary: txReturn.error,
      bodySecondary: '',
    };
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
