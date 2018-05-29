import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { injectIntl, intlShape } from 'react-intl';
import cx from 'classnames';

import styles from './styles';
import Warning from '../Warning/index';


const EventUpcoming = ({ classes, className, type, ...props }) => <Warning {...props} type={type} className={cx(className, classes.warningWrapper, classes[type])} />;

EventUpcoming.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  message: PropTypes.string,
  theme: PropTypes.object,
  id: PropTypes.string,
  values: PropTypes.object,
  type: PropTypes.string,
  intl: intlShape.isRequired, // eslint-disable-line
};

EventUpcoming.defaultProps = {
  message: undefined,
  values: {},
  id: '',
  className: undefined,
  theme: undefined,
  type: 'upcoming',
};

export default injectIntl(withStyles(styles)(EventUpcoming));
