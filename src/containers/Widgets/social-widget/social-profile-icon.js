import React, { Component } from 'react';

export default class SocialProfile extends Component {
  render() {
    const { url, icon, iconcolor } = this.props;
    const iconStyle = {
      color: iconcolor,
    };
    return (
      <li>
        <a href={url}>
          <i className={icon} style={iconStyle} />
        </a>
      </li>
    );
  }
}
