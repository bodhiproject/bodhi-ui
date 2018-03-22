import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { FormattedMessage, injectIntl } from 'react-intl';
import classNames from 'classnames';

import { EventWarningType } from '../../constants';
import styles from './styles';

class EventWarning extends React.PureComponent {
  render() {
    const {
      classes,
      className,
      typeClass,
      message,
      ...props
    } = this.props;

    if (!message) {
      return null;
    }

    return (
      <div {...props} className={classNames(className, classes.warningWrapper, typeClass)}>
        {message}
      </div>
    );
  }
}

EventWarning.propTypes = {
  classes: PropTypes.object.isRequired,
  message: PropTypes.object,
  typeClass: PropTypes.string,
  className: PropTypes.string,
};

EventWarning.defaultProps = {
  typeClass: EventWarningType.Info,
  className: EventWarningType.Info,
  message: undefined,
};

export default injectIntl(withStyles(styles, { withTheme: true })(EventWarning));
