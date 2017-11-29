import React, { Component } from 'react';

export default class IsoWidgetBox extends Component {
  render() {
    const { children } = this.props;

    const boxStyle = {
      height: this.props.height,
      padding: this.props.padding,
    };

    return (
      <div className="isoWidgetBox" style={boxStyle}>
        {children}
      </div>
    );
  }
}
