import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Card } from 'antd';
import { getShortLocalDateTimeString } from '../../helpers/utility';

class CornerClock extends React.PureComponent {
  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
  }

  render() {
    const { syncInfo } = this.props;

    const blockNum = syncInfo && syncInfo.syncBlockNum ? syncInfo.syncBlockNum : '';
    const blockTime = syncInfo && syncInfo.syncBlockTime ? getShortLocalDateTimeString(syncInfo.syncBlockTime) : '';

    return (
      <Card className="corner-block-wrapper">
        <h2>{blockNum}</h2>
        <p>Current Block</p>
        <p>{blockTime}</p>
      </Card>
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
