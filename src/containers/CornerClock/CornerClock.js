import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Card, Icon } from 'antd';
import { getShortLocalDateTimeString } from '../../helpers/utility';

class CornerClock extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleNetworkChange = this.handleNetworkChange.bind(this);
    this.renderNetworkConnection = this.renderNetworkConnection.bind(this);
  }

  componentDidMount() {
    // Subscribe to changes
    window.addEventListener('offline', (e) => this.handleNetworkChange());
    window.addEventListener('online', (e) => this.handleNetworkChange());
  }

  componentWillUnmount() {
    // Clean up listener
    window.removeEventListener('offline', (e) => this.handleNetworkChange());
    window.removeEventListener('online', (e) => this.handleNetworkChange());
  }

  handleNetworkChange() {
    this.renderNetworkConnection();
  }

  render() {
    const { syncInfo } = this.props;

    const blockNum = syncInfo && syncInfo.syncBlockNum ? syncInfo.syncBlockNum : '';
    const blockTime = syncInfo && syncInfo.syncBlockTime ? getShortLocalDateTimeString(syncInfo.syncBlockTime) : '';

    return (
      <Card className="corner-block-wrapper">
        {this.renderNetworkConnection()}
        <h2>{blockNum}</h2>
        <p>Current Block</p>
        <p>{blockTime}</p>
      </Card>
    );
  }

  renderNetworkConnection() {
    if (navigator.onLine) {
      return (
        <p>
          <span>Online</span>
          <Icon className="corner-network-icon online" type="check-circle" />
        </p>
      );
    }

    return (
      <p>
        <span>Offline</span>
        <Icon className="corner-network-icon offline" type="close-circle" />
      </p>
    );
  }
}

CornerClock.propTypes = {
  syncInfo: PropTypes.object,
};

CornerClock.defaultProps = {
  syncInfo: undefined,
};

const mapStateToProps = (state) => ({
  ...state.App.toJS(),
  syncInfo: state.App.get('syncInfo') && state.App.get('syncInfo').result,
});

export default connect(mapStateToProps)(CornerClock);
