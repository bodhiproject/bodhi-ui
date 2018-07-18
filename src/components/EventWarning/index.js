import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { injectIntl, intlShape } from 'react-intl';
import cx from 'classnames';

import styles from './styles';
import Warning from '../Warning';


const EventWarning = ({ classes, className, type, ...props }) => <Warning {...props} type={type} className={cx(className, classes.warningWrapper, classes[type])} />;

EventWarning.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  message: PropTypes.string,
  theme: PropTypes.object,
  id: PropTypes.string,
  amount: PropTypes.string,
  type: PropTypes.string,
  intl: intlShape.isRequired, // eslint-disable-line
};

EventWarning.defaultProps = {
  message: undefined,
  amount: '',
  id: '',
  className: undefined,
  theme: undefined,
  type: 'pending',
};

export default injectIntl(withStyles(styles)(EventWarning));
