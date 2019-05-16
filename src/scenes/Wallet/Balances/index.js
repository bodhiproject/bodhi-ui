import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { TableBody, TableCell, TableHead, TableRow, TableSortLabel, Tooltip, Button, Snackbar, withStyles, Grid, Paper, Typography, IconButton } from '@material-ui/core';
import { Close as CloseIcon, ContentCopy } from '@material-ui/icons';
import { FormattedMessage, injectIntl } from 'react-intl';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import _ from 'lodash';
import { SortBy } from 'constants';
import { ResponsiveTable } from 'components';

import styles from './styles';
import Config from '../../../config/app';


@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class MyBalances extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      order: SortBy.ASCENDING.toLowerCase(),
      orderBy: 'address',
      addrCopiedSnackbarVisible: false,
    };

    this.getTotalsGrid = this.getTotalsGrid.bind(this);
    this.getTableHeader = this.getTableHeader.bind(this);
    this.getSortableCell = this.getSortableCell.bind(this);
    this.getNonSortableCell = this.getNonSortableCell.bind(this);
    this.getTableBody = this.getTableBody.bind(this);
    this.getAddrCopiedSnackBar = this.getAddrCopiedSnackBar.bind(this);
    this.onCopyClicked = this.onCopyClicked.bind(this);
    this.onAddrCopiedSnackbarClosed = this.onAddrCopiedSnackbarClosed.bind(this);
  }

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.myBalancePaper}>
        <Grid container spacing={0} className={classes.myBalanceGridContainer}>
          <Typography variant="h6" className={classes.myBalanceTitle}>
            <FormattedMessage id="myBalances.myBalance" defaultMessage="My Balance" />
          </Typography>
          {this.getTotalsGrid()}
          <ResponsiveTable>
            {this.getTableHeader()}
            {this.getTableBody()}
          </ResponsiveTable>
          {this.getAddrCopiedSnackBar()}
        </Grid>
      </Paper>
    );
  }

  getTotalsGrid() {
    const { classes, store: { wallet } } = this.props;

    let totalNaka = 0;
    let totalNbot = 0;
    const walletAddresses = wallet.addresses;
    if (walletAddresses && walletAddresses.length) {
      totalNaka = _.sumBy(walletAddresses, (address) => address.naka ? address.naka : 0);
      totalNbot = _.sumBy(walletAddresses, (address) => address.nbot ? address.nbot : 0);
    }

    const items = [
      {
        id: 'naka',
        name: 'str.naka',
        nameDefault: 'NAKA',
        total: totalNaka,
      },
      {
        id: 'nbot',
        name: 'str.nbot',
        nameDefault: 'NBOT',
        total: totalNbot,
      },
    ];

    return (
      <Grid container className={classes.totalsContainerGrid}>
        {items.map((item) => (
          <Grid item key={item.id} className={classes.totalsItemGrid}>
            <Typography className={classes.totalsItemAmount}>{item.total.toFixed(2)}</Typography>
            <Typography variant="body2">
              <FormattedMessage id={item.name} default={item.nameDefault} />
            </Typography>
          </Grid>
        ))}
      </Grid>
    );
  }

  getTableHeader() {
    const cols = [
      {
        id: 'address',
        name: 'str.address',
        nameDefault: 'Address',
        numeric: false,
        sortable: true,
      },
      {
        id: 'copyButton',
        name: 'str.copy',
        nameDefault: 'Copy',
        numeric: false,
        sortable: false,
      },
      {
        id: 'naka',
        name: 'str.naka',
        nameDefault: 'NAKA',
        numeric: true,
        sortable: true,
      },
      {
        id: 'nbot',
        name: 'str.nbot',
        nameDefault: 'NBOT',
        numeric: true,
        sortable: true,
      },
    ];

    return (
      <TableHead>
        <TableRow>
          {cols.map((column) => column.sortable ? this.getSortableCell(column) : this.getNonSortableCell(column))}
        </TableRow>
      </TableHead>
    );
  }

  getSortableCell(column) {
    const { classes } = this.props;
    const { order, orderBy } = this.state;

    return (
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
            onClick={this.handleSorting(column.id)}
          >
            <Typography variant="body2" className={classes.tableHeaderItemText}>
              <FormattedMessage id={column.name} default={column.nameDefault} />
            </Typography>
          </TableSortLabel>
        </Tooltip>
      </TableCell>
    );
  }

  getNonSortableCell(column) {
    const { classes } = this.props;

    return (
      <TableCell
        key={column.id}
        numeric={column.numeric}
      >
        <Typography variant="body2" className={classes.tableHeaderItemText}>
          <FormattedMessage id={column.name} default={column.nameDefault} />
        </Typography>
      </TableCell>
    );
  }

  handleSorting = (property) => (event) => { // eslint-disable-line
    const orderBy = property;
    let order = SortBy.DESCENDING.toLowerCase();
    const { store: { wallet } } = this.props;

    if (this.state.orderBy === property && this.state.order === SortBy.DESCENDING.toLowerCase()) {
      order = SortBy.ASCENDING.toLowerCase();
    }

    if (order === SortBy.DESCENDING.toLowerCase()) {
      wallet.addresses.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1));
    } else {
      wallet.addresses.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));
    }

    this.setState({
      order,
      orderBy,
    });
  }

  getTableBody() {
    const { classes, store: { wallet } } = this.props;

    return (
      <TableBody>
        {wallet.addresses.map((item, index) =>
          (<TableRow key={item.address} selected={index % 2 !== 0}>
            <TableCell>
              <Typography variant="body2">{item.address}</Typography>
            </TableCell>
            <TableCell>
              <CopyToClipboard text={item.address} onCopy={this.onCopyClicked}>
                <Button size="small" className={classes.tableRowCopyButton}>
                  <ContentCopy className={classes.tableRowCopyButtonIcon} />
                  <Typography variant="body2" className={classes.tableRowCopyButtonText}>
                    <FormattedMessage id="str.copy" defaultMessage="Copy" />
                  </Typography>
                </Button>
              </CopyToClipboard>
            </TableCell>
            <TableCell numeric>
              <Typography variant="body2">{item.naka}</Typography>
            </TableCell>
            <TableCell numeric>
              <Typography variant="body2">{item.nbot}</Typography>
            </TableCell>
          </TableRow>))}
      </TableBody>
    );
  }

  getAddrCopiedSnackBar() {
    const { addrCopiedSnackbarVisible } = this.state;

    return (
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={addrCopiedSnackbarVisible}
        autoHideDuration={Config.intervals.snackbarLong}
        onClose={this.onAddrCopiedSnackbarClosed}
        message={<FormattedMessage id="myBalances.addressCopied" defaultMessage="Address copied" />}
        action={[
          <IconButton
            key="close"
            color="inherit"
            onClick={this.onAddrCopiedSnackbarClosed}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
    );
  }

  onCopyClicked() {
    this.setState({
      addrCopiedSnackbarVisible: true,
    });
  }

  onAddrCopiedSnackbarClosed() {
    this.setState({
      addrCopiedSnackbarVisible: false,
    });
  }
}
