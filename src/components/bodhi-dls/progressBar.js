import React, { Component, PropTypes } from 'react';
import Progress from '../uielements/progress';

class ProgressBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const {
      label, value, percent, barHeight, status, info, marginBottom,
    } = this.props;

    const titleStyle = {
      fontSize: '16px',
      fontWeight: 400,
    };

    return (
      <div style={{ marginBottom: `${marginBottom}px` }}>
        <h3 style={titleStyle}>{label}</h3>
        <Progress
          percent={percent}
          strokeWidth={barHeight}
          status={status}
          showInfo={info}
        />
        <p style={{ fontSize: '14px', fontWeight: 400 }}>{value}</p>
      </div>
    );
  }
}

ProgressBar.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  percent: PropTypes.number,
  barHeight: PropTypes.number,
  status: PropTypes.string,
  info: PropTypes.bool,
  marginBottom: PropTypes.number,
};

ProgressBar.defaultProps = {
  label: 'Single Progress Label',
  value: '',
  percent: 0,
  barHeight: 12,
  info: false,
  status: 'active',
  marginBottom: 0,
};

export default ProgressBar;
