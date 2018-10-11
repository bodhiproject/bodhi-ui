import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Collapse, withStyles, MenuItem, Select, Typography, FormControl, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Input, InputLabel, InputAdornment, FormHelperText } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import cx from 'classnames';
import { injectIntl, defineMessages } from 'react-intl';
import { Phases, Token } from 'constants';

import Progress from '../Progress';
import styles from './styles';

const messages = defineMessages({
  oracleOptionIsPrevResultMsg: {
    id: 'oracle.optionIsPrevResult',
    defaultMessage: 'This option was set as the result in the previous round',
  },
  invalidMsg: {
    id: 'invalid',
    defaultMessage: 'Invalid',
  },
});

/**
 * Component for displaying the Event options that can be selected, bet on, etc.
 */
@withRouter
@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class Option extends Component {
  static defaultProps = {
    voteAmount: 0,
  };

  render() {
    const {
      classes,
      skipExpansion = false,
      showAmountInput = true,
      amountInputDisabled = false,
      store,
      option,
      intl,
      disabled,
      amountPlaceholder,
    } = this.props;

    const name = option.name === 'Invalid' ? intl.formatMessage(messages.invalidMsg) : option.name;
    const { isPrevResult, percent, isLast, isFirst, isExpanded, idx, value, token, phase } = option;
    const { eventPage, wallet } = store;
    const { selectedOptionIdx } = eventPage;

    return (
      <Collapse in={isExpanded || selectedOptionIdx === -1 || skipExpansion}>
        <div
          className={cx(classes.eventOptionCollapse, {
            last: isLast || isExpanded,
            first: isFirst || isExpanded,
            is_result: isPrevResult,
          })}
        >
          <ExpansionPanel
            expanded={isExpanded || skipExpansion}
            onChange={skipExpansion ? null : option.toggleExpansion}
            disabled={option.disabled || disabled}
          >
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <div className={classes.eventOptionWrapper}>
                <div className={classes.eventOptionNum}>{idx + 1}</div>
                <Typography variant="title">
                  {name}
                </Typography>
                <div className={classes.eventOptionProgress}>
                  <Progress color="secondary" invalid={name === 'Invalid'} variant="determinate" value={percent} />
                  <div className={classes.eventOptionProgressNum}>{percent}%</div>
                </div>
                <Typography variant="body1">
                  {isPrevResult ? intl.formatMessage(messages.oracleOptionIsPrevResultMsg) : value}
                </Typography>
              </div>
            </ExpansionPanelSummary>
            {showAmountInput && (
              <div>
                <AmountInput
                  token={token}
                  phase={phase}
                  disabled={amountInputDisabled}
                  classes={classes}
                  value={eventPage.amount}
                  onChange={({ target }) => eventPage.amount = target.value}
                  onBlur={eventPage.fixAmount}
                  amountPlaceholder={amountPlaceholder}
                  error={eventPage.error.amount && intl.formatMessage({ id: eventPage.error.amount })}
                />
                <AddressSelect
                  classes={classes}
                  value={wallet.currentAddress}
                  onChange={e => wallet.setCurrentWalletAddress(e.target.value)}
                  error={eventPage.error.address && intl.formatMessage({ id: eventPage.error.address })}
                />
              </div>
            )}
          </ExpansionPanel>
        </div>
      </Collapse>
    );
  }
}

const AmountInput = ({ classes, token, phase, amountPlaceholder, error, ...props }) => (
  <ExpansionPanelDetails>
    <div className={cx(classes.eventOptionWrapper, 'noMargin')}>
      <div className={classes.eventOptionIcon}>
        <i className="icon iconfont icon-ic_token"></i>
      </div>
      <FormControl fullWidth>
        <InputLabel htmlFor="amount" shrink>AMOUNT</InputLabel>
        <Input
          id="vote-amount"
          type="number"
          placeholder={amountPlaceholder || '0.00'}
          className={classes.eventOptionInput}
          endAdornment={
            <InputAdornment position="end">{phase === Phases.RESULT_SETTING ? Token.BOT : token}</InputAdornment>
          }
          {...props}
        />
        {!!error && <FormHelperText error>{error}</FormHelperText>}
      </FormControl>
    </div>
  </ExpansionPanelDetails>
);

const AddressSelect = inject('store')(observer(({ classes, store: { wallet: { addresses } }, error, ...props }) => (
  <ExpansionPanelDetails>
    <div className={cx(classes.eventOptionWrapper, 'noMargin', 'last')}>
      <div className={classes.eventOptionIcon}>
        <i className="icon iconfont icon-ic_wallet"></i>
      </div>
      <FormControl fullWidth>
        <InputLabel htmlFor="address" shrink>ADDRESS</InputLabel>
        <Select inputProps={{ id: 'address' }} {...props}>
          {addresses.map(({ address, bot, qtum }) => (
            <MenuItem key={address} value={address}>
              {`${address} (${qtum ? Number(qtum).toFixed(2) : 0} QTUM, ${bot ? Number(bot).toFixed(2) : 0} BOT)`}
            </MenuItem>
          ))}
        </Select>
        {!!error && <FormHelperText error>{error}</FormHelperText>}
      </FormControl>
    </div>
  </ExpansionPanelDetails>
)));
