import React from 'react';
import { injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core';
import cx from 'classnames';
import styles from './styles';


const Loading = injectIntl(({ classes, className, text, intl, ...props }) => (
  <Col>
    <div className={cx(classes.loading, className)} {...props} />
    {text && intl.formatMessage({ id: text })}
  </Col>
));

const Col = withStyles(styles)(({ classes, ...props }) => <div className={classes.col} {...props} />);

export default withStyles(styles, { withTheme: true })(Loading);
