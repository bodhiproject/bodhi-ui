import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import CheckCircleIcon from 'material-ui-icons/CheckCircle';
import RemoveCircleIcon from 'material-ui-icons/RemoveCircle';
import Typography from 'material-ui/Typography';
import { FormattedMessage, injectIntl } from 'react-intl';
import { withStyles } from 'material-ui/styles';
import cx from 'classnames';

import styles from './styles';
import { getShortLocalDateTimeString } from '../../helpers/utility';

class BottomBar extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleNetworkChange = this.handleNetworkChange.bind(this);
    this.renderBlockInfo = this.renderBlockInfo.bind(this);
    this.renderNetworkConnection = this.renderNetworkConnection.bind(this);
  }

  componentDidMount() {
    // Subscribe to changes
    window.addEventListener('offline', () => this.handleNetworkChange());
    window.addEventListener('online', () => this.handleNetworkChange());
  }

  componentWillUnmount() {
    // Clean up listener
    window.removeEventListener('offline', () => this.handleNetworkChange());
    window.removeEventListener('online', () => this.handleNetworkChange());
  }

  handleNetworkChange() {
    this.renderNetworkConnection();
  }

  render() {
    const { classes, syncBlockTime } = this.props;
    return (
      <Paper className={classes.bottomBarWrapper}>
        <Grid container>
          {this.renderNetworkConnection()}
          {(syncBlockTime && syncBlockTime) && this.renderBlockInfo()}
        </Grid>
      </Paper>
    );
  }

  renderBlockInfo() {
    const { classes, syncBlockNum, syncBlockTime } = this.props;

    const blockNum = syncBlockNum;
    const blockTime = syncBlockTime ? getShortLocalDateTimeString(syncBlockTime) : '';

    return (
      <Grid item xs={12} md={6} className={classes.bottomBarBlockInfoWrapper}>
        <Typography variant="body1">
          <span className={classes.bottomBarBlockNum}><FormattedMessage id="bottomBar.blockNum" defaultMessage="Current Block Number" />: {blockNum}</span>
          <FormattedMessage id="bottomBar.blockTime" defaultMessage="Current Block Time" />: {blockTime}
        </Typography>
      </Grid>
    );
  }

  renderNetworkConnection() {
    const { classes } = this.props;

    if (navigator.onLine) {
      return (
        <Grid item xs={12} md={6} className={classes.bottomBarNetworkWrapper}>
          <Typography variant="body1">
            <CheckCircleIcon fontSize className={cx(classes.bottomBarNetworkIcon, 'online')} />
            <span><FormattedMessage id="bottomBar.online" defaultMessage="Online" /></span>
          </Typography>
        </Grid>
      );
    }

    return (
      <Grid item xs={12} md={6} className={classes.bottomBarNetworkWrapper}>
        <Typography variant="body1">
          <RemoveCircleIcon fontSize className={cx(classes.bottomBarNetworkIcon, 'offline')} />
          <span><FormattedMessage id="bottomBar.offline" defaultMessage="Offline" /></span>
        </Typography>
      </Grid>
    );
  }
}

BottomBar.propTypes = {
  classes: PropTypes.object.isRequired,
  syncBlockNum: PropTypes.number,
  syncBlockTime: PropTypes.number,
};

BottomBar.defaultProps = {
  syncBlockNum: undefined,
  syncBlockTime: undefined,
};

const mapStateToProps = (state) => ({
  ...state.App.toJS(),
  syncBlockNum: state.App.get('syncBlockNum'),
  syncBlockTime: state.App.get('syncBlockTime'),
});

export default injectIntl(connect(mapStateToProps)(withStyles(styles, { withTheme: true })(BottomBar)));
