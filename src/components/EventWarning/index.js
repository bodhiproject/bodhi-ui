import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { FormattedMessage, injectIntl } from 'react-intl';
import classNames from 'classnames';

import styles from './styles';

class EventWarning extends React.PureComponent {
  render() {
    const {
      classes,
      typeClass,
      message,
    } = this.props;

    if (!message || message === undefined) {
      return null;
    }

    return (
      <div className={classNames(classes.warningWrapper, typeClass)}>
        {message}
      </div>
    );
  }
}

EventWarning.propTypes = {
  classes: PropTypes.object.isRequired,
  message: PropTypes.object,
  typeClass: PropTypes.string,
};

EventWarning.defaultProps = {
  typeClass: 'info',
  message: undefined,
};

export default injectIntl(withStyles(styles, { withTheme: true })(EventWarning));
