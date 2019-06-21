import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';
import { injectIntl, intlShape, defineMessages, FormattedHTMLMessage } from 'react-intl';
import { Grid, Card, CardContent, Typography, withStyles } from '@material-ui/core';
import { Token, TransactionType } from 'constants';
import InfiniteScroll from '../../../../components/InfiniteScroll';
import styles from './styles';
import { getTimeString, toFixed, shortenText } from '../../../../helpers/utility';
import { getStatusString } from '../../../../helpers/stringUtil';
import { EXPLORER } from '../../../../network/routes';

const messages = defineMessages({
  strDetailMsg: {
    id: 'str.detail',
    defaultMessage: 'Detail',
  },
  strPendingMsg: {
    id: 'str.pending',
    defaultMessage: 'Pending',
  },
  strSuccessMsg: {
    id: 'str.success',
    defaultMessage: 'Success',
  },
  strFailMsg: {
    id: 'str.fail',
    defaultMessage: 'Fail',
  },
  strYou: {
    id: 'str.you',
    defaultMessage: 'You',
  },
  createEvent: {
    id: 'historyEntry.createEvent',
    defaultMessage: '{who} <b>Created</b> "<b>{eventName}</b>" Event',
  },
  bet: {
    id: 'historyEntry.bet',
    defaultMessage: '{who} <b>Betted</b> on "<b>{resultName}</b>" in "<b>{eventName}</b>" Event',
  },
  setResult: {
    id: 'historyEntry.setResult',
    defaultMessage: '{who} <b>Set</b> "<b>{resultName}</b>" as <b>result</b> in "<b>{eventName}</b>" Event',
  },
  vote: {
    id: 'historyEntry.vote',
    defaultMessage: '{who} <b>Voted</b> on "<b>{resultName}</b>" in "<b>{eventName}</b>" Event',
  },
  withdraw: {
    id: 'historyEntry.withdraw',
    defaultMessage: '{who} <b>Withdrew {amount} NBOT</b> from "<b>{eventName}</b>" Event',
  },
});
@injectIntl
@withStyles(styles, { withTheme: true })
@withRouter
@inject('store')
@observer
class EventRow extends Component {
    static propTypes = {
      intl: intlShape.isRequired, // eslint-disable-line react/no-typos
      classes: PropTypes.object.isRequired,
      transaction: PropTypes.object.isRequired,
      history: PropTypes.object.isRequired,
    };

    onEventNameClick = (eventAddress) => async (event) => {
      event.stopPropagation();
      if (eventAddress) {
        const { history } = this.props;
        const nextLocation = `/event/${eventAddress}`;
        if (nextLocation) history.push(nextLocation);
      }
    }

    renderCardString = (transaction, intl) => {
      const { txType, amount } = transaction;
      let { eventName, resultName } = transaction;
      if (eventName && eventName.length > 20) eventName = shortenText(eventName, 6);
      if (resultName && resultName.length > 20) resultName = shortenText(resultName, 6);

      switch (txType) {
        case TransactionType.CREATE_EVENT: {
          return (
            <Fragment>
              <FormattedHTMLMessage
                id="historyEntry.createEvent"
                defaultMessage={'{who} <b>Created</b> "<b>{eventName}</b>" Event'}
                values={{ who: intl.formatMessage(messages.strYou), eventName }}
              />
            </Fragment>
          );
        }
        case TransactionType.BET: {
          return (
            <Fragment>
              <FormattedHTMLMessage
                id="historyEntry.bet"
                defaultMessage={'{who} <b>Betted</b> on "<b>{resultName}</b>" in "<b>{eventName}</b>" Event'}
                values={{ who: intl.formatMessage(messages.strYou), resultName, eventName }}
              />
            </Fragment>
          );
        }
        case TransactionType.RESULT_SET: {
          return (
            <Fragment>
              <FormattedHTMLMessage
                id="historyEntry.setResult"
                defaultMessage={'{who} <b>Set</b> "<b>{resultName}</b>" as <b>result</b> in "<b>{eventName}</b>" Event'}
                values={{ who: intl.formatMessage(messages.strYou), resultName, eventName }}
              />
            </Fragment>
          );
        }
        case TransactionType.VOTE: {
          return (
            <Fragment>
              <FormattedHTMLMessage
                id="historyEntry.vote"
                defaultMessage={'{who} <b>Voted</b> on "<b>{resultName}</b>" in "<b>{eventName}</b>" Event'}
                values={{ who: intl.formatMessage(messages.strYou), resultName, eventName }}
              />
            </Fragment>
          );
        }
        case TransactionType.WITHDRAW: {
          return (
            <Fragment>
              <FormattedHTMLMessage
                id="historyEntry.withdraw"
                defaultMessage={'{who} <b>Withdrew {amount} NBOT</b> from "<b>{eventName}</b>" Event'}
                values={{ who: intl.formatMessage(messages.strYou), amount: toFixed(amount, true), eventName }}
              />
            </Fragment>
          );
        }
        default: {
          return (
            <Fragment>
              {`Invalid txType: ${txType}`}
            </Fragment>
          );
        }
      }
    }

    render() {
      const { transaction, intl, classes } = this.props;
      const { txStatus, block, eventAddress, amount } = transaction;
      const blockTime = block ? getTimeString(block.blockTime) : intl.formatMessage(messages.strPendingMsg);
      const status = getStatusString(txStatus, intl);

      return (
        <Grid container className={classes.grid} justify="center">
          <Grid item xs={10} sm={10}>
            <Card
              className={classes.card}
              onClick={this.onEventNameClick(eventAddress)}
            >
              <CardContent>
                <Typography color='textPrimary'>
                  {this.renderCardString(transaction, intl, classes)}
                </Typography>
              </CardContent>
            </Card>
            <div className={classes.note}>
              <Typography color='textPrimary'>
                {`${toFixed(amount, true)} ${Token.NBOT} · ${status} · ${blockTime} · `}
                <a href={`${EXPLORER.TX}/${transaction.txid}`} target="_blank" className={classes.link}>
                  {intl.formatMessage(messages.strDetailMsg)}
                </a>
              </Typography>
            </div>
          </Grid>
        </Grid>
      );
    }
}

const EventRows = ({ store: { history: { transactions, loadMoreTransactions, loadingMore } } }) => {
  const cards = transactions.map((transaction) => <EventRow key={transaction.txid} transaction={transaction} />); // eslint-disable-line
  return (
    <Fragment>
      <InfiniteScroll
        spacing={2}
        data={cards}
        loadMore={loadMoreTransactions}
        loadingMore={loadingMore}
      />
    </Fragment>
  );
};

export default inject('store')(observer(EventRows));
