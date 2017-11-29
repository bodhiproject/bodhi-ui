import React, { Component } from 'react';

export default class SocialWidget extends Component {
  render() {
    const { children } = this.props;
    return (
      <ul className="isoSocialWidgetWrapper">
        {children}
      </ul>
    );
  }
}
