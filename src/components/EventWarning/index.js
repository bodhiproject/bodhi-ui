import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import classNames from 'classnames';

import { EventWarningType } from '../../constants';
import styles from './styles';


const FormattedMessageFixed = (props) => <FormattedMessage {...props} />; // workaround: http://bit.ly/2u7Hhe4

const EventWarning = ({ classes, id, message, className, intl, ...props }) => !message ? null : (
  <div {...props} className={classNames(className, classes.warningWrapper)}>
    <FormattedMessageFixed id={id} defaultMessage={message} />
  </div>
);

EventWarning.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  message: PropTypes.string,
  id: PropTypes.string,
  intl: intlShape.isRequired, // eslint-disable-line
};

EventWarning.defaultProps = {
  message: undefined,
  id: '',
  className: undefined,
  theme: undefined,
};

export default injectIntl(withStyles(styles)(EventWarning));
