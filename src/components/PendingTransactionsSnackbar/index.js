import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  withStyles,
  Snackbar,
  Typography,
  Grid,
} from '@material-ui/core';
import cx from 'classnames';
import { injectIntl, intlShape, defineMessages } from 'react-intl';

import styles from './styles';
import appActions from '../../redux/App/actions';
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
@connect((state) => ({
  pendingTxsSnackbarVisible: state.App.get('pendingTxsSnackbarVisible'),
  getPendingTransactionsReturn: state.Graphql.get('getPendingTransactionsReturn'),
}), (dispatch) => ({
  togglePendingTxsSnackbar: (isVisible) => dispatch(appActions.togglePendingTxsSnackbar(isVisible)),
}))
export default class PendingTransactionsSnackbar extends Component {
  static propTypes = {
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    classes: PropTypes.object.isRequired,
    getPendingTransactionsReturn: PropTypes.object.isRequired,
    pendingTxsSnackbarVisible: PropTypes.bool.isRequired,
    togglePendingTxsSnackbar: PropTypes.func.isRequired,
  };

  render() {
    const {
      classes,
      getPendingTransactionsReturn,
      pendingTxsSnackbarVisible,
      intl,
    } = this.props;
    const pendingTxs = getPendingTransactionsReturn;

    if (pendingTxs.count === 0) {
      return null;
    }

    return (
      <Snackbar
        className={classes.snackbar}
        open={pendingTxs.count > 0 && pendingTxsSnackbarVisible}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        message={
          <Grid container>
            <Grid item xs={11}>
              <Typography variant="caption" className={classes.totalCountText}>
                {`${intl.formatMessage(messages.youHave)} ${pendingTxs.count} ${intl.formatMessage(messages.pendingTransactions)}`}
              </Typography>
              {
                Object.keys(pendingTxs).map((key) => {
                  if (key !== 'count') {
                    const amount = pendingTxs[key].length;
                    if (amount > 0) {
                      return <Typography variant="caption" key={key}>{`${this.getEventName(key)}: ${amount}`}</Typography>;
                    }
                    return null;
                  }
                  return null;
                })
              }
              <Typography variant="caption" className={classes.balanceExplanation}>
                {`* ${intl.formatMessage(messages.balanceExplanation)}`}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <i className={cx(classes.closeIcon, 'icon iconfont icon-ic_close')} onClick={this.onCloseClicked} />
            </Grid>
          </Grid>
        }
      />
    );
  }

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
  };

  onCloseClicked = () => {
    this.props.togglePendingTxsSnackbar(false);
  };
}
