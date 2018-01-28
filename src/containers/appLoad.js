import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Row, Col, Progress } from 'antd';

import appActions from '../redux/app/actions';

const POOL_INTERVAL = 10000;
const MIN_BLOCK_COUNT_GAP = 3;

class AppLoad extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      percent: 0,
    };
  }

  componentWillMount() {
    const { getSyncInfo } = this.props;

    (function startPoll() {
      getSyncInfo();
      setTimeout(startPoll, POOL_INTERVAL);
    }());
  }

  componentWillReceiveProps(nextProps) {
    const { syncInfo, blockCount } = nextProps;

    // Only update if both syncBlockNum or chainBlockNum are defined as number
    if (syncInfo && _.isNumber(syncInfo.chainBlockNum)) {
      const syncBlockNum = syncInfo.syncBlockNum || blockCount;
      let newPercent = _.round((syncBlockNum / syncInfo.chainBlockNum) * 100);

      // Make new percent 100 if block gap is less than MIN_BLOCK_COUNT_GAP
      if ((syncInfo.chainBlockNum - syncBlockNum <= MIN_BLOCK_COUNT_GAP) || newPercent > 100) {
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

    // TODO: uncomment when testnet API works
    // return (
    //   <div className="app-load" style={style}>
    //     <div className="app-load-wrapper">
    //       <div className="app-load-container">
    //         <Row>
    //           <Col xs={10} style={{ textAlign: 'center' }}>
    //             <Progress type="circle" percent={percent} width={180} />
    //           </Col>
    //           <Col xs={14} style={{ fontSize: '28px', paddingTop: '24px', paddingRight: '24px' }}>
    //             <p>QTUM blockchain is syncing. <br />Please wait patiently.</p>
    //           </Col>
    //         </Row>
    //       </div>
    //     </div>
    //   </div>
    // );
    return null;
  }
}

AppLoad.propTypes = {
  syncInfo: PropTypes.object,
  getSyncInfo: PropTypes.func,
  updateSyncProgress: PropTypes.func,
  toggleSyncing: PropTypes.func,
  blockCount: PropTypes.number,
};

AppLoad.defaultProps = {
  syncInfo: undefined,
  getSyncInfo: undefined,
  updateSyncProgress: undefined,
  toggleSyncing: undefined,
  blockCount: 0,
};

const mapStateToProps = (state) => ({
  syncInfo: state.App.get('sync_info_return') && state.App.get('sync_info_return').result,
  blockCount: state.App.get('get_block_count_return') && state.App.get('get_block_count_return').result,
});

const mapDispatchToProps = (dispatch) => ({
  getSyncInfo: () => dispatch(appActions.getSyncInfo()),
  updateSyncProgress: (percentage) => dispatch(appActions.updateSyncProgress(percentage)),
  toggleSyncing: (isSyncing) => dispatch(appActions.toggleSyncing(isSyncing)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppLoad);
