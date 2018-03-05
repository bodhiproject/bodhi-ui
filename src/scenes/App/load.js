import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Row, Col, Progress } from 'antd';

import appActions from '../../redux/App/actions';
import AppConfig from '../../config/app';
import getSubscription, { channels } from '../../network/graphSubscription';

const MIN_BLOCK_COUNT_GAP = 1;

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
    } else {
      toggleInitialSync(true);
    }
  }

  render() {
    const { percent } = this.state;

    const style = {};
    if (percent === 100 || !AppConfig.debug.showAppLoad) {
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
                <p>Blockchain syncing. Please wait.</p>
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
  toggleInitialSync: PropTypes.func,
};

AppLoad.defaultProps = {
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

export default connect(mapStateToProps, mapDispatchToProps)(AppLoad);
