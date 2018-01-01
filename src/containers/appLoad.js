import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Row, Col, Progress } from 'antd';

import appActions from '../redux/app/actions';

const POOL_INTERVAL = 3000;
const MIN_BLOCK_COUNT_GAP = 3;

class AppLoad extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      percent: 100,
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
    const { syncInfo } = nextProps;

    console.log(syncInfo);

    // this.setState({

    // });
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
                <p>The application is syncing from blockchain. <br />Please wait patiently.</p>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

AppLoad.propTypes = {
  syncInfo: PropTypes.object,
  getSyncInfo: PropTypes.func,
};

AppLoad.defaultProps = {
  syncInfo: undefined,
  getSyncInfo: undefined,
};

const mapStateToProps = (state) => ({
  syncInfo: state.App.get('sync_info_return') && state.App.get('sync_info_return').result,
});

const mapDispatchToProps = (dispatch) => ({
  getSyncInfo: () => dispatch(appActions.getSyncInfo()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppLoad);
