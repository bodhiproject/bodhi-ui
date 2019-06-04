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
    const { isPrevResult, percent, userPercent, isLast, isFirst, isExpanded, idx, value, userValue, token, phase } = option;
    const { eventPage } = store;
    const { selectedOptionIdx } = eventPage;

    return (
      <Collapse in={isExpanded(selectedOptionIdx) || selectedOptionIdx === -1 || skipExpansion}>
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
            classes={{ root: classes.expansionPanelRoot }}
          >
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} classes={{ root: classes.expansionPanelSummaryRoot, content: classes.expansionPanelSummaryContent, expandIcon: classes.expandIcon }}>
              <div className={classes.eventOptionWrapper}>
                <Typography variant="h6" className={classes.overText}>
                  {name}
                </Typography>
                <div className={classes.eventOptionProgress}>
                  <Progress
                    color="secondary"
                    invalid={name === 'Invalid'}
                    variant="buffer"
                    value={userPercent}
                    valueBuffer={percent}
                  />
                  <div className={classes.eventOptionProgressNum}>{percent}%<br></br><span>{value}</span></div>
                </div>
                <Typography variant="body2">
                  {`You bet ${userValue} NBOT`}
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
            <InputAdornment position="end">{Token.NBOT}</InputAdornment>
          }
          {...props}
        />
        {!!error && <FormHelperText error>{error}</FormHelperText>}
      </FormControl>
    </div>
  </ExpansionPanelDetails>
);

