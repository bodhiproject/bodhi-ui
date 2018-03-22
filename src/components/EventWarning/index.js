import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import classNames from 'classnames';

import { EventWarningType } from '../../constants';
import styles from './styles';


function FormattedMessageFixed(props) {
  return <FormattedMessage {...props} />;
}

const EventWarning = ({ classes, id = '', message, className, intl, theme, ...props }) => !message ? null : (console.log('ID: ', id),
  <div {...props} className={classNames(className, classes.warningWrapper)}>
    <FormattedMessageFixed id={id} defaultMessage={message} />
  </div>
);

EventWarning.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string, // eslint-disable-line
  message: PropTypes.string,
  id: PropTypes.string, // eslint-disable-line
  theme: PropTypes.object, // eslint-disable-line
  intl: intlShape.isRequired, // eslint-disable-line
};

EventWarning.defaultProps = {
  message: undefined,
  theme: undefined,
};

export default injectIntl(withStyles(styles, { withTheme: true })(EventWarning));
