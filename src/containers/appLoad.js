import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose, withApollo } from 'react-apollo';
import _ from 'lodash';
import { Row, Col, Progress } from 'antd';

import appActions from '../redux/app/actions';
import AppConfig from '../config/app';
import graphSubscriptions from '../network/graphSubscription';

const MIN_BLOCK_COUNT_GAP = 3;

class AppLoad extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      percent: 0,
    };

    this.subscribeSyncInfo = this.subscribeSyncInfo.bind(this);
  }

  componentWillMount() {
    const { getSyncInfo } = this.props;

    getSyncInfo();
    this.subscribeSyncInfo();
  }

  componentWillReceiveProps(nextProps) {
    const {
      chainBlockNum,
      syncBlockNum,
    } = nextProps;

    // Only update if both syncBlockNum or chainBlockNum are defined as number
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

      if (newPercent < 100) {
        this.props.toggleSyncing(true);
      }

      this.props.updateSyncProgress(newPercent);
    }
  }

  render() {
    const { percent } = this.state;

    const style = {};
    if (percent === 100) {
      style.display = 'none';
    }

    return (
      <div className="app-load" style={style}>
        <div className="app-load-wrapper">
          <div className="app-load-container">
            <Row>
              <Col xs={10} style={{ textAlign: 'center' }}>
                <Progress type="circle" percent={percent} width={180} />
              </Col>
              <Col xs={14} style={{ fontSize: '28px', paddingTop: '24px', paddingRight: '24px' }}>
                <p>QTUM blockchain is syncing. <br />Please wait patiently.</p>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }

  subscribeSyncInfo() {
    const { client } = this.props;
    const { syncBlockNum } = this.state;

    console.log('Subscribe: syncInfo');
    const observable = client.subscribe({
      query: graphSubscriptions.ON_SYNC_INFO,
    }).subscribe({
      next(data) {
        console.log('syncBlockNum', state.syncBlockNum);
        console.log('sub syncBlockNum', data.data.OnSyncInfo.syncBlockNum);
        if (data.data.OnSyncInfo.syncBlockNum !== syncBlockNum) {
          // TODO: call action to set syncInfo data
          console.log('subscribed', data.data.OnSyncInfo);
        }
      },
      error(err) {
        console.error('err', err);
      },
    });
  }
}

AppLoad.propTypes = {
  client: PropTypes.object,
  chainBlockNum: PropTypes.number,
  syncBlockNum: PropTypes.number,
  getSyncInfo: PropTypes.func,
  updateSyncProgress: PropTypes.func,
  toggleSyncing: PropTypes.func,
};

AppLoad.defaultProps = {
  client: undefined,
  chainBlockNum: undefined,
  syncBlockNum: undefined,
  getSyncInfo: undefined,
  updateSyncProgress: undefined,
  toggleSyncing: undefined,
};

const mapStateToProps = (state) => ({
  chainBlockNum: state.App.get('chainBlockNum'),
  syncBlockNum: state.App.get('syncBlockNum'),
});

const mapDispatchToProps = (dispatch) => ({
  getSyncInfo: () => dispatch(appActions.getSyncInfo()),
  updateSyncProgress: (percentage) => dispatch(appActions.updateSyncProgress(percentage)),
  toggleSyncing: (isSyncing) => dispatch(appActions.toggleSyncing(isSyncing)),
});

export default compose(
  withApollo,
  connect(mapStateToProps, mapDispatchToProps),
)(AppLoad);
