import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Collapse,
  withStyles,
  MenuItem,
  Select,
  Typography,
  FormControl,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Input,
  InputLabel,
  InputAdornment,
} from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import cx from 'classnames';
import { FormattedMessage } from 'react-intl';

import Progress from '../Progress';
import styles from './styles';


@withStyles(styles, { withTheme: true })
export default class EventOption extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    isLast: PropTypes.bool.isRequired,
    currentOptionIdx: PropTypes.number.isRequired,
    optionIdx: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    percent: PropTypes.number.isRequired,
    voteAmount: PropTypes.number,
    token: PropTypes.string.isRequired,
    onOptionChange: PropTypes.func.isRequired,
    onAmountChange: PropTypes.func.isRequired,
    onWalletChange: PropTypes.func.isRequired,
    walletAddresses: PropTypes.array.isRequired,
    lastUsedAddress: PropTypes.string.isRequired,
    skipExpansion: PropTypes.bool.isRequired,
    unconfirmedEvent: PropTypes.bool.isRequired,
    showAmountInput: PropTypes.bool.isRequired,
    amountInputDisabled: PropTypes.bool.isRequired,
    isPrevResult: PropTypes.bool.isRequired,
    isFinalizing: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    voteAmount: 0,
  };

  render() {
    const {
      classes,
      isLast,
      currentOptionIdx,
      optionIdx,
      name,
      amount,
      percent,
      skipExpansion,
      unconfirmedEvent,
      showAmountInput,
      isPrevResult,
      isFinalizing,
    } = this.props;

    return (
      <Collapse in={(optionIdx === currentOptionIdx || currentOptionIdx === -1) || skipExpansion}>
        <div
          className={cx(classes.eventOptionCollapse, {
            last: isLast || optionIdx === currentOptionIdx,
            first: optionIdx === 0 || optionIdx === currentOptionIdx,
          })}
        >
          <ExpansionPanel
            expanded={optionIdx === currentOptionIdx || skipExpansion}
            onChange={this.handleExpansionChange}
            disabled={unconfirmedEvent || (!isFinalizing && isPrevResult) || (isFinalizing && !isPrevResult)}
          >
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <div className={classes.eventOptionWrapper}>
                <div className={classes.eventOptionNum}>{optionIdx + 1}</div>
                <Typography variant="title">
                  {name}
                </Typography>
                <div className={classes.eventOptionProgress}>
                  <Progress color="secondary" invalid={name === 'Invalid'} variant="determinate" value={percent} />
                  <div className={classes.eventOptionProgressNum}>{percent}%</div>
                </div>
                <Typography variant="body1">
                  {isPrevResult ?
                    <FormattedMessage
                      id="oracle.optionIsPrevResult"
                      defaultMessage="This option was set as the result in the previous round"
                    /> : amount
                  }
                </Typography>
              </div>
            </ExpansionPanelSummary>
            {showAmountInput && this.renderAmountInput()}
            {showAmountInput && this.renderAddrSelect()}
          </ExpansionPanel>
        </div>
      </Collapse>
    );
  }

  renderAmountInput = () => {
    const { classes, voteAmount, token, amountInputDisabled } = this.props;

    return (
      <ExpansionPanelDetails>
        <div className={cx(classes.eventOptionWrapper, 'noMargin')}>
          <div className={classes.eventOptionIcon}>
            <i className="icon iconfont icon-ic_token"></i>
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
              className={classes.eventOptionInput}
              onChange={this.handleAmountChange}
              endAdornment={<InputAdornment position="end">{token}</InputAdornment>}
              disabled={amountInputDisabled}
            />
          </FormControl>
        </div>
      </ExpansionPanelDetails>
    );
  }

  renderAddrSelect = () => {
    const { classes, walletAddresses, lastUsedAddress } = this.props;

    return (
      <ExpansionPanelDetails>
        <div className={cx(classes.eventOptionWrapper, 'noMargin', 'last')}>
          <div className={classes.eventOptionIcon}>
            <i className="icon iconfont icon-ic_wallet"></i>
          </div>
          <FormControl fullWidth>
            <InputLabel htmlFor="address" shrink>
              ADDRESS
            </InputLabel>
            <Select
              value={lastUsedAddress}
              onChange={this.handleAddrChange}
              inputProps={{ id: 'address' }}
            >
              {walletAddresses.map((item) => (
                <MenuItem key={item.address} value={item.address}>
                  {`${item.address} (${item.qtum ? item.qtum.toFixed(2) : 0} QTUM, ${item.bot ? item.bot.toFixed(2) : 0} BOT)`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </ExpansionPanelDetails>
    );
  }

  handleExpansionChange = (event, expanded) => {
    const { optionIdx, onOptionChange } = this.props;
    onOptionChange(expanded ? optionIdx : -1);
  }

  handleAmountChange = (event) => {
    const { onAmountChange } = this.props;
    onAmountChange(parseFloat(event.target.value));
  }

  handleAddrChange = (event) => {
    const { onWalletChange } = this.props;
    onWalletChange(event.target.value);
  }
}
