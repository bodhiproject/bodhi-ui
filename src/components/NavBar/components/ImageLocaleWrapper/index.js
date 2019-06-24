import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { injectIntl, intlShape } from 'react-intl';

@injectIntl
@inject('store')
@observer
export default class ImageLocaleWrapper extends Component {
  static propTypes = {
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    appliedLanguages: PropTypes.array,
  };

  static defaultProps = {
    appliedLanguages: [],
  };

  getLocaleSrc = (src, locale) => {
    const { appliedLanguages, intl } = this.props;
    if (appliedLanguages.indexOf(intl.locale) < 0) return src;
    let lastpoint = src.lastIndexOf('.');
    if (lastpoint < 0) lastpoint = src.length();
    return `${src.slice(0, lastpoint)}_${locale}${src.slice(lastpoint)}`;
  }

  render() {
    const { intl, src, alt, className, onClick } = this.props;
    return (
      // eslint-disable-next-line
      <img
        src={this.getLocaleSrc(src, intl.locale)}
        alt={alt}
        className={className}
        onClick={onClick}
      />
    );
  }
}
