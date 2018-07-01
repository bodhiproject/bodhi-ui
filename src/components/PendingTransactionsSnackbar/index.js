import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles, Snackbar, Typography, Grid } from '@material-ui/core';
import cx from 'classnames';
import { injectIntl, intlShape, defineMessages } from 'react-intl';

import styles from './styles';
import { TransactionType } from '../../constants';


const messages = defineMessages({
  youHave: {
    id: 'pendingTxsSnackbar.youHave',
    defaultMessage: 'You have',
  },
  pendingTransactions: {
    id: 'pendingTxsSnackbar.pendingTransactions',
    defaultMessage: 'pending transactions.',
  },
  createEvent: {
    id: 'str.createEvent',
    defaultMessage: 'Create Event',
  },
  bet: {
    id: 'str.bet',
    defaultMessage: 'Bet',
  },
  setResult: {
    id: 'str.setResult',
    defaultMessage: 'Set Result',
  },
  vote: {
    id: 'str.vote',
    defaultMessage: 'Vote',
  },
  finalizeResult: {
    id: 'str.finalizeResult',
    defaultMessage: 'Finalize Result',
  },
  withdraw: {
    id: 'str.withdraw',
    defaultMessage: 'Withdraw',
  },
  transferTokens: {
    id: 'str.transferTokens',
    defaultMessage: 'Transfer Tokens',
  },
  resetApproval: {
    id: 'tx.resetApproval',
    defaultMessage: 'Reset Approval',
  },
  balanceExplanation: {
    id: 'pendingTxsSnackbar.balanceExplanation',
    defaultMessage: 'Pending transactions will affect your wallet balances.',
  },
});

@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class PendingTransactionsSnackbar extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
  };

  getEventName = (key) => {
    const { intl } = this.props;

    switch (key) {
      case TransactionType.CreateEvent: {
        return intl.formatMessage(messages.createEvent);
      }
      case TransactionType.Bet: {
        return intl.formatMessage(messages.bet);
      }
      case TransactionType.SetResult: {
        return intl.formatMessage(messages.setResult);
      }
      case TransactionType.Vote: {
        return intl.formatMessage(messages.vote);
      }
      case TransactionType.FinalizeResult: {
        return intl.formatMessage(messages.finalizeResult);
      }
      case TransactionType.Withdraw: {
        return intl.formatMessage(messages.withdraw);
      }
      case TransactionType.Transfer: {
        return intl.formatMessage(messages.transferTokens);
      }
      case TransactionType.ResetApprove: {
        return intl.formatMessage(messages.resetApproval);
      }
      default: {
        return undefined;
      }
    }
  }

  componentDidMount() {
    this.props.store.pendingTxsSnackbar.init();
  }

  render() {
    const {
      isVisible,
      count,
      pendingCreateEvents,
      pendingBets,
      pendingSetResults,
      pendingVotes,
      pendingFinalizeResults,
      pendingWithdraws,
      pendingTransfers,
      pendingResetApproves,
    } = this.props.store.pendingTxsSnackbar;
    const { classes, intl } = this.props;

    const pendingCounts = {
      [TransactionType.CreateEvent]: pendingCreateEvents,
      [TransactionType.Bet]: pendingBets,
      [TransactionType.SetResult]: pendingSetResults,
      [TransactionType.Vote]: pendingVotes,
      [TransactionType.FinalizeResult]: pendingFinalizeResults,
      [TransactionType.Withdraw]: pendingWithdraws,
      [TransactionType.Transfer]: pendingTransfers,
      [TransactionType.ResetApprove]: pendingResetApproves,
    };

    if (count === 0) {
      return null;
    }

    return (
      <Snackbar
        className={classes.snackbar}
        open={isVisible}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        message={
          <Grid container>
            <Grid item xs={11}>
              <Typography variant="caption" className={classes.totalCountText}>
                {`${intl.formatMessage(messages.youHave)} ${count} ${intl.formatMessage(messages.pendingTransactions)}`}
              </Typography>
              {
                Object.keys(pendingCounts).map((key) => {
                  const amount = pendingCounts[key].length;
                  if (amount > 0) {
                    return <Typography variant="caption" key={key}>{`${this.getEventName(key)}: ${amount}`}</Typography>;
                  }
                  return null;
                })
              }
              <Typography variant="caption" className={classes.balanceExplanation}>
                {`* ${intl.formatMessage(messages.balanceExplanation)}`}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <i
                className={cx(classes.closeIcon, 'icon iconfont icon-ic_close')}
                onClick={() => this.props.store.pendingTxsSnackbar.isVisible = false}
              />
            </Grid>
          </Grid>
        }
      />
    );
  }
}
