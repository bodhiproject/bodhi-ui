/* eslint-disable react/no-unused-state */
import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { inject, observer } from 'mobx-react';
import { Paper, Grid, Typography, withStyles, withWidth } from '@material-ui/core';
import { CheckCircle, RemoveCircle } from '@material-ui/icons';
import { FormattedMessage, injectIntl } from 'react-intl';
import cx from 'classnames';
import PropTypes from 'prop-types';
import styles from './styles';

@injectIntl
@withStyles(styles, { withTheme: true })
@withWidth()
@inject('store')
@observer
export default class BottomBar extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  render() {
    const {
      classes,
      width,
      store: {
        global: { syncBlockTime, syncBlockNum, online },
        naka: { loggedIn },
      },
    } = this.props;

    return (
      <Paper className={classes.paper}>
        <NetworkConnection width={width} online={online} loggedIn={loggedIn} />
        {syncBlockTime &&
          <BlockInfo
            width={width}
            blockNum={syncBlockNum}
            blockTime={syncBlockTime}
          />
        }
      </Paper>
    );
  }
}

const NetworkConnection = withStyles(styles)(({ classes, width, online, loggedIn }) => (
  <Grid container item xs={12} md={6}>
    {width !== 'xs' && (
      <Fragment>
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
      </Fragment>
    )}
    {width === 'xs' && (
      <Fragment>
        <Grid item xs={12} className={classes.statusContainer}>
          {online
            ? <CheckCircle className={cx(classes.statusIcon, 'online')} />
            : <RemoveCircle className={cx(classes.statusIcon, 'offline')} />
          }
          <Typography variant="body2" className={classes.bottomBarTxt}>
            <FormattedMessage id="bottomBar.network" defaultMessage="Network" />
          </Typography>
        </Grid>
        <Grid item xs={12} className={classes.statusContainer}>
          {loggedIn
            ? <CheckCircle className={cx(classes.statusIcon, 'online')} />
            : <RemoveCircle className={cx(classes.statusIcon, 'offline')} />
          }
          <Typography variant="body2" className={classes.bottomBarTxt}>
            <FormattedMessage id="bottomBar.wallet" defaultMessage="Wallet" />
          </Typography>
        </Grid>
      </Fragment>
    )}
  </Grid>
));

const BlockInfo = withStyles(styles)(({ classes, width, blockNum, blockTime }) => (
  <Grid container item xs={12} md={6} className={classes.blockInfoContainer}>
    {width !== 'xs' && (
      <Fragment>
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
      </Fragment>
    )}
    {width === 'xs' && (
      <Fragment>
        <Grid item xs={12} className={classes.blockItemContainer}>
          <Typography variant="body2" className={classes.bottomBarTxt}>
            <span>
              <FormattedMessage
                id="bottomBar.blockNum"
                defaultMessage="Current Block Number"
              />
              {`: ${blockNum}`}
            </span>
          </Typography>
        </Grid>
        <Grid item xs={12} className={classes.blockItemContainer}>
          <Typography variant="body2" className={classes.bottomBarTxt}>
            <span>
              <FormattedMessage
                id="bottomBar.blockTime"
                defaultMessage="Current Block Time"
              />
              {blockTime ? `: ${moment.unix(blockTime).format('LLL')}` : ''}
            </span>
          </Typography>
        </Grid>
      </Fragment>
    )}
  </Grid>
));
