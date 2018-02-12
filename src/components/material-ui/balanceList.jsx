import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import ExpansionPanel, { ExpansionPanelSummary, ExpansionPanelDetails } from 'material-ui/ExpansionPanel';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Table, { TableHead, TableBody, TableRow, TableCell } from 'material-ui/Table';
import Button from 'material-ui/Button';

const styles = (theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit,
    overflow: 'hidden',
  },
  panelSummary: {
    background: '#F9F9F9',
  },
  header: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  cellAddress: {
    width: '40%',
  },
  cellAmount: {
    width: '50%',
  },
  cellButton: {
    width: '10%',
  },
  button: {
    borderRadius: 8,
    margin: theme.spacing.unit,
  },
});

class BalanceList extends React.Component {
  constructor(props, context) {
    super(props, context);

    const {
      header,
    } = this.props;

    this.state = {
      header,
      data: [{
        id: '0',
        address: 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy',
        amount: 12345,
      }, {
        id: '1',
        address: 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy',
        amount: 12345,
      }, {
        id: '2',
        address: 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy',
        amount: 12345,
      }, {
        id: '3',
        address: 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy',
        amount: 12345,
      }],
    };
  }

  render() {
    const { classes } = this.props;
    const { header } = this.state;

    return (
      <Paper className={classes.root} margin={4}>
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary className={classes.panelSummary} expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.header}>{header}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.cellAddress} variant="head">Address</TableCell>
                  <TableCell className={classes.cellAmount} variant="head">Amount</TableCell>
                  <TableCell className={classes.cellButton} variant="head"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.data.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell className={classes.cellAddress} variant="body">{item.address}</TableCell>
                    <TableCell className={classes.cellAmount} variant="body">{item.amount}</TableCell>
                    <TableCell className={classes.cellButton} variant="body">
                      <div style={{ display: 'flex' }}>
                        <Button className={classes.button} size="small" color="primary">Deposit</Button>
                        <Button className={classes.button} size="small" color="secondary">Withdraw</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Paper>
    );
  }
}

BalanceList.propTypes = {
  classes: PropTypes.object.isRequired,
  header: PropTypes.string.isRequired,
};

BalanceList.defaultProps = {
};

export default withStyles(styles)(BalanceList);
