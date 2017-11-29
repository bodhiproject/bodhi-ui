import React, { Component } from 'react';

export default class SaleWidget extends Component {
  render() {
    const {
      fontColor, label, price, details,
    } = this.props;

    const textColor = {
      color: fontColor,
    };

    return (
      <div className="isoSaleWidget">
        <h3 className="isoSaleLabel">{label}</h3>
        <span className="isoSalePrice" style={textColor}>{price}</span>
        <p className="isoSaleDetails">{details}</p>
      </div>
    );
  }
}
