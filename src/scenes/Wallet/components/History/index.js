import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { connect } from 'react-redux';
import {
  Table,
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

import styles from './styles';
import HistoryItem from './components/HistoryItem';
import { SortBy } from '../../../../constants';
import Config from '../../../../config/app';

@injectIntl
@withStyles(styles, { withTheme: true })
@connect((state) => ({
  syncBlockNum: state.App.get('syncBlockNum'),
  txReturn: state.Graphql.get('txReturn'),
}))
@inject('store')
@observer
export default class WalletHistory extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    txReturn: PropTypes.object,
    syncBlockNum: PropTypes.number.isRequired,
  };

  static defaultProps = {
    txReturn: undefined,
  };

  onSortChange = (property) => (event) => { // eslint-disable-line
    const { walletHistory } = this.props.store;

    let order = SortBy.Descending.toLowerCase();
    if (walletHistory.orderBy === property && walletHistory.direction === SortBy.Descending.toLowerCase()) {
      order = SortBy.Ascending.toLowerCase();
    }

    walletHistory.onSortingChange(property, order);
  }

  componentDidMount() {
    this.props.store.walletHistory.init();
  }

  componentDidUpdate(prevProps) {
    const { txReturn, syncBlockNum, store: { walletHistory: { queryTransactions } } } = prevProps;

    if ((txReturn && !this.props.txReturn) || (syncBlockNum !== this.props.syncBlockNum)) {
      queryTransactions();
    }
  }

  render() {
    const { classes, store: { walletHistory } } = this.props;

    return (
      <Paper className={classes.txHistoryPaper}>
        <Grid container spacing={0} className={classes.txHistoryGridContainer}>
          <Typography variant="title">
            <FormattedMessage id="walletHistory.transferHistory" defaultMessage="Transfer History" />
          </Typography>
          <Table className={classes.table}>
            <TableHeader
              orderBy={walletHistory.orderBy}
              direction={walletHistory.direction}
              onSortChange={this.onSortChange}
            />
            <TableRows list={walletHistory.list} />
            <TableFooter
              fullList={walletHistory.fullList}
              perPage={walletHistory.perPage}
              page={walletHistory.page}
              onPageChange={walletHistory.onPageChange}
              onPerPageChange={walletHistory.onPerPageChange}
            />
          </Table>
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
                direction={direction.toLowerCase()}
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

const TableRows = ({ list }) => (
  <TableBody>
    {list.map((transaction) => <HistoryItem key={transaction.txid} transaction={transaction} />)}
  </TableBody>
);

const TableFooter = ({ fullList, perPage, page, onPageChange, onPerPageChange }) => (
  <_TableFooter>
    <TableRow>
      <TablePagination
        colSpan={12}
        count={fullList.length}
        rowsPerPage={perPage}
        page={page}
        onChangePage={(e, p) => onPageChange(p)}
        onChangeRowsPerPage={(e) => onPerPageChange(e.target.value)}
      />
    </TableRow>
  </_TableFooter>
);
