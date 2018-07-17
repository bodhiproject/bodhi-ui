import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import {
  Typography,
  Table,
  Grid,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TableFooter,
  TablePagination,
  Tooltip,
  withStyles,
} from '@material-ui/core';
import cx from 'classnames';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import { SortBy } from 'constants';

import styles from './styles';
import Config from '../../../config/app';
import TransactionHistoryID from '../../../components/TransactionHistoryAddressAndID/id';
import TransactionHistoryAddress from '../../../components/TransactionHistoryAddressAndID/address';
import { getShortLocalDateTimeString } from '../../../helpers/utility';
import { i18nToUpperCase } from '../../../helpers/i18nUtil';
import { getTxTypeString } from '../../../helpers/stringUtil';


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
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
  };

  state = {
    expanded: [],
  };

  navigating = false

  componentDidMount() {
    this.props.store.activities.history.init();
  }

  // componentDidUpdate(prevProps, prevState) {
  //   const { skip } = this.state;
  //   const { oracles, history } = this.props;

  //   if (skip !== prevState.skip) {
  //     this.executeTxsRequest();
  //   }

  //   if (prevProps.oracles !== oracles && this.navigating) {
  //     const path = getDetailPagePath(oracles);
  //     if (path) history.push(path);
  //   }
  // }

  render() {
    const { classes } = this.props;
    const { transactions } = this.props.store.activities.history;

    return (
      <Grid container spacing={0}>
        {
          transactions.length ?
            (<Table className={classes.historyTable}>
              {this.getTableHeader()}
              {this.getTableRows()}
              {this.getTableFooter()}
            </Table>) :
            (<Typography variant="body1">
              <FormattedMessage id="str.emptyTxHistory" defaultMessage="You do not have any transactions right now." />
            </Typography>)
        }
      </Grid>
    );
  }

  getTableHeader = () => {
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
      <TableHead>
        <TableRow>
          {headerCols.map((column) => column.sortable ? this.getSortableCell(column) : this.getNonSortableCell(column))}
        </TableRow>
      </TableHead>
    );
  }

  getSortableCell = (column) => {
    const { order, orderBy } = this.props.store.activities.history;
    return (
      <TableCell
        key={column.id}
        numeric={column.numeric}
        sortDirection={orderBy.toLowerCase() === column.id.toLowerCase() ? order.toLowerCase() : false}
      >
        <Tooltip
          title={<FormattedMessage id="str.sort" defaultMessage="Sort" />}
          enterDelay={Config.intervals.tooltipDelay}
          placement={column.numeric ? 'bottom-end' : 'bottom-start'}
        >
          <TableSortLabel
            active={orderBy.toLowerCase() === column.id.toLowerCase()}
            direction={order.toLowerCase()}
            onClick={this.createSortHandler(column.id)}
          >
            <FormattedMessage id={column.name} default={column.nameDefault} />
          </TableSortLabel>
        </Tooltip>
      </TableCell>
    );
  }

  getNonSortableCell = (column) => (
    <TableCell key={column.id} numeric={column.numeric}>
      <FormattedMessage id={column.name} default={column.nameDefault} />
    </TableCell>
  )

  getTableRows = () => {
    const { transactions, page, perPage } = this.props.store.activities.history;
    const slicedTxs = _.slice(transactions, page * perPage, (page * perPage) + perPage);

    return (
      <TableBody>
        {_.map(slicedTxs, (transaction, index) => (
          this.getTableRow(transaction, index)
        ))}
      </TableBody>
    );
  }

  handleClick = (id, topicAddress) => (event) => { // eslint-disable-line
    const { expanded } = this.state;
    const expandedIndex = expanded.indexOf(id);
    let newexpanded = [];
    if (topicAddress) {
      this.navigating = true;
    } else if (expandedIndex === -1) {
      newexpanded = [...expanded, id];
    } else {
      newexpanded = [...expanded.slice(0, expandedIndex), ...expanded.slice(expandedIndex + 1)];
    }

    this.setState({ expanded: newexpanded });
  };

  getTableRow = (transaction) => {
    const { name, topic, type, txid, amount, token, fee, status, createdTime } = transaction;
    const { intl, classes } = this.props;
    const { locale, messages: localeMessages } = intl;
    const result = [];
    const isExpanded = this.state.expanded.includes(txid);

    result[0] = (
      <TableRow key={txid} selected={isExpanded} onClick={this.handleClick(txid)} className={classes.clickToExpandRow} >
        <TableCell className={classes.summaryRowCell}>
          {getShortLocalDateTimeString(createdTime)}
        </TableCell>
        <TableCell>
          {getTxTypeString(type, locale, localeMessages)}
        </TableCell>
        <NameLinkCell clickable={topic && topic.address} onClick={this.handleClick(txid, topic && topic.address)} className={classes.viewEventLink}>
          {name || (topic && topic.name)}
        </NameLinkCell>
        <TableCell numeric>
          {`${amount || ''}  ${amount ? token : ''}`}
        </TableCell>
        <TableCell numeric>
          {fee}
        </TableCell>
        <TableCell>
          <FormattedMessage id={`str.${status}`.toLowerCase()}>
            {(txt) => i18nToUpperCase(txt)}
          </FormattedMessage>
        </TableCell>
        <TableCell>
          <i className={cx(isExpanded ? 'icon-ic_down' : 'icon-ic_up', 'icon iconfont', classes.arrowSize)} />
        </TableCell>
      </TableRow>
    );
    result[1] = (
      <TableRow key={`txaddr-${txid}`} selected onClick={this.handleClick(txid)} className={isExpanded ? classes.show : classes.hide}>
        <TransactionHistoryAddress transaction={transaction} className={classes.detailRow} />
        <TableCell /><TransactionHistoryID transaction={transaction} />
        <TableCell />
        <TableCell /><TableCell /><TableCell />
      </TableRow>
    );

    return result;
  }

  getTableFooter = () => {
    const { transactions, perPage, page } = this.props.store.activities.history;

    return (
      <TableFooter>
        <TableRow>
          <TablePagination
            colSpan={12}
            count={transactions.length}
            rowsPerPage={perPage}
            page={page}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangePerPage}
          />
        </TableRow>
      </TableFooter>
    );
  }

  handleChangePage = (event, page) => {
    const { transactions, perPage, skip } = this.props.store.activities.history;
    this.setState({ expanded: [] });
    // Set skip to fetch more txs if last page is reached
    let newSkip = skip;
    if (Math.floor(transactions.length / perPage) - 1 === page) {
      newSkip = transactions.length;
    }

    this.props.store.activities.history.page = page;
    this.props.store.activities.history.skip = newSkip;
  }

  handleChangePerPage = (event) => {
    this.props.store.activities.history.perPage = event.target.value;
  }

  createSortHandler = (property) => (event) => {
    this.handleSorting(event, property);
  }

  handleSorting = (event, property) => {
    const { transactions, orderBy, order } = this.props.store.activities.history;

    let orderBySymbol = SortBy.DESCENDING.toLowerCase();

    if (orderBy === property && order === SortBy.DESCENDING.toLowerCase()) {
      orderBySymbol = SortBy.ASCENDING.toLowerCase();
    }

    const sorted = _.orderBy(transactions, [property], [orderBySymbol]);
    this.props.store.activities.history.transactions = sorted;
    this.props.store.activities.history.orderBy = property;
    this.props.store.activities.history.order = orderBySymbol;
  }
}

const NameLinkCell = ({ className, clickable, topic, ...props }) => (
  <TableCell>
    <span className={clickable && className.viewEventLink} {...props} />
  </TableCell>
);
