import React, { Component } from 'react';

export default class CardWidget extends Component {
  render() {
    const {
      icon, iconcolor, number, text,
    } = this.props;
    const iconStyle = {
      color: iconcolor,
    };

    return (
      <div className="isoCardWidget">
        <div className="isoIconWrapper">
          <i className={icon} style={iconStyle} />
        </div>

        <div className="isoContentWrapper">
          <h3 className="isoStatNumber">{number}</h3>
          <span className="isoLabel">{text}</span>
        </div>
      </div>
    );
  }
}
