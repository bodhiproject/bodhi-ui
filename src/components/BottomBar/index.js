/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import moment from 'moment';
import { inject, observer } from 'mobx-react';
import { Box, Paper, Typography, withStyles } from '@material-ui/core';
import { CheckCircle, RemoveCircle } from '@material-ui/icons';
import { FormattedMessage, injectIntl } from 'react-intl';
import cx from 'classnames';
import PropTypes from 'prop-types';
import styles from './styles';

@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class BottomBar extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  render() {
    const {
      classes,
      store: {
        global: { syncBlockTime, syncBlockNum, online },
        naka: { loggedIn },
      },
    } = this.props;

    return (
      <Paper className={classes.paper}>
        <Box display="flex" justifyContent="flex-start">
          <NetworkConnection online={online} loggedIn={loggedIn} />
        </Box>
        <Box display="flex" justifyContent="flex-end">
          <BlockInfo blockNum={syncBlockNum} blockTime={syncBlockTime} />
        </Box>
      </Paper>
    );
  }
}

const NetworkConnection = withStyles(styles)(({ classes, online, loggedIn }) => (
  <div>
    <div className={classes.statusContainer}>
      {online
        ? <CheckCircle className={cx(classes.statusIcon, 'online')} />
        : <RemoveCircle className={cx(classes.statusIcon, 'offline')} />
      }
      <Typography variant="body2" className={cx(classes.bottomBarTxt, 'network')}>
        <FormattedMessage id="bottomBar.network" defaultMessage="Network" />
      </Typography>
    </div>
    <div className={classes.statusContainer}>
      {loggedIn
        ? <CheckCircle className={cx(classes.statusIcon, 'online')} />
        : <RemoveCircle className={cx(classes.statusIcon, 'offline')} />
      }
      <Typography variant="body2" className={classes.bottomBarTxt}>
        <FormattedMessage id="bottomBar.wallet" defaultMessage="Wallet" />
      </Typography>
    </div>
  </div>
));

const BlockInfo = withStyles(styles)(({ classes, blockNum, blockTime }) => (
  <div>
    <div className={classes.blockItemContainer}>
      <Typography variant="body2" className={cx(classes.bottomBarTxt, 'blockNum')}>
        <span>
          <FormattedMessage
            id="bottomBar.blockNum"
            defaultMessage="Current Block Number"
          />
          {`: ${blockNum}`}
        </span>
      </Typography>
    </div>
    <div className={classes.blockItemContainer}>
      <Typography variant="body2" className={classes.bottomBarTxt}>
        <span>
          <FormattedMessage
            id="bottomBar.blockTime"
            defaultMessage="Current Block Time"
          />
          {blockTime ? `: ${moment.unix(blockTime).format('LLL')}` : ''}
        </span>
      </Typography>
    </div>
  </div>
));
