import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { FormattedMessage, injectIntl } from 'react-intl';
import classNames from 'classnames';

import styles from './styles';

class ImportantNote extends React.PureComponent {
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

    if (!message) {
      return null;
    }

    return (
      <div>
        <div className={classes.headingContainer}>
          <i className={classNames(classes.infoIcon, 'icon', 'iconfont', 'icon-ic_info')}></i>
          <span className={classes.headingText}>{heading}</span>
          <p className={classes.messageText}>{message}</p>
        </div>
      </div>
    );
  }
}

export default injectIntl(withStyles(styles, { withTheme: true })(ImportantNote));
