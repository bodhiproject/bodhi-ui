import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
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
    marginBottom: 4,
  },
  panelSummary: {
    background: '#F9F9F9',
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    borderRadius: 4,
  },
});

const buttonColStyle = {
  width: 50,
};
const expanded = true;

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
    const {
      header,
    } = this.state;

    return (
      <Paper className={classes.root} margin={4}>
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary className={classes.panelSummary} expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.header}>{header}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Address</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell style={buttonColStyle}></TableCell>
                  <TableCell style={buttonColStyle}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.data.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{item.address}</TableCell>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell style={buttonColStyle}>
                      <Button className={classes.button} size="small" variant="raised">Deposit</Button>
                    </TableCell>
                    <TableCell style={buttonColStyle}>
                      <Button className={classes.button} size="small" variant="raised">Withdraw</Button>
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
  header: PropTypes.string,
};

BalanceList.defaultProps = {
  header: undefined,
};

export default withStyles(styles)(BalanceList);
