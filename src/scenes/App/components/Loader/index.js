import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Row, Col, Progress } from 'antd';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';

import appActions from '../../../../redux/App/actions';
import AppConfig from '../../../../config/app';
import getSubscription, { channels } from '../../../../network/graphSubscription';
import styles from './styles';

const MIN_BLOCK_COUNT_GAP = 1;

class Loader extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      percent: 0,
      hideLoader: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      chainBlockNum,
      syncBlockNum,
    } = nextProps;
    const { toggleInitialSync } = this.props;

    if (_.isNumber(syncBlockNum) && _.isNumber(chainBlockNum)) {
      let newPercent = _.round((syncBlockNum / chainBlockNum) * 100);

      // Make new percent 100 if block gap is less than MIN_BLOCK_COUNT_GAP
      if ((chainBlockNum - syncBlockNum <= MIN_BLOCK_COUNT_GAP) || newPercent > 100) {
        newPercent = 100;
      }

      // Don't go backwards in number
      if (newPercent >= this.state.percent) {
        this.setState({
          percent: newPercent,
        });
      }

      // Update initial sync flag
      const isSyncing = newPercent < 100;
      toggleInitialSync(isSyncing);

      if (newPercent === 100) {
        const self = this;
        setTimeout(() => {
          self.setState({ hideLoader: true });
        }, 1000);
      }
    } else {
      toggleInitialSync(true);
    }
  }

  render() {
    const { percent } = this.state;
    const { classes } = this.props;

    return (
      <div
        className={classes.loaderBg}
        style={
          {
            opacity: percent === 100 ? 0 : 1,
            display: !AppConfig.debug.showAppLoad || this.state.hideLoader ? 'none' : 'block',
          }
        }
      >
        <div className={classes.loaderWrapper}>
          <div className={classes.loaderLogoWrapper}>
            <img className={classes.loaderGif} src="/images/loader.gif" alt="Loading..." />
          </div>
          <div className={classes.loaderInfoWrapper}>
            <Typography variant="display1" className={classes.loaderPercent}>{percent}</Typography>%
            <p>Blockchain syncing.</p>
            <p>Please wait.</p>
          </div>
        </div>
      </div>
    );
  }
}

Loader.propTypes = {
  classes: PropTypes.object.isRequired,
  chainBlockNum: PropTypes.number,
  syncBlockNum: PropTypes.number,
  toggleInitialSync: PropTypes.func,
};

Loader.defaultProps = {
  chainBlockNum: undefined,
  syncBlockNum: undefined,
  toggleInitialSync: undefined,
};

const mapStateToProps = (state) => ({
  chainBlockNum: state.App.get('chainBlockNum'),
  syncBlockNum: state.App.get('syncBlockNum'),
});

const mapDispatchToProps = (dispatch) => ({
  toggleInitialSync: (isSyncing) => dispatch(appActions.toggleInitialSync(isSyncing)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Loader));
