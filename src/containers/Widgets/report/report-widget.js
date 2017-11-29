import React, { Component } from 'react';

export default class ReportsWidget extends Component {
  render() {
    const { label, details, children } = this.props;
    return (
      <div className="isoReportsWidget">
        <h3 className="isoWidgetLabel">{label}</h3>

        <div className="isoReportsWidgetBar">
          {children}
        </div>

        <p className="isoDescription">{details}</p>
      </div>
    );
  }
}
