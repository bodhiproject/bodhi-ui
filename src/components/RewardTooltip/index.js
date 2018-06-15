import React from 'react';
import Tooltip from 'material-ui/Tooltip';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';

const RewardTooltip = ({ token }) => {
  const getTooltipContent = () => (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>
            Total {token} Investment
          </TableCell>
          <TableCell>
            Total {token} Investment
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            Total {token} Profit
          </TableCell>
          <TableCell>
            Total {token} Profit
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            Total {token} Losing
          </TableCell>
          <TableCell>
            Total {token} Losing
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            Total {token} Reward
          </TableCell>
          <TableCell>
            Total {token} Reward
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );

  return (
    <Tooltip id="tooltip-icon" title={getTooltipContent()}>
      <i className="icon iconfont icon-ic_question" />
    </Tooltip>
  );
};

export default RewardTooltip;
