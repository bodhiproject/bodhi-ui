import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Typography, withStyles } from 'material-ui';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
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


@injectIntl
@withStyles(styles, { withTheme: true })
@connect(null, (dispatch) => ({
  clearTxReturn: () => dispatch(graphqlActions.clearTxReturn()),
}))
export default class TransactionSentDialog extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    txReturn: PropTypes.object,
    clearTxReturn: PropTypes.func.isRequired,
    intl: intlShape.isRequired, // eslint-disable-line
  }

  static defaultProps = {
    txReturn: undefined,
  }

  get successText() {
    const { intl, txReturn } = this.props;
    return {
      title: intl.formatMessage(messages.successMsg),
      bodyPrimary: intl.formatMessage(messages.waitingMsg),
      bodySecondary: `${intl.formatMessage(messages.transactionId)}: ${txReturn.txid}`,
    };
  }

  get errorText() {
    const { intl, txReturn } = this.props;
    return {
      title: intl.formatMessage(messages.failureMsg),
      bodyPrimary: txReturn.error,
      bodySecondary: '',
    };
  }

  render() {
    const { intl, classes, txReturn, clearTxReturn } = this.props;

    let contentText;
    if (txReturn) {
      if (txReturn.txid) {
        contentText = this.successText;
      } else {
        contentText = this.errorText;
      }
    } else {
      contentText = {
        title: '',
        bodyPrimary: '',
        bodySecondary: '',
      };
    }

    return (
      <Dialog open={Boolean(txReturn)} onClose={clearTxReturn}>
        <DialogTitle>{contentText.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" className={classes.bodyPrimary}>{contentText.bodyPrimary}</Typography>
          <Typography variant="body1">{contentText.bodySecondary}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={clearTxReturn}>
            {intl.formatMessage(messages.ok)}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
