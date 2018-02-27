import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Card, Icon } from 'antd';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { getShortLocalDateTimeString } from '../../helpers/utility';

class BottomBar extends React.PureComponent {
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
    const { syncBlockNum, syncBlockTime } = this.props;

    const blockNum = syncBlockNum;
    const blockTime = syncBlockTime ? getShortLocalDateTimeString(syncBlockTime) : '';

    return (
      <Card className="corner-block-wrapper">
        {this.renderNetworkConnection()}
        <h2>{blockNum}</h2>
        <p><FormattedMessage id="cornerclock.block" /></p>
        <p>{blockTime}</p>
      </Card>
    );
  }

  renderNetworkConnection() {
    if (navigator.onLine) {
      return (
        <p>
          <span><FormattedMessage id="cornerclock.online" /></span>
          <Icon className="corner-network-icon online" type="check-circle" />
        </p>
      );
    }

    return (
      <p>
        <span><FormattedMessage id="cornerclock.offline" /></span>
        <Icon className="corner-network-icon offline" type="close-circle" />
      </p>
    );
  }
}

BottomBar.propTypes = {
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

export default injectIntl(connect(mapStateToProps)(BottomBar));
