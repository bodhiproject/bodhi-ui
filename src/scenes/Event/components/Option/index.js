import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
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
import { injectIntl } from 'react-intl';

import Progress from '../Progress';
import styles from './styles';


/**
 * The new EventOption
 * TODO: this needs to be refactored...
 * logic is hard to follow
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
    } = this.props;

    const name = option.name === 'Invalid' ? intl.formatMessage({ id: 'invalid' }) : option.name;
    const { isPrevResult, percent, isLast, isFirst, isExpanded, idx, value, token } = option;
    const { oraclePage, wallet } = store;
    const { selectedOptionIdx } = oraclePage;

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
            onChange={option.toggleExpansion}
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
                  {isPrevResult ? intl.formatMessage({ id: 'oracle.optionIsPrevResult' }) : value}
                </Typography>
              </div>
            </ExpansionPanelSummary>
            {showAmountInput && (
              <Fragment>
                <AmountInput
                  token={token}
                  disabled={amountInputDisabled}
                  classes={classes}
                  value={oraclePage.amount}
                  onChange={({ target }) => oraclePage.amount = target.value}
                  onBlur={oraclePage.fixAmount}
                />
                <AddressSelect
                  wallet={wallet}
                  token={token}
                  classes={classes}
                  value={wallet.lastUsedAddress}
                  onChange={e => wallet.lastUsedAddress = e.target.value}
                />
              </Fragment>
            )}
          </ExpansionPanel>
        </div>
      </Collapse>
    );
  }
}

const AmountInput = ({ classes, token, ...props }) => (
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
          type="number"
          placeholder="0.00"
          className={classes.eventOptionInput}
          endAdornment={<InputAdornment position="end">{token}</InputAdornment>}
          {...props}
        />
      </FormControl>
    </div>
  </ExpansionPanelDetails>
);

const AddressSelect = observer(({ classes, wallet, ...props }) => (
  <ExpansionPanelDetails>
    <div className={cx(classes.eventOptionWrapper, 'noMargin', 'last')}>
      <div className={classes.eventOptionIcon}>
        <i className="icon iconfont icon-ic_wallet"></i>
      </div>
      <FormControl fullWidth>
        <InputLabel htmlFor="address" shrink>
          ADDRESS
        </InputLabel>
        <Select inputProps={{ id: 'address' }} {...props}>
          {wallet.addresses.map(({ address, bot, qtum }) => (
            <MenuItem key={address} value={address}>
              {`${address} (${qtum ? Number(qtum).toFixed(2) : 0} QTUM, ${bot ? Number(bot).toFixed(2) : 0} BOT)`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  </ExpansionPanelDetails>
));
