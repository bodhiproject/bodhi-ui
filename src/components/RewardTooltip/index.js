import React from 'react';
import { withStyles, Table, TableBody, TableCell, TableRow, Tooltip, Divider } from 'material-ui';
import { FormattedMessage, injectIntl } from 'react-intl';
import cx from 'classnames';

import styles from './styles';

const RewardTooltip = ({ token, resultTokenAmount = 0, totalTokenAmount, tokenWinnings, classes }) => {
  const tokenLosing = totalTokenAmount - resultTokenAmount;
  const tokenProfit = tokenWinnings - resultTokenAmount;

  const getTooltipContent = () => (
    <Table className={classes.table}>
      <TableBody>
        <TableRow className={classes.tableRow}>
          <TableCell className={classes.tableCell}>
            <FormattedMessage id="tooltip.tokenInvestment" defaultMessage="Total {token} Investment" values={{ token }} />
          </TableCell>
          <TableCell className={cx(classes.tableCell, classes.root)} numeric padding="none">
            {totalTokenAmount}
          </TableCell>
        </TableRow>
        <TableRow className={classes.tableRow}>
          <TableCell className={classes.tableCell}>
            <FormattedMessage id="tooltip.tokenProfit" defaultMessage="Total {token} Profit" values={{ token }} />
          </TableCell>
          <TableCell className={cx(classes.tableCell, classes.root)} numeric padding="none">
            {tokenProfit}
          </TableCell>
        </TableRow>
        <TableRow className={classes.tableRow}>
          <TableCell className={classes.tableCell}>
            <FormattedMessage id="tooltip.tokenLosing" defaultMessage="Total {token} Losing" values={{ token }} />
          </TableCell>
          <TableCell className={cx(classes.tableCell, classes.root)} numeric padding="none">
            {tokenLosing}
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
            {tokenWinnings}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );

  return (
    <Tooltip id="tooltip-reward" title={getTooltipContent()}>
      <i className="icon iconfont icon-ic_question" />
    </Tooltip>
  );
};

export default injectIntl(withStyles(styles)(RewardTooltip));
