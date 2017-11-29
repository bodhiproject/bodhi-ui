import React, { Component } from 'react';

export default class VCardWidget extends Component {
  render() {
    const {
      src, alt, name, title, description, children, style,
    } = this.props;
    return (
      <div className="isoVCardWidgetWrapper" style={style}>
        <div className="isoVCardImage">
          <img src={src} alt={alt} />
        </div>

        <div className="isoVCardBody">
          <h3 className="isoName">{name}</h3>
          <span className="isoDesgTitle">{title}</span>

          <p className="isoDescription">{description}</p>

          <div className="isoWidgetSocial">
            {children}
          </div>
        </div>
      </div>
    );
  }
}
