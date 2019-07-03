import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import {
  Collapse,
  withStyles,
  Typography,
  FormControl,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Input,
  InputLabel,
  InputAdornment,
  FormHelperText,
} from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import cx from 'classnames';
import { injectIntl, defineMessages } from 'react-intl';
import { Token } from 'constants';
import styles from './styles';
import Progress from '../Progress';
import { toFixed } from '../../../helpers/utility';

const messages = defineMessages({
  oracleOptionIsPrevResultMsg: {
    id: 'oracle.optionIsPrevResult',
    defaultMessage: 'This option was set as the result in the previous round',
  },
  invalidMsg: {
    id: 'invalid',
    defaultMessage: 'Invalid',
  },
  bet: {
    id: 'str.youBet',
    defaultMessage: 'You bet {value} NBOT',
  },
  vote: {
    id: 'str.youVote',
    defaultMessage: 'You vote {value} NBOT',
  },
  odds: {
    id: 'str.odds',
    defaultMessage: 'odds: {value}',
  },
  notAvailable: {
    id: 'str.notAvailable',
    defaultMessage: 'N/A',
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
      actionText,
      betSpecific,
    } = this.props;

    const name = option.name === 'Invalid' ? intl.formatMessage(messages.invalidMsg) : option.name;
    const { isPrevResult, percent, userPercent, isLast, isFirst, isExpanded, idx, value, userValue, token, phase, isBetting, odds } = option;
    const { eventPage } = store;
    const { selectedOptionIdx, isWithdrawing } = eventPage;

    return (
      <Collapse in={isWithdrawing || isExpanded(selectedOptionIdx) || selectedOptionIdx === -1 || skipExpansion}>
        <div
          className={cx(classes.eventOptionCollapse, {
            last: isLast || isExpanded(selectedOptionIdx),
            first: isFirst || isExpanded(selectedOptionIdx),
            is_result: isPrevResult,
          })}
        >
          <ExpansionPanel
            expanded={isExpanded(selectedOptionIdx) || skipExpansion}
            onChange={skipExpansion ? null : () => eventPage.setSelectedOption(idx)}
            disabled={option.disabled || disabled}
            classes={{ root: classes.expansionPanelRoot, disabled: classes.expansionPanelDisabled }}
          >
            <ExpansionPanelSummary
              expandIcon={isPrevResult ?
                <img src="/images/icon-tick_bordered.svg" alt='leaderboard' />
                : <ExpandMoreIcon />}
              classes={{
                root: classes.expansionPanelSummaryRoot,
                content: classes.expansionPanelSummaryContent,
                expandIcon: cx(classes.expandIcon, betSpecific && classes.hideIcon),
                disabled: classes.expansionPanelSummaryDisabled,
                expanded: classes.expansionPanelSummaryExpanded,
              }}
            >
              <div className={classes.eventOptionWrapper}>
                <div className={classes.eventOptionProgress}>
                  <div className={classes.textWrapper}>
                    <div className={classes.overText}>
                      <span>{name}</span>
                      <span>{`${toFixed(value)} NBOT`}</span>
                    </div>
                    <div className={classes.eventOptionProgressNum}>
                      <span>{`${toFixed(percent)}%`}</span>
                      {isBetting && <span>{intl.formatMessage(messages.odds, { value: odds ? toFixed(odds) : intl.formatMessage(messages.notAvailable) })}</span>}
                    </div>
                  </div>
                  <Progress
                    color={isBetting ? 'primary' : 'secondary'}
                    invalid={name === 'Invalid'}
                    variant="buffer"
                    value={userPercent}
                    valueBuffer={percent}
                  />
                </div>
                <Typography variant="body2">
                  {`${intl.formatMessage(messages[actionText], { value: toFixed(userValue) })}`}
                </Typography>
              </div>
            </ExpansionPanelSummary>
            {showAmountInput && (
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
            )}
          </ExpansionPanel>
        </div>
      </Collapse>
    );
  }
}

const AmountInput = ({ classes, token, phase, amountPlaceholder, error, ...props }) => (
  <ExpansionPanelDetails className={classes.expansionPanelDetails}>
    <div className={cx(classes.eventOptionWrapper, 'noMargin')}>
      <FormControl fullWidth>
        <InputLabel htmlFor="amount" shrink><i className="icon iconfont icon-ic_token"></i>{' AMOUNT'}</InputLabel>
        <Input
          id="vote-amount"
          type="number"
          placeholder={amountPlaceholder || '0.00'}
          className={classes.eventOptionInput}
          endAdornment={
            <InputAdornment position="end">{Token.NBOT}</InputAdornment>
          }
          {...props}
        />
        {!!error && <FormHelperText error>{error}</FormHelperText>}
      </FormControl>
    </div>
  </ExpansionPanelDetails>
);

