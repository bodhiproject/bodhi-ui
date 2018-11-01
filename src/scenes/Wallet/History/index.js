import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import {
  Paper,
  Grid,
  Typography,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TableFooter as _TableFooter,
  TablePagination,
  Tooltip,
  withStyles,
} from '@material-ui/core';
import { FormattedMessage, injectIntl } from 'react-intl';
import { SortBy } from 'constants';
import { ResponsiveTable } from 'components';

import styles from './styles';
import HistoryItem from './HistoryItem';
import Config from '../../../config/app';

@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class WalletHistory extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  onPageChange = (page) => {
    this.props.store.myWallet.history.page = page;
  }

  onPerPageChange = (perPage) => {
    this.props.store.myWallet.history.perPage = perPage;
  }

  onSortChange = (property) => (event) => { // eslint-disable-line
    const { myWallet: { history } } = this.props.store;

    if (history.orderBy !== property) {
      history.orderBy = property;
    } else if (history.direction === SortBy.DESCENDING.toLowerCase()) {
      history.direction = SortBy.ASCENDING.toLowerCase();
    } else {
      history.direction = SortBy.DESCENDING.toLowerCase();
    }
  }

  componentDidMount() {
    this.props.store.myWallet.history.init();
  }

  render() {
    const { classes, store: { myWallet: { history } } } = this.props;

    return (
      <Paper className={classes.txHistoryPaper}>
        <Grid container spacing={0} className={classes.txHistoryGridContainer}>
          <Typography variant="subtitle1">
            <FormattedMessage id="walletHistory.transferHistory" defaultMessage="Transfer History" />
          </Typography>
          <ResponsiveTable className={classes.table}>
            <TableHeader
              orderBy={history.orderBy}
              direction={history.direction}
              onSortChange={this.onSortChange}
            />
            <TableRows list={history.list} />
            <TableFooter
              fullList={history.fullList}
              perPage={history.perPage}
              page={history.page}
              onPageChange={this.onPageChange}
              onPerPageChange={this.onPerPageChange}
            />
          </ResponsiveTable>
        </Grid>
      </Paper>
    );
  }
}

const TableHeader = ({ orderBy, direction, onSortChange }) => {
  const headerCols = [
    {
      id: 'createdTime',
      name: 'str.time',
      nameDefault: 'Time',
      numeric: false,
    },
    {
      id: 'senderAddress',
      name: 'str.from',
      nameDefault: 'From',
      numeric: false,
    },
    {
      id: 'receiverAddress',
      name: 'str.to',
      nameDefault: 'To',
      numeric: false,
    },
    {
      id: 'amount',
      name: 'str.amount',
      nameDefault: 'Amount',
      numeric: true,
    },
    {
      id: 'fee',
      name: 'str.fee',
      nameDefault: 'Gas Fee(QTUM)',
      numeric: true,
    },
    {
      id: 'status',
      name: 'str.status',
      nameDefault: 'Status',
      numeric: false,
    },
    {
      id: 'actions',
      name: 'str.empty',
      nameDefault: '',
      numeric: false,
      sortable: false,
    },
  ];

  return (
    <TableHead>
      <TableRow>
        {headerCols.map((column) => (
          <TableCell
            key={column.id}
            numeric={column.numeric}
            sortDirection={orderBy === column.id ? direction.toLowerCase() : false}
          >
            <Tooltip
              title={<FormattedMessage id="str.sort" defaultMessage="Sort" />}
              enterDelay={Config.intervals.tooltipDelay}
              placement={column.numeric ? 'bottom-end' : 'bottom-start'}
            >
              <TableSortLabel
                active={orderBy === column.id}
                direction={direction}
                onClick={onSortChange(column.id)}
              >
                <FormattedMessage id={column.name} default={column.nameDefault} />
              </TableSortLabel>
            </Tooltip>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

const TableRows = observer(({ list }) => (
  <TableBody>
    {list.map((transaction) => <HistoryItem key={transaction.txid} transaction={transaction} />)}
  </TableBody>
));

const TableFooter = observer(({ fullList, perPage, page, onPageChange, onPerPageChange }) => (
  <_TableFooter>
    <TableRow>
      <TablePagination
        colSpan={12}
        count={fullList.length}
        rowsPerPage={perPage}
        page={page}
        onChangePage={(event, pg) => onPageChange(pg)}
        onChangeRowsPerPage={(event) => onPerPageChange(event.target.value)}
      />
    </TableRow>
  </_TableFooter>
));
