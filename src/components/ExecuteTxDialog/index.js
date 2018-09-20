import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withStyles, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, Divider, Typography } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';

import styles from './styles';
import PendingTxListItem from './PendingTxListItem';

@withStyles(styles)
@inject('store')
@observer
export default class ExecuteTxDialog extends Component {
  render() {
    const { classes } = this.props;
    const { visible, transactions } = this.props.store.tx;

    return (
      <Dialog open={visible} maxWidth="sm">
        <DialogTitle>
          <FormattedMessage id="txConfirm.title" defaultMessage="Please Confirm Your Transaction" />
        </DialogTitle>
        <DialogContent>
          <Typography variant="heading">
            <FormattedMessage
              id='txConfirm.txFeeReturnMsg'
              defaultMessage='Gas fees are the maximum amount that you will spend for that transaction. Any unused gas fees will be refunded to you.'
            />
          </Typography>
          <List>
            <Divider />
            {transactions.map((tx, index) => (
              <div>
                <ListItem className={classes.listItem}>
                  <div className={classes.listItemTxNumber}>
                    <FormattedMessage
                      id="txConfirm.transactionX"
                      defaultMessage="Transaction #{txNumber}"
                      values={{ txNumber: index + 1 }}
                    />
                  </div>
                  <PendingTxListItem tx={tx} index={index} />
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.props.store.tx.visible = false}>
            <FormattedMessage id="str.cancel" defaultMessage="Cancel" />
          </Button>
          <Button color="primary" onClick={this.props.store.tx.onTxConfirmed}>
            <FormattedMessage id="str.confirm" defaultMessage="Confirm" />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
