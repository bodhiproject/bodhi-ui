import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { injectIntl, intlShape, defineMessages, FormattedHTMLMessage } from 'react-intl';
import { withStyles, Grid, CardContent, Card, Typography } from '@material-ui/core';
import { Token, TransactionType } from 'constants';
import styles from './styles';
import { getTimeString, toFixed } from '../../../../helpers/utility';
import { getStatusString, getAddressName } from '../../../../helpers/stringUtil';
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
});

@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class TxRow extends Component {
  static propTypes = {
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    classes: PropTypes.object.isRequired,
    transaction: PropTypes.object.isRequired,
  };

  renderCardString = (transaction, intl, account) => {
    const { txType, amount, txSender, txSenderName, eventName, resultName } = transaction;
    const who = getAddressName(account, intl, txSender, txSenderName);

    switch (txType) {
      case TransactionType.CREATE_EVENT: {
        return (
          <Fragment>
            <FormattedHTMLMessage
              id="historyEntry.createEvent"
              defaultMessage={'{who} <b>Created</b> "<b>{eventName}</b>" Event'}
              values={{ who, eventName }}
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
              values={{ who, resultName, eventName }}
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
              values={{ who, resultName, eventName }}
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
              values={{ who, resultName, eventName }}
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
              values={{ who, amount: toFixed(amount, true), eventName }}
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
    const { transaction, intl, classes, store: { naka: { account } } } = this.props;
    const { txStatus, block, amount } = transaction;
    const blockTime = block ? getTimeString(block.blockTime) : intl.formatMessage(messages.strPendingMsg);
    const status = getStatusString(txStatus, intl);

    return (
      <Grid container className={classes.grid} justify="center">
        <Grid item xs={12} sm={10}>
          <Card
            className={classes.card}
          >
            <CardContent classes={{ root: classes.cardContent }}>
              <Typography color='textPrimary'>
                {this.renderCardString(transaction, intl, account)}
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
