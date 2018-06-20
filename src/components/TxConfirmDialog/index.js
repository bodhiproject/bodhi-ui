import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  withStyles,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';

import appActions from '../../redux/App/actions';
import styles from './styles';


const messages = defineMessages({
  confirmMessage: {
    id: 'txConfirm.message',
    defaultMessage: 'You are about to {txDesc} for {txAmount} {txToken}. Please click OK to continue.',
  },
  confirmMessageWithFee: {
    id: 'txConfirm.messageWithFee',
    defaultMessage: 'You are about to {txDesc} for {txAmount} {txToken}, with fee for {txFee} QTUM. Please click OK to continue.',
  },
});

@injectIntl
@withStyles(styles, { withTheme: true })
@connect((state) => ({
  txConfirmInfoAndCallback: state.App.get('txConfirmInfoAndCallback'),
  transactionCost: state.App.get('transactionCost'),
}), (dispatch) => ({
  clearTxConfirm: () => dispatch(appActions.clearTxConfirm()),
  getTransactionCost: (txInfo) => dispatch(appActions.getTransactionCost(txInfo)),
}))
export default class TxConfirmDialog extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    txConfirmInfoAndCallback: PropTypes.object.isRequired,
    clearTxConfirm: PropTypes.func.isRequired,
    transactionCost: PropTypes.array.isRequired,
    getTransactionCost: PropTypes.func.isRequired,
  }

  componentWillReceiveProps(nextProps) {
    const { txConfirmInfoAndCallback, getTransactionCost } = nextProps;
    const { txInfo } = txConfirmInfoAndCallback;

    if (txConfirmInfoAndCallback !== this.props.txConfirmInfoAndCallback && txInfo) {
      getTransactionCost(txInfo);
    }
  }

  render() {
    const { classes, intl: { formatMessage }, txConfirmInfoAndCallback, transactionCost } = this.props;
    const { txDesc, txAmount, txToken, confirmCallback } = txConfirmInfoAndCallback;
    const isOpen = !!(txDesc && txAmount && txToken && _.isFunction(confirmCallback));
    const txFee = _.sumBy(transactionCost, (cost) => cost.gasCost ? parseFloat(cost.gasCost) : 0);

    return (
      <Dialog open={isOpen}>
        <DialogTitle>
          <FormattedMessage id="txConfirm.title" defaultMessage="Please Confirm Your Transaction" />
        </DialogTitle>
        <DialogContent>
          {txFee ? formatMessage(messages.confirmMessageWithFee, { txDesc, txAmount, txToken, txFee }) : formatMessage(messages.confirmMessage, { txDesc, txAmount, txToken })}
          {Boolean(transactionCost.length) && (
            <Table className={classes.costTable}>
              <TableHead>
                <TableRow>
                  <Cell id="str.type" defaultMessage="Type" />
                  <Cell id="str.amount" defaultMessage="Amount" />
                  <Cell id="str.fee" defaultMessage="Gas Fee (QTUM)" />
                  <Cell id="str.gasLimit" defaultMessage="Gas Limit" />
                </TableRow>
              </TableHead>
              <TableBody>
                {_.map(transactionCost, (cost, i) => (
                  <TableRow key={i}>
                    <TableCell>{cost.type}</TableCell>
                    <TableCell>{cost.amount} {cost.token}</TableCell>
                    <TableCell>{cost.gasCost}</TableCell>
                    <TableCell>{cost.gasLimit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.props.clearTxConfirm}>
            <FormattedMessage id="str.cancel" defaultMessage="Cancel" />
          </Button>
          <Button color="primary" onClick={this.onOkClicked}>
            <FormattedMessage id="str.confirm" defaultMessage="OK" />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  onOkClicked = () => {
    const { txConfirmInfoAndCallback: { confirmCallback }, clearTxConfirm } = this.props;
    if (confirmCallback) confirmCallback();
    clearTxConfirm();
  }
}

const Cell = injectIntl(({ id, defaultMessage, intl }) => (
  <TableCell>
    {intl.formatMessage({ id, defaultMessage })}
  </TableCell>
));
