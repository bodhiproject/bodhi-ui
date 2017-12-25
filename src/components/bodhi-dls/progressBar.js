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
      label, value, percent, barHeight, barColor, marginBottom, secondaryPercent, secondaryBarHeight,
    } = this.props;

    const titleStyle = {
      fontSize: '16px',
      fontWeight: 400,
    };

    return (
      <div style={{ marginBottom: `${marginBottom}px` }}>
        <h3 style={titleStyle}>{label}</h3>
        <Progress
          className={barColor}
          percent={percent}
          strokeWidth={barHeight}
          status="active"
          showInfo
        />

        {typeof secondaryPercent !== 'undefined' ? <Progress
          className={barColor || 'secondary'}
          percent={secondaryPercent}
          strokeWidth={secondaryBarHeight}
          status="active"
          showInfo
        /> : null}

        <p style={{ fontSize: '14px', fontWeight: 400 }}>{value}</p>
      </div>
    );
  }
}

ProgressBar.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  percent: PropTypes.number.isRequired,
  barHeight: PropTypes.number.isRequired,
  barColor: PropTypes.string,
  marginBottom: PropTypes.number,
  secondaryPercent: PropTypes.number,
  secondaryBarHeight: PropTypes.number,
};

ProgressBar.defaultProps = {
  barColor: '',
  secondaryPercent: undefined,
  secondaryBarHeight: undefined,
  marginBottom: 0,
};

export default ProgressBar;
