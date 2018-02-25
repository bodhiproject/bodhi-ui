import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Row, Col, Progress } from 'antd';

import appActions from '../../redux/app/actions';
import AppConfig from '../../config/app';
import getSubscription, { channels } from '../../network/graphSubscription';

const MIN_BLOCK_COUNT_GAP = 3;

class AppLoad extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      percent: 0,
    };
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
    } else {
      this.props.toggleSyncing(true);
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
              <Col xs={14} style={{ fontSize: '20px', paddingTop: '24px', paddingRight: '24px' }}>
                <p>QTUM blockchain is syncing. <br />Please wait patiently.</p>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

AppLoad.propTypes = {
  chainBlockNum: PropTypes.number,
  syncBlockNum: PropTypes.number,
  updateSyncProgress: PropTypes.func,
  toggleSyncing: PropTypes.func,
};

AppLoad.defaultProps = {
  chainBlockNum: undefined,
  syncBlockNum: undefined,
  updateSyncProgress: undefined,
  toggleSyncing: undefined,
};

const mapStateToProps = (state) => ({
  chainBlockNum: state.App.get('chainBlockNum'),
  syncBlockNum: state.App.get('syncBlockNum'),
});

const mapDispatchToProps = (dispatch) => ({
  updateSyncProgress: (percentage) => dispatch(appActions.updateSyncProgress(percentage)),
  toggleSyncing: (isSyncing) => dispatch(appActions.toggleSyncing(isSyncing)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppLoad);
