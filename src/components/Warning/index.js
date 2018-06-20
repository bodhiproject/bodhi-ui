import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { injectIntl, intlShape } from 'react-intl';
import cx from 'classnames';

import styles from './styles';


const Warning = ({ classes, id, message, values, className, type, intl, theme, ...props }) => !message ? null : (
  <div {...props} className={cx(className, classes[type])}>
    {intl.formatMessage({ id, message }, values)}
  </div>
);

Warning.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  message: PropTypes.string,
  theme: PropTypes.object,
  id: PropTypes.string,
  values: PropTypes.object,
  intl: intlShape.isRequired, // eslint-disable-line
  type: PropTypes.string,
};

Warning.defaultProps = {
  message: undefined,
  values: {},
  id: '',
  className: undefined,
  theme: undefined,
  type: 'pending',
};

export default injectIntl(withStyles(styles)(Warning));
