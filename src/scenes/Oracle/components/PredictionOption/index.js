import React, { PropTypes } from 'react';
import ExpansionPanel, {
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  ExpansionPanelActions,
} from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import AttachMoneyIcon from 'material-ui-icons/AttachMoney';
import AccountBalanceWalletIcon from 'material-ui-icons/AccountBalanceWallet';
import Select from 'material-ui/Select';
import classNames from 'classnames';
import { LinearProgress } from 'material-ui/Progress';
import { withStyles } from 'material-ui/styles';

import styles from './styles';

class PredictionOption extends React.PureComponent {
  render() {
    const { classes } = this.props;

    return (
      <ExpansionPanel>
        <ExpansionPanelSummary>
          <div className={classes.predictionOptionWrapper}>
            <div className={classes.predictionOptionNum}>1</div>
            <Typography variant="title">
              Bloomberg
            </Typography>
            <div className={classes.predictionOptionProgress}>
              <LinearProgress color="secondary" variant="determinate" value={60} />
              <div className={classes.predictionOptionProgressNum}>61%</div>
            </div>
            <Typography variant="body1">
              134,545,059 QTUM
            </Typography>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div className={classNames(classes.predictionOptionWrapper, 'noMargin')}>
            <div className={classes.predictionOptionIcon}>
              <AttachMoneyIcon />
            </div>
            <FormControl fullWidth>
              <InputLabel htmlFor="amount" shrink>
                AMOUNT
              </InputLabel>
              <Input
                id="vote-amount"
                value={0}
                type="number"
                placeholder="0.00"
                className={classes.predictionOptionInput}
                endAdornment={<InputAdornment position="end">QTUM</InputAdornment>}
              />
            </FormControl>
          </div>
        </ExpansionPanelDetails>
        <ExpansionPanelDetails>
          <div className={classNames(classes.predictionOptionWrapper, 'noMargin', 'last')}>
            <div className={classes.predictionOptionIcon}>
              <AccountBalanceWalletIcon />
            </div>
            <FormControl fullWidth>
              <InputLabel htmlFor="address" shrink>
                ADDRESS
              </InputLabel>
              <Select
                native
                value={0}
                inputProps={{
                  id: 'address',
                }}
              >
                <option value={10}>qSzPLfPsHP6ChX2jxEyy8637JiBXtn5piS</option>
                <option value={20}>aSzPLfPsHP6ChX2jxEyy8637JiBXtn5piS</option>
                <option value={30}>bSzPLfPsHP6ChX2jxEyy8637JiBXtn5piS</option>
              </Select>
            </FormControl>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

PredictionOption.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(PredictionOption);
