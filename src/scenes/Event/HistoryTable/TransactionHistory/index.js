import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Typography, withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import InfiniteScroll from '../../../../components/InfiniteScroll';
import styles from './styles';
import TxRow from './TxRow';

@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class TransactionHistory extends Component {
  render() {
    const { store: { history: { loadingMore } }, showMyTransactions } = this.props;
    let { store: { history: { transactions, myTransactions } } } = this.props;
    let cards = [];
    if (!showMyTransactions) {
      transactions = transactions.slice(0, 5);
      cards = transactions.map((transaction) => <TxRow key={transaction.txid} transaction={transaction} />);
    } else {
      myTransactions = myTransactions.slice(0, 5);
      cards = myTransactions.map((transaction) => <TxRow key={transaction.txid} transaction={transaction} />);
    }
    return (
      <div>
        {cards.length > 0 ? (
          <InfiniteScroll
            spacing={0}
            data={cards}
            loadMore={() => {}}
            loadingMore={loadingMore}
          />
        ) : (
          <CenteredDiv>
            <Typography variant="body2">
              <FormattedMessage id="str.emptyTxHistory" defaultMessage="You do not have any transactions right now." />
            </Typography>
          </CenteredDiv>
        )}
      </div>
    );
  }
}

export const CenteredDiv = withStyles(styles)(({ classes, ...props }) => (
  <div className={classes.centeredDiv} {...props} />
));
