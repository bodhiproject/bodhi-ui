import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Typography, Table, Grid, TableCell, TableHead, TableRow, TableSortLabel, TableFooter, TablePagination, Tooltip, withStyles } from '@material-ui/core';
import { FormattedMessage, injectIntl } from 'react-intl';
import { InstallQryptoInline } from 'components';

import styles from './styles';
import EventRows from './EventRows';
import Config from '../../../config/app';
import { Row } from '../../../components/InfiniteScroll';
import Loading from '../../../components/EventListLoading';

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

@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class ActivityHistory extends Component {
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
    const { classes, store: { activities: { history }, wallet: { currentAddress } } } = this.props;
    const { transactions, order, orderBy, page, perPage, displayedTxs, loaded } = history;

    if (!loaded) return <Loading />;
    return (
      <div>
        {currentAddress ? (
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
                  onChangePage={(event, pg) => history.page = pg}
                  onChangeRowsPerPage={(event) => history.perPage = event.target.value}
                />
              </Table>
            ) : (
              <Row>
                <Row><img src="/images/empty.svg" alt="empty placeholder" /></Row>
                <Row>
                  <Typography variant="title">
                    <FormattedMessage id="str.emptyTxHistory" defaultMessage="You do not have any transactions right now." />
                  </Typography>
                </Row>
              </Row>
            )}
          </Grid>
        ) : (
          <InstallQryptoInline />
        )}
      </div>
    );
  }
}

const EventHistoryFooter = ({ fullList, perPage, page, ...props }) => (
  <TableFooter>
    <TableRow>
      <TablePagination
        colSpan={12}
        count={fullList.length}
        rowsPerPage={perPage}
        page={page}
        {...props}
      />
    </TableRow>
  </TableFooter>
);

const TableHeader = ({ cols, order, orderBy, onSortChange }) => (
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
);
