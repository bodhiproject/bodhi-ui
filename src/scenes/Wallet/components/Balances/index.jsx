import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Table, { TableBody, TableCell, TableHead, TableRow, TableSortLabel } from 'material-ui/Table';
import Tooltip from 'material-ui/Tooltip';
import Button from 'material-ui/Button';
import ContentCopy from 'material-ui-icons/ContentCopy';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import _ from 'lodash';

import styles from './styles';

const mockData = [
  {
    address: 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy',
    qtum: 100,
    bot: 200,
  },
  {
    address: 'qKoxAUEQ1Nj6anwes6ZjRGQ7aqdiyUeat8',
    qtum: 526,
    bot: 835,
  },
  {
    address: 'qTumW1fRyySwmoPi12LpFyeRj8W6mzUQA3',
    qtum: 867,
    bot: 263,
  },
  {
    address: 'qbyAYsQQf7U4seauDv9cYjwfiNrR9fJz3R',
    qtum: 362,
    bot: 953,
  },
];

class MyBalances extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: 'asc',
      orderBy: 'address',
      data: [],
    };

    this.getTotalsGrid = this.getTotalsGrid.bind(this);
    this.getTableHeader = this.getTableHeader.bind(this);
    this.getSortableCell = this.getSortableCell.bind(this);
    this.getNonSortableCell = this.getNonSortableCell.bind(this);
    this.getTableBody = this.getTableBody.bind(this);
  }

  componentWillMount() {
    this.setState({
      data: mockData,
    });
  }

  render() {
    const { classes } = this.props;
    const { data } = this.state;

    return (
      <Paper className={classes.rootPaper}>
        <Grid container spacing={0} className={classes.containerGrid}>
          <Typography variant="title" className={classes.myBalanceTitle}>
            <FormattedMessage id="myBalances.myBalance" />
          </Typography>
          {this.getTotalsGrid(data)}
          <Table className={classes.table}>
            {this.getTableHeader()}
            {this.getTableBody(data)}
          </Table>
        </Grid>
      </Paper>
    );
  }

  getTotalsGrid(data) {
    const { classes } = this.props;

    const totalQtum = _.sumBy(data, (address) => address.qtum ? address.qtum : 0);
    const totalBot = _.sumBy(data, (address) => address.bot ? address.bot : 0);

    const items = [
      {
        id: 'qtum',
        name: 'myBalances.qtum',
        total: totalQtum,
      },
      {
        id: 'bot',
        name: 'myBalances.bot',
        total: totalBot,
      },
    ];

    return (
      <Grid container classname={classes.totalsContainerGrid}>
        {items.map((item) => (
          <Grid item key={item.id} className={classes.totalsItemGrid}>
            <Typography className={classes.totalsItemAmount}>{item.total}</Typography>
            <Typography variant="body1">
              <FormattedMessage id={item.name} />
            </Typography>
          </Grid>
        ))}
      </Grid>
    );
  }

  getTableHeader() {
    const { classes } = this.props;

    const cols = [
      {
        id: 'address',
        name: 'myBalances.address',
        numeric: false,
        sortable: true,
      },
      {
        id: 'copyButton',
        name: 'myBalances.copy',
        numeric: false,
        sortable: false,
      },
      {
        id: 'qtum',
        name: 'myBalances.qtum',
        numeric: true,
        sortable: true,
      },
      {
        id: 'bot',
        name: 'myBalances.bot',
        numeric: true,
        sortable: true,
      },
      {
        id: 'actions',
        name: 'myBalances.actions',
        numeric: false,
        sortable: false,
      },
    ];

    return (
      <TableHead>
        <TableRow className={classes.tableHeader}>
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
          title="Sort"
          enterDelay={300}
        >
          <TableSortLabel
            active={orderBy === column.id}
            direction={order}
            onClick={this.createSortHandler(column.id)}
          >
            <Typography variant="body1" className={classes.tableHeaderItemText}>
              <FormattedMessage id={column.name} />
            </Typography>
          </TableSortLabel>
        </Tooltip>
      </TableCell>
    );
  }

  getNonSortableCell(column) {
    const { classes } = this.props;
    const { order, orderBy } = this.state;

    return (
      <TableCell
        key={column.id}
        numeric={column.numeric}
      >
        <Typography variant="body1" className={classes.tableHeaderItemText}>
          <FormattedMessage id={column.name} />
        </Typography>
      </TableCell>
    );
  }

  createSortHandler = (property) => (event) => {
    this.handleSorting(event, property);
  };

  handleSorting(event, property) {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    const data = order === 'desc'
      ? this.state.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
      : this.state.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({ data, order, orderBy });
  }

  getTableBody(data) {
    const { classes } = this.props;

    return (
      <TableBody>
        {data.map((item, index) => {
          const className = index % 2 === 0 ? classes.tableRow : classNames(classes.tableRow, 'dark');

          return (<TableRow key={item.address} className={className}>
            <TableCell>
              <Typography variant="body1">{item.address}</Typography>
            </TableCell>
            <TableCell>
              <Button size="small" className={classes.tableRowCopyButton}>
                <ContentCopy className={classes.tableRowCopyButtonIcon} />
                <Typography variant="body1" className={classes.tableRowCopyButtonText}>
                  <FormattedMessage id="myBalances.copy" />
                </Typography>
              </Button>
            </TableCell>
            <TableCell numeric>
              <Typography variant="body1">{item.qtum}</Typography>
            </TableCell>
            <TableCell numeric>
              <Typography variant="body1">{item.bot}</Typography>
            </TableCell>
            <TableCell>
              <Button variant="raised" color="primary" size="small" className={classes.tableRowActionButton}>
                <FormattedMessage id="myBalances.deposit" />
              </Button>
              <Button variant="raised" color="primary" size="small" className={classes.tableRowActionButton}>
                <FormattedMessage id="myBalances.withdraw" />
              </Button>
            </TableCell>
          </TableRow>);
        })}
      </TableBody>
    );
  }
}

MyBalances.propTypes = {
  classes: PropTypes.object.isRequired,
};

MyBalances.defaultProps = {
};

const mapStateToProps = (state) => ({
});

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(injectIntl(MyBalances)));
