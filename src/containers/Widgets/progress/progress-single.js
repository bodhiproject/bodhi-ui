import React, { Component } from 'react';
import Progress from '../../../components/uielements/progress';

export default class SingleProgressWidget extends Component {
  render() {
    const {
      label, percent, barHeight, status, info, fontColor,
    } = this.props;
    return (
      <div className="isoSingleProgressBar">
        <h3 style={{ color: fontColor }}>{label}</h3>
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
