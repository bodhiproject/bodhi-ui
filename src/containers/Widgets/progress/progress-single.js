import React, { Component, PropTypes } from 'react';
import Progress from '../../../components/uielements/progress';

export default class SingleProgressWidget extends Component {
  render() {
    const {
      label, percent, barHeight, status, info, fontColor,
    } = this.props;

    const wrapperStyle = { 'margin-top': '18px', 'margin-bottom': '18px' };

    const titleStyle = {
      color: fontColor,
      fontSize: '16px',
      fontWeight: 300,
    };

    return (
      <div className="isoSingleProgressBar" style={wrapperStyle}>
        <h3 style={titleStyle}>{label}</h3>
        <Progress
          percent={percent}
          strokeWidth={barHeight}
          status={status}
          showInfo={info}
        />
      </div>
    );
  }
}

SingleProgressWidget.propTypes = {
  label: PropTypes.string,
  percent: PropTypes.number,
  barHeight: PropTypes.number,
  status: PropTypes.string,
  info: PropTypes.bool,
  fontColor: PropTypes.string,
};

SingleProgressWidget.defaultProps = {
  label: 'Single Progress Label',
  percent: 100,
  barHeight: 8,
  status: 'active',
  info: false,
  fontColor: '#000',
};
