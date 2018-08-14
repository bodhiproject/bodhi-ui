import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles, Snackbar, Typography, Grid } from '@material-ui/core';
import cx from 'classnames';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

import styles from './styles';


@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class PendingTxsSnackbar extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
  };

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
      'str.createEvent': pendingCreateEvents,
      'str.bet': pendingBets,
      'str.setResult': pendingSetResults,
      'str.vote': pendingVotes,
      'str.finalizeResult': pendingFinalizeResults,
      'str.withdraw': pendingWithdraws,
      'str.transferTokens': pendingTransfers,
      'tx.resetApproval': pendingResetApproves,
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
                <FormattedMessage
                  id="pendingTxsSnackbar.youHaveXPendingTransactions"
                  defaultMessage="You have {numOfTxs} pending transaction(s)."
                  values={{ numOfTxs: count }}
                />
              </Typography>
              {Object.entries(pendingCounts).map(([id, amounts]) => amounts.length > 0 && (
                <Typography variant="caption" key={id}>{`${intl.formatMessage({ id })}: ${amounts.length}`}</Typography>
              ))}
              <Typography variant="caption" className={classes.balanceExplanation}>
                <FormattedMessage
                  id="pendingTxsSnackbar.balanceExplanation"
                  defaultMessage="Pending transactions will affect your wallet balances."
                />
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
