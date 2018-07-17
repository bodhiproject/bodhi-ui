import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import {
  Typography,
  Table,
  Grid,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TableFooter,
  TablePagination,
  Tooltip,
  withStyles,
} from '@material-ui/core';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';

import styles from './styles';
import Config from '../../../config/app';
import EventRows from './EventRows';

const messages = defineMessages({ // eslint-disable-line
  statusSuccess: {
    id: 'str.success',
    defaultMessage: 'Success',
  },
  statusPending: {
    id: 'str.pending',
    defaultMessage: 'Pending',
  },
  statusFail: {
    id: 'str.fail',
    defaultMessage: 'Fail',
  },
});

@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class EventHistory extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.store.activities.history.init();
  }

  createSortHandler = (property) => (event) => { // eslint-disable-line
    this.props.store.activities.history.sort(property);
  }

  render() {
    const { classes } = this.props;
    const { transactions, order, orderBy, page, perPage, displayedTxs } = this.props.store.activities.history;
    const headerCols = [
      {
        id: 'createdTime',
        name: 'str.time',
        nameDefault: 'Time',
        numeric: false,
        sortable: true,
      },
      {
        id: 'type',
        name: 'str.type',
        nameDefault: 'Type',
        numeric: false,
        sortable: true,
      },
      {
        id: 'name',
        name: 'str.name',
        nameDefault: 'Name',
        numeric: false,
        sortable: false,
      },
      {
        id: 'amount',
        name: 'str.amount',
        nameDefault: 'Amount',
        numeric: true,
        sortable: true,
      },
      {
        id: 'fee',
        name: 'str.fee',
        nameDefault: 'Gas Fee (QTUM)',
        numeric: true,
        sortable: true,
      },
      {
        id: 'status',
        name: 'str.status',
        nameDefault: 'Status',
        numeric: false,
        sortable: true,
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
      <Grid container spacing={0}>
        {transactions.length ? (
          <Table className={classes.historyTable}>
            <TableHeader
              onSortChange={this.createSortHandler}
              cols={headerCols}
              order={order}
              orderBy={orderBy}
            />
            <EventRows displayedTxs={displayedTxs} />
            <EventHistoryFooter
              fullList={transactions}
              perPage={perPage}
              page={page}
              onPageChange={(event, page) => { // eslint-disable-line
                this.props.store.activities.history.page = page;
              }}
              onPerPageChange={(event) => {
                this.props.store.activities.history.perPage = event.target.value;
              }}
            />
          </Table>
        ) : (
          <Typography variant="body1">
            <FormattedMessage id="str.emptyTxHistory" defaultMessage="You do not have any transactions right now." />
          </Typography>
        )}
      </Grid>
    );
  }
}

const EventHistoryFooter = withStyles(styles)(({ fullList, perPage, page, onPageChange, onPerPageChange }) => (
  <TableFooter>
    <TableRow>
      <TablePagination
        colSpan={12}
        count={fullList.length}
        rowsPerPage={perPage}
        page={page}
        onChangePage={onPageChange}
        onChangeRowsPerPage={onPerPageChange}
      />
    </TableRow>
  </TableFooter>
));

const TableHeader = withStyles(styles)(({ cols, order, orderBy, onSortChange }) => (
  <TableHead>
    <TableRow>
      {cols.map((column) => column.sortable ? (
        <TableCell
          key={column.id}
          numeric={column.numeric}
          sortDirection={orderBy === column.id ? order : false}
        >
          <Tooltip
            title={<FormattedMessage id="str.sort" defaultMessage="Sort" />}
            enterDelay={Config.intervals.tooltipDelay}
            placement={column.numeric ? 'bottom-end' : 'bottom-start'}
          >
            <TableSortLabel
              active={orderBy === column.id}
              direction={order}
              onClick={onSortChange(column.id)}
            >
              <FormattedMessage id={column.name} default={column.nameDefault} />
            </TableSortLabel>
          </Tooltip>
        </TableCell>
      ) : (
        <TableCell key={column.id} numeric={column.numeric}>
          <FormattedMessage id={column.name} default={column.nameDefault} />
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
));
