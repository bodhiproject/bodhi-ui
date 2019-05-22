import React from 'react';
import { withStyles, TableBody, TableCell, TableRow, Divider } from '@material-ui/core';
import { FormattedMessage, injectIntl } from 'react-intl';
import cx from 'classnames';
import _ from 'lodash';
import { ResponsiveTable } from 'components';
import styles from './styles';

const RewardTooltipContent = ({ token, resultTokenAmount = 0, totalTokenAmount, tokenWinnings, nakaWon, nbotNakaWon, classes }) => {
  function atMostEightDigits(num) {
    let numToString = _.toString(num);
    const numArr = numToString.split('.');
    if (numArr.length === 2) {
      if (numArr[1].length > 8) {
        numArr[1] = numArr[1].substring(0, 8);
      }
      numToString = `${numArr[0]}.${numArr[1]}`;
    }
    return numToString;
  }

  let nakaWonFixed = nakaWon;
  let nbotNakaWonFixed = nbotNakaWon;
  if (_.isNumber(nakaWon)) {
    nakaWonFixed = atMostEightDigits(nakaWon);
  }
  if (_.isNumber(nbotNakaWon)) {
    nbotNakaWonFixed = atMostEightDigits(nbotNakaWon);
  }

  const tokenLosing = totalTokenAmount - resultTokenAmount;
  const tokenProfit = tokenWinnings - resultTokenAmount;

  return (
    <ResponsiveTable className={classes.table}>
      <TableBody>
        <TableRow className={classes.tableRow}>
          <TableCell className={classes.tableCell}>
            <FormattedMessage id="tooltip.tokenInvestment" defaultMessage="Total {token} Investment" values={{ token }} />
          </TableCell>
          <TableCell className={cx(classes.tableCell, classes.root)} numeric padding="none">
            {totalTokenAmount}
          </TableCell>
        </TableRow>
        {token === 'NBOT' &&
        (
          <TableRow className={classes.tableRow}>
            <TableCell className={classes.tableCell}>
              <FormattedMessage id="tooltip.tokenProfit" defaultMessage="Total {token} Profit" values={{ token }} />
            </TableCell>
            <TableCell className={cx(classes.tableCell, classes.root)} numeric padding="none">
              {tokenProfit}
            </TableCell>
          </TableRow>
        )
        }
        {token === 'NAKA' &&
        (
          <TableRow className={classes.tableRow}>
            <TableCell className={classes.tableCell}>
              <FormattedMessage id="tooltip.nakaWon" defaultMessage="{token} Won" values={{ token }} />
            </TableCell>
            <TableCell className={cx(classes.tableCell, classes.root)} numeric padding="none">
              {nakaWonFixed}
            </TableCell>
          </TableRow>
        )
        }
        {token === 'NAKA' &&
        (
          <TableRow className={classes.tableRow}>
            <TableCell className={classes.tableCell}>
              <FormattedMessage id="tooltip.nbotNakaWon" defaultMessage="{token} Reward" values={{ token }} />
            </TableCell>
            <TableCell className={cx(classes.tableCell, classes.root)} numeric padding="none">
              {nbotNakaWonFixed}
            </TableCell>
          </TableRow>
        )
        }
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
    </ResponsiveTable>
  );
};

export default injectIntl(withStyles(styles)(RewardTooltipContent));
