import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button,
  Typography,
  withStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import { injectIntl, intlShape, defineMessages } from 'react-intl';

import styles from './styles';
import graphqlActions from '../../redux/Graphql/actions';

const messages = defineMessages({
  successMsg: {
    id: 'transactionSentDialog.successMsg',
    defaultMessage: 'Success',
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
@connect((state) => ({
  txReturn: state.Graphql.get('txReturn'),
}), (dispatch) => ({
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

  render() {
    const { intl, classes, txReturn, clearTxReturn } = this.props;
    if (!txReturn) return null;

    return (
      <Dialog open={Boolean(txReturn)} onClose={clearTxReturn}>
        <DialogTitle>{intl.formatMessage(messages.successMsg)}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" className={classes.bodyPrimary}>{intl.formatMessage(messages.waitingMsg)}</Typography>
          <Typography variant="body1">{`${intl.formatMessage(messages.transactionId)}: ${txReturn.txid}`}</Typography>
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
