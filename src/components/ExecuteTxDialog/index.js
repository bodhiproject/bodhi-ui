import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withStyles, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, Typography, Paper } from '@material-ui/core';
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
          <Typography variant="body2">
            <FormattedMessage
              id='txConfirm.txFeeReturnMsg'
              defaultMessage='Gas fees are the maximum amount that you will spend for that transaction. Any unused gas fees will be refunded to you.'
            />
          </Typography>
          <List>
            {transactions.map((tx, index) => (
              <ListItem className={classes.listItem} key={index}>
                <Paper className={classes.listItemPaper}>
                  <div className={classes.listItemTxNumber}>
                    <FormattedMessage
                      id="txConfirm.transactionX"
                      defaultMessage="Transaction #{txNumber}"
                      values={{ txNumber: index + 1 }}
                    />
                  </div>
                  <PendingTxListItem tx={tx} index={index} />
                </Paper>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button color="primary" size="small" onClick={() => this.props.store.tx.visible = false}>
            <FormattedMessage id="str.close" defaultMessage="Close" />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
