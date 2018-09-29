import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { injectIntl, intlShape } from 'react-intl';
import cx from 'classnames';
import { EventWarningType } from 'constants';

import styles from './styles';


const Warning = ({ classes, id, amount, className, type, intl, theme, ...props }) => !id ? null : (
  <div {...props} className={cx(className, classes[type])}>
    {intl.formatMessage({ id }, { amount })}
  </div>
);

Warning.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  message: PropTypes.string,
  theme: PropTypes.object,
  id: PropTypes.string,
  amount: PropTypes.string,
  intl: intlShape.isRequired, // eslint-disable-line
  type: PropTypes.string,
};

Warning.defaultProps = {
  message: undefined,
  amount: '',
  id: '',
  className: undefined,
  theme: undefined,
  type: EventWarningType.HIGHLIGHT,
};

export default injectIntl(withStyles(styles)(Warning));
