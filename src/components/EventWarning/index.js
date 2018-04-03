import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { injectIntl, intlShape } from 'react-intl';
import classNames from 'classnames';

import styles from './styles';


const EventWarning = ({ classes, id, message, values, className, intl, theme, ...props }) => !message ? null : (
  <div {...props} className={classNames(className, classes.warningWrapper)}>
    {intl.formatMessage({ id, message }, values)}
  </div>
);

EventWarning.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  message: PropTypes.string,
  theme: PropTypes.object,
  id: PropTypes.string,
  values: PropTypes.object,
  intl: intlShape.isRequired, // eslint-disable-line
};

EventWarning.defaultProps = {
  message: undefined,
  values: {},
  id: '',
  className: undefined,
  theme: undefined,
};

export default injectIntl(withStyles(styles)(EventWarning));
