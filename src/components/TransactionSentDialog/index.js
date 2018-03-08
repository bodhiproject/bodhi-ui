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
    } = this.props;

    let contentText;
    if (txReturn) {
      if (txReturn.txid) {
        contentText = this.getSuccessText();
      } else {
        contentText = this.getErrorText();
      }
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
        onClose={this.onOkClicked}
      >
        <DialogTitle>{contentText.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" className={classes.bodyPrimary}>{contentText.bodyPrimary}</Typography>
          <Typography variant="body1">{contentText.bodySecondary}</Typography>
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
    const { intl, txReturn } = this.props;
    return {
      title: intl.formatMessage(messages.failureMsg),
      bodyPrimary: txReturn.error,
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
  // eslint-disable-next-line react/no-typos
  intl: intlShape.isRequired,
};

TransactionSentDialog.defaultProps = {
  txReturn: undefined,
};

const mapStateToProps = (state) => ({
});

function mapDispatchToProps(dispatch) {
  return {
    clearTxReturn: () => dispatch(graphqlActions.clearTxReturn()),
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(TransactionSentDialog)));
