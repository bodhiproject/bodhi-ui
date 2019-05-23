import React from 'react';
import { withStyles, TableBody, TableCell, TableRow, Divider } from '@material-ui/core';
import { FormattedMessage, injectIntl } from 'react-intl';
import cx from 'classnames';
import _ from 'lodash';
import { ResponsiveTable } from 'components';
import styles from './styles';

const RewardTooltipContent = ({ token, totalInvestment, profitOrLoss, classes }) => (
  <ResponsiveTable className={classes.table}>
    <TableBody>
      <TableRow className={classes.tableRow}>
        <TableCell className={classes.tableCell}>
          <FormattedMessage id="tooltip.tokenInvestment" defaultMessage="Total {token} Investment" values={{ token }} />
        </TableCell>
        <TableCell className={cx(classes.tableCell, classes.root)} numeric padding="none">
          {totalInvestment}
        </TableCell>
      </TableRow>
      <TableRow className={classes.tableRow}>
        <TableCell className={classes.tableCell}>
          <Divider />
        </TableCell>
        <TableCell className={cx(classes.tableCell)} numeric padding="none">
          <Divider />
        </TableCell>
      </TableRow>
      <TableRow className={classes.tableRow}>
        <TableCell className={cx(classes.tableCell, classes.lastRow)} >
          <FormattedMessage id="tooltip.tokenReward" defaultMessage="Total {token} Reward" values={{ token }} />
        </TableCell>
        <TableCell className={cx(classes.tableCell, classes.lastRow, classes.root)} numeric>
          {profitOrLoss}
        </TableCell>
      </TableRow>
    </TableBody>
  </ResponsiveTable>
);


export default injectIntl(withStyles(styles)(RewardTooltipContent));
