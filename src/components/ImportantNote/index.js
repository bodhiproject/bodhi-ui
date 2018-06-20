import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import cx from 'classnames';

import styles from './styles';


@injectIntl
@withStyles(styles, { withTheme: true })
export default class ImportantNote extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    heading: PropTypes.string,
    message: PropTypes.string,
  };

  static defaultProps = {
    heading: undefined,
    message: undefined,
  };

  render() {
    const {
      classes,
      heading,
      message,
    } = this.props;

    if (!heading && !message) {
      return null;
    }

    return (
      <div>
        <i className={cx(classes.infoIcon, 'icon iconfont icon-ic_info')}></i>
        <span className={classes.headingText}>{heading}</span>
        <p className={classes.messageText}>{message}</p>
      </div>
    );
  }
}
