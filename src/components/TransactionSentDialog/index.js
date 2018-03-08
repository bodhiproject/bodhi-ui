import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
import graphqlActions from '../../redux/Graphql/actions';

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
  ok: {
    id: 'str.ok',
    defaultMessage: 'OK',
  },
});

class TransactionSentDialog extends React.PureComponent {
  constructor(props) {
    super(props);

    this.getSuccessText = this.getSuccessText.bind(this);
    this.getErrorText = this.getErrorText.bind(this);
    this.onOkClicked = this.onOkClicked.bind(this);
  }

  render() {
    const {
      intl,
      classes,
      txReturn,
      requestError,
    } = this.props;

    let contentText;
    if (txReturn) {
      contentText = this.getSuccessText();
    } else if (requestError) {
      contentText = this.getErrorText();
    } else {
      contentText = {
        title: '',
        bodyPrimary: '',
        bodySecondary: '',
      };
    }

    return (
      <Dialog
        open={txReturn || requestError}
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
          <Button color="primary" onClick={this.onOkClicked}>
            {intl.formatMessage(messages.ok)}
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
    const { intl, requestError } = this.props;
    return {
      title: intl.formatMessage(messages.failureMsg),
      bodyPrimary: requestError.msg,
      bodySecondary: '',
    };
  }

  onOkClicked() {
    this.props.clearTxReturn();
  }
}

TransactionSentDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  txReturn: PropTypes.object,
  clearTxReturn: PropTypes.func.isRequired,
  requestError: PropTypes.object,
  // eslint-disable-next-line react/no-typos
  intl: intlShape.isRequired,
};

TransactionSentDialog.defaultProps = {
  txReturn: undefined,
  requestError: undefined,
};

const mapStateToProps = (state) => ({
});

function mapDispatchToProps(dispatch) {
  return {
    clearTxReturn: () => dispatch(graphqlActions.clearTxReturn()),
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(TransactionSentDialog)));
