import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Button,
  Snackbar,
  withStyles,
  Grid,
  Paper,
  Typography,
  IconButton,
} from '@material-ui/core';
import { Close as CloseIcon, ContentCopy } from '@material-ui/icons';
import { FormattedMessage, injectIntl } from 'react-intl';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import _ from 'lodash';

import styles from './styles';
import Config from '../../../../config/app';
import DepositDialog from '../DepositDialog';
import WithdrawDialog from '../WithdrawDialog';
import appActions from '../../../../redux/App/actions';
import { doesUserNeedToUnlockWallet } from '../../../../helpers/utility';
import Tracking from '../../../../helpers/mixpanelUtil';
import { SortBy } from '../../../../constants';


@injectIntl
@withStyles(styles, { withTheme: true })
@connect((state) => ({
  walletAddresses: state.App.get('walletAddresses'),
  walletEncrypted: state.App.get('walletEncrypted'),
  walletUnlockedUntil: state.App.get('walletUnlockedUntil'),
}), (dispatch) => ({
  toggleWalletUnlockDialog: (isVisible) => dispatch(appActions.toggleWalletUnlockDialog(isVisible)),
}))
export default class MyBalances extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    walletAddresses: PropTypes.array.isRequired,
    walletEncrypted: PropTypes.bool.isRequired,
    walletUnlockedUntil: PropTypes.number.isRequired,
    toggleWalletUnlockDialog: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      order: SortBy.Ascending.toLowerCase(),
      orderBy: 'address',
      addrCopiedSnackbarVisible: false,
      selectedAddress: undefined,
      selectedAddressQtum: undefined,
      selectedAddressBot: undefined,
      depositDialogVisible: false,
      withdrawDialogVisible: false,
    };

    this.getTotalsGrid = this.getTotalsGrid.bind(this);
    this.getTableHeader = this.getTableHeader.bind(this);
    this.getSortableCell = this.getSortableCell.bind(this);
    this.getNonSortableCell = this.getNonSortableCell.bind(this);
    this.getTableBody = this.getTableBody.bind(this);
    this.getAddrCopiedSnackBar = this.getAddrCopiedSnackBar.bind(this);
    this.onCopyClicked = this.onCopyClicked.bind(this);
    this.onDepositClicked = this.onDepositClicked.bind(this);
    this.handleDepositDialogClose = this.handleDepositDialogClose.bind(this);
    this.onWithdrawClicked = this.onWithdrawClicked.bind(this);
    this.onWithdraw = this.onWithdraw.bind(this);
    this.onAddrCopiedSnackbarClosed = this.onAddrCopiedSnackbarClosed.bind(this);
  }

  render() {
    const { classes } = this.props;
    const {
      selectedAddress,
      selectedAddressQtum,
      selectedAddressBot,
      depositDialogVisible,
      withdrawDialogVisible,
    } = this.state;

    return (
      <Paper className={classes.myBalancePaper}>
        <Grid container spacing={0} className={classes.myBalanceGridContainer}>
          <Typography variant="title" className={classes.myBalanceTitle}>
            <FormattedMessage id="myBalances.myBalance" defaultMessage="My Balance" />
          </Typography>
          {this.getTotalsGrid()}
          <Table>
            {this.getTableHeader()}
            {this.getTableBody()}
          </Table>
          {this.getAddrCopiedSnackBar()}
          <DepositDialog
            dialogVisible={depositDialogVisible}
            onClose={this.handleDepositDialogClose}
            onCopyClicked={this.onCopyClicked}
            walletAddress={selectedAddress}
            qtumAmount={selectedAddressQtum}
            botAmount={selectedAddressBot}
          />
          <WithdrawDialog
            dialogVisible={withdrawDialogVisible}
            onClose={this.handleWithdrawDialogClose}
            onWithdraw={this.onWithdraw}
            walletAddress={selectedAddress}
            qtumAmount={selectedAddressQtum}
            botAmount={selectedAddressBot}
          />
        </Grid>
      </Paper>
    );
  }

  getTotalsGrid() {
    const { classes, walletAddresses } = this.props;

    let totalQtum = 0;
    let totalBot = 0;
    if (walletAddresses && walletAddresses.length) {
      totalQtum = _.sumBy(walletAddresses, (address) => address.qtum ? address.qtum : 0);
      totalBot = _.sumBy(walletAddresses, (address) => address.bot ? address.bot : 0);
    }

    const items = [
      {
        id: 'qtum',
        name: 'str.qtum',
        nameDefault: 'QTUM',
        total: totalQtum,
      },
      {
        id: 'bot',
        name: 'str.bot',
        nameDefault: 'BOT',
        total: totalBot,
      },
    ];

    return (
      <Grid container className={classes.totalsContainerGrid}>
        {items.map((item) => (
          <Grid item key={item.id} className={classes.totalsItemGrid}>
            <Typography className={classes.totalsItemAmount}>{item.total.toFixed(2)}</Typography>
            <Typography variant="body1">
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
        id: 'qtum',
        name: 'str.qtum',
        nameDefault: 'QTUM',
        numeric: true,
        sortable: true,
      },
      {
        id: 'bot',
        name: 'str.bot',
        nameDefault: 'BOT',
        numeric: true,
        sortable: true,
      },
      {
        id: 'actions',
        name: 'str.actions',
        nameDefault: 'Actions',
        numeric: false,
        sortable: false,
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
            <Typography variant="body1" className={classes.tableHeaderItemText}>
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
        <Typography variant="body1" className={classes.tableHeaderItemText}>
          <FormattedMessage id={column.name} default={column.nameDefault} />
        </Typography>
      </TableCell>
    );
  }

  handleSorting = (property) => (event) => { // eslint-disable-line
    const orderBy = property;
    let order = SortBy.Descending.toLowerCase();

    if (this.state.orderBy === property && this.state.order === SortBy.Descending.toLowerCase()) {
      order = SortBy.Ascending.toLowerCase();
    }

    if (order === SortBy.Descending.toLowerCase()) {
      this.props.walletAddresses.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1));
    } else {
      this.props.walletAddresses.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));
    }

    this.setState({
      order,
      orderBy,
    });
  }

  getTableBody() {
    const { classes, walletAddresses } = this.props;

    return (
      <TableBody>
        {walletAddresses.map((item, index) =>
          (<TableRow key={item.address} selected={index % 2 !== 0}>
            <TableCell>
              <Typography variant="body1">{item.address}</Typography>
            </TableCell>
            <TableCell>
              <CopyToClipboard text={item.address} onCopy={this.onCopyClicked}>
                <Button size="small" className={classes.tableRowCopyButton}>
                  <ContentCopy className={classes.tableRowCopyButtonIcon} />
                  <Typography variant="body1" className={classes.tableRowCopyButtonText}>
                    <FormattedMessage id="str.copy" defaultMessage="Copy" />
                  </Typography>
                </Button>
              </CopyToClipboard>
            </TableCell>
            <TableCell numeric>
              <Typography variant="body1">{item.qtum}</Typography>
            </TableCell>
            <TableCell numeric>
              <Typography variant="body1">{item.bot}</Typography>
            </TableCell>
            <TableCell>
              <Button
                variant="raised"
                color="primary"
                size="small"
                className={classes.tableRowActionButton}
                onClick={this.onDepositClicked}
                data-address={item.address}
                data-qtum={item.qtum}
                data-bot={item.bot}
              >
                <FormattedMessage id="myBalances.deposit" defaultMessage="Deposit" />
              </Button>
              <Button
                variant="raised"
                color="primary"
                size="small"
                className={classes.tableRowActionButton}
                onClick={this.onWithdrawClicked}
                data-address={item.address}
                data-qtum={item.qtum}
                data-bot={item.bot}
              >
                <FormattedMessage id="str.withdraw" defaultMessage="Withdraw" />
              </Button>
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

  onDepositClicked(event) {
    this.setState({
      selectedAddress: event.currentTarget.getAttribute('data-address'),
      selectedAddressQtum: event.currentTarget.getAttribute('data-qtum'),
      selectedAddressBot: event.currentTarget.getAttribute('data-bot'),
      depositDialogVisible: true,
    });

    Tracking.track('myWallet-depositDialogOpen');
  }

  handleDepositDialogClose = () => {
    this.setState({
      selectedAddress: undefined,
      selectedAddressQtum: undefined,
      selectedAddressBot: undefined,
      depositDialogVisible: false,
    });
  };

  onWithdrawClicked(event) {
    const { walletEncrypted, walletUnlockedUntil, toggleWalletUnlockDialog } = this.props;
    if (doesUserNeedToUnlockWallet(walletEncrypted, walletUnlockedUntil)) {
      toggleWalletUnlockDialog(true);
    } else {
      this.setState({
        selectedAddress: event.currentTarget.getAttribute('data-address'),
        selectedAddressQtum: event.currentTarget.getAttribute('data-qtum'),
        selectedAddressBot: event.currentTarget.getAttribute('data-bot'),
        withdrawDialogVisible: true,
      });

      Tracking.track('myWallet-withdrawDialogOpen');
    }
  }

  handleWithdrawDialogClose = () => {
    this.setState({
      selectedAddress: undefined,
      selectedAddressQtum: undefined,
      selectedAddressBot: undefined,
      withdrawDialogVisible: false,
    });
  };

  onWithdraw() {
    this.setState({
      withdrawDialogVisible: false,
    });
  }

  onAddrCopiedSnackbarClosed() {
    this.setState({
      addrCopiedSnackbarVisible: false,
    });
  }
}
