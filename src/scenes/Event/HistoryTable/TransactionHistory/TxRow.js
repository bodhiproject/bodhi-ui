import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { injectIntl, intlShape, defineMessages } from 'react-intl';
import { withStyles, Grid, CardContent, Card, Typography } from '@material-ui/core';
import { Token, TransactionType } from 'constants';

import styles from './styles';
import { satoshiToDecimal, getTimeString } from '../../../../helpers/utility';
import { EXPLORER } from '../../../../network/routes';

const messages = defineMessages({
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
  createEvent: {
    id: 'action.createEvent',
    defaultMessage: 'Create',
  },
  bet: {
    id: 'action.bet',
    defaultMessage: 'Bet',
  },
  setResult: {
    id: 'action.setResult',
    defaultMessage: 'Set',
  },
  vote: {
    id: 'action.vote',
    defaultMessage: 'Vote',
  },
  withdraw: {
    id: 'action.withdraw',
    defaultMessage: 'Withdraw',
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

  getActionString = (transaction, intl) => {
    const { txType } = transaction;
    switch (txType) {
      case TransactionType.CREATE_EVENT: {
        return intl.formatMessage(messages.createEvent);
      }
      case TransactionType.BET: {
        return intl.formatMessage(messages.bet);
      }
      case TransactionType.RESULT_SET: {
        return intl.formatMessage(messages.setResult);
      }
      case TransactionType.VOTE: {
        return intl.formatMessage(messages.vote);
      }
      case TransactionType.WITHDRAW: {
        return intl.formatMessage(messages.withdraw);
      }
      default: {
        console.error(`Invalid txType: ${txType}`); // eslint-disable-line
        return '';
      }
    }
  }

  renderCardString = (transaction, intl, classes) => {
    const action = this.getActionString(transaction, intl);
    const { txType, amount } = transaction;
    let { eventName, resultName } = transaction;
    if (eventName && eventName.length > 20) eventName = `${eventName.slice(0, 6)}...${eventName.slice(-6)}`;
    if (resultName && resultName.length > 20) resultName = `${resultName.slice(0, 6)}...${resultName.slice(-6)}`;

    switch (txType) {
      case TransactionType.CREATE_EVENT: {
        return (
          <Fragment>
            <span className={classes.bold}>{` ${action} `}</span>
            {' "'}
            <span className={classes.bold}>{eventName}</span>
            {'" Event'}
          </Fragment>
        );
      }
      case TransactionType.BET: {
        return (
          <Fragment>
            <span className={classes.bold}>{` ${action} `}</span>
            {' on "'}
            <span className={classes.bold}>{resultName}</span>
            {'" in "'}
            <span className={classes.bold}>{eventName}</span>
            {'" Event'}
          </Fragment>
        );
      }
      case TransactionType.RESULT_SET: {
        return (
          <Fragment>
            <span className={classes.bold}>{` ${action} `}</span>
            {' "'}
            <span className={classes.bold}>{resultName}</span>
            {'" as result in "'}
            <span className={classes.bold}>{eventName}</span>
            {'" Event'}
          </Fragment>
        );
      }
      case TransactionType.VOTE: {
        return (
          <Fragment>
            <span className={classes.bold}>{` ${action} `}</span>
            {' on "'}
            <span className={classes.bold}>{resultName}</span>
            {'" in "'}
            <span className={classes.bold}>{eventName}</span>
            {'" Event'}
          </Fragment>
        );
      }
      case TransactionType.WITHDRAW: {
        return (
          <Fragment>
            <span className={classes.bold}>{` ${action} `}</span>
            {`${amount} ${Token.NBOT} from "`}
            <span className={classes.bold}>{eventName}</span>
            {'" Event'}
          </Fragment>
        );
      }
      default: {
        console.error(`Invalid txType: ${txType}`); // eslint-disable-line
        return (
          <Fragment>
            {`Invalid txType: ${txType}`}
          </Fragment>
        );
      }
    }
  }

  render() {
    const { transaction, intl, classes, store: { naka } } = this.props;
    const { txStatus, block, amount, txSender } = transaction;
    const blockTime = block ? getTimeString(block.blockTime) : intl.formatMessage(messages.strPendingMsg);

    return (
      <Grid container className={classes.grid} justify="center">
        <Grid item xs={10} sm={10}>
          <Card
            className={classes.card}
          >
            <CardContent>
              <Typography color='textPrimary'>
                {(naka.account && naka.account.toLowerCase() === txSender && 'You') || `${txSender.slice(0, 6)}...${txSender.slice(-6)}`}
                {this.renderCardString(transaction, intl, classes)}
              </Typography>
            </CardContent>
          </Card>
          <div className={classes.note}>
            <Typography color='textPrimary'>
              {`${amount} ${Token.NBOT} · ${txStatus} · ${blockTime} · `}
              <a href={`${EXPLORER.TX}/${transaction.txid}`} target="_blank" className={classes.link}>
                {'Detail'}
              </a>
            </Typography>
          </div>
        </Grid>
      </Grid>
    );
  }
}
