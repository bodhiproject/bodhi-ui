import React from 'react';
import { withStyles, Table } from '@material-ui/core';
import cx from 'classnames';

import styles from './styles';

const ResponsiveTable = withStyles(styles)(({ classes, className, children, ...props }) => (
  <div className={cx(classes.responsiveTableWrapper, className)} {...props}>
    <Table>
      {children}
    </Table>
  </div>
));

export default ResponsiveTable;
