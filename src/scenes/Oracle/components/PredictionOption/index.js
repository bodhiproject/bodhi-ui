import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Collapse from 'material-ui/transitions/Collapse';
import ExpansionPanel, {
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  ExpansionPanelActions,
} from 'material-ui/ExpansionPanel';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import AttachMoneyIcon from 'material-ui-icons/AttachMoney';
import AccountBalanceWalletIcon from 'material-ui-icons/AccountBalanceWallet';
import Select from 'material-ui/Select';
import Typography from 'material-ui/Typography';
import classNames from 'classnames';
import { LinearProgress } from 'material-ui/Progress';
import { withStyles } from 'material-ui/styles';

import styles from './styles';

class PredictionOption extends React.PureComponent {
  constructor(props) {
    super(props);

    this.renderAmountInput = this.renderAmountInput.bind(this);
    this.renderAddrSelect = this.renderAddrSelect.bind(this);
    this.handleExpansionChange = this.handleExpansionChange.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleAddrChange = this.handleAddrChange.bind(this);
  }

  render() {
    const {
      classes,
      isLast,
      currentOptionIdx,
      optionIdx,
      name,
      amount,
      percent,
      voteAmount,
      token,
      walletAddrs,
      currentWalletIdx,
      skipExpansion,
      showAmountInput,
    } = this.props;

    console.log(skipExpansion);

    return (
      <Collapse in={(optionIdx === currentOptionIdx || currentOptionIdx === -1) && !skipExpansion}>
        <div
          className={classNames(
            classes.predictionOptionCollapse,
            isLast || optionIdx === currentOptionIdx ? 'last' : '',
            optionIdx === 0 || optionIdx === currentOptionIdx ? 'first' : ''
          )}
        >
          <ExpansionPanel expanded={optionIdx === currentOptionIdx && !skipExpansion} onChange={this.handleExpansionChange}>
            <ExpansionPanelSummary>
              <div className={classes.predictionOptionWrapper}>
                <div className={classes.predictionOptionNum}>{optionIdx + 1}</div>
                <Typography variant="title">
                  {name}
                </Typography>
                <div className={classes.predictionOptionProgress}>
                  <LinearProgress color="secondary" variant="determinate" value={percent} />
                  <div className={classes.predictionOptionProgressNum}>{percent}%</div>
                </div>
                <Typography variant="body1">
                  {amount}
                </Typography>
              </div>
            </ExpansionPanelSummary>
            { showAmountInput ? this.renderAmountInput() : null }
            { showAmountInput ? this.renderAddrSelect() : null }
          </ExpansionPanel>
        </div>
      </Collapse>
    );
  }

  renderAmountInput() {
    const {
      classes,
      voteAmount,
      token,
    } = this.props;

    return (<ExpansionPanelDetails>
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
            value={voteAmount}
            type="number"
            placeholder="0.00"
            className={classes.predictionOptionInput}
            onChange={this.handleAmountChange}
            endAdornment={<InputAdornment position="end">{token}</InputAdornment>}
          />
        </FormControl>
      </div>
    </ExpansionPanelDetails>);
  }

  renderAddrSelect() {
    const {
      classes,
      walletAddrs,
      currentWalletIdx,
    } = this.props;

    return (<ExpansionPanelDetails>
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
            value={currentWalletIdx}
            onChange={this.handleAddrChange}
            inputProps={{
              id: 'address',
            }}
          >
            {walletAddrs.map((item, index) => (
              <option value={index}>{item.address}</option>
            ))}
          </Select>
        </FormControl>
      </div>
    </ExpansionPanelDetails>);
  }

  handleExpansionChange(event, expanded) {
    const {
      optionIdx,
      onOptionChange,
    } = this.props;

    onOptionChange(expanded ? optionIdx : -1);
  }

  handleAmountChange(event) {
    const {
      onAmountChange,
    } = this.props;

    onAmountChange(event.target.value);
  }

  handleAddrChange(event) {
    const {
      onWalletChange,
    } = this.props;

    onWalletChange(event.target.value);
  }
}

PredictionOption.propTypes = {
  classes: PropTypes.object.isRequired,
  isLast: PropTypes.bool.isRequired,
  currentOptionIdx: PropTypes.number.isRequired,
  optionIdx: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  percent: PropTypes.number.isRequired,
  voteAmount: PropTypes.number.isRequired,
  token: PropTypes.string.isRequired,
  onOptionChange: PropTypes.func.isRequired,
  onAmountChange: PropTypes.func.isRequired,
  onWalletChange: PropTypes.func.isRequired,
  walletAddrs: PropTypes.array.isRequired,
  currentWalletIdx: PropTypes.number.isRequired,
  skipExpansion: PropTypes.bool.isRequired,
  showAmountInput: PropTypes.bool.isRequired,
};

export default withStyles(styles, { withTheme: true })(PredictionOption);
