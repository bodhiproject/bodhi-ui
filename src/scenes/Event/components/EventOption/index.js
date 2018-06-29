import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
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
import { Phases } from 'constants';
import NP from 'number-precision';

import Progress from '../Progress';
import styles from './styles';
import { toFixed } from '../../../../helpers/utility';


@withStyles(styles, { withTheme: true })
@inject('store')
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

  handleAmountBlur = ({ target: { value } }) => {
    let { phase, amount, consensusThreshold, onAmountChange } = this.props; // eslint-disable-line
    if (phase === Phases.VOTING) {
      [amount, consensusThreshold] = [parseFloat(amount, 10), parseFloat(consensusThreshold, 10)];
      if (amount + Number(value) > consensusThreshold) {
        const val = toFixed(NP.minus(consensusThreshold, amount));
        onAmountChange(val);
      }
    }
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
      skipExpansion,
      unconfirmedEvent,
      showAmountInput,
      isPrevResult,
      isFinalizing,
      token,
      voteAmount,
      amountInputDisabled,
      lastUsedAddress,
      onAmountChange,
      onWalletChange,
      onOptionChange,
      store,
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
            onChange={(e, expanded) => onOptionChange(expanded ? optionIdx : -1)}
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
                  {isPrevResult ? (
                    <FormattedMessage
                      id="oracle.optionIsPrevResult"
                      defaultMessage="This option was set as the result in the previous round"
                    />
                  ) : amount}
                </Typography>
              </div>
            </ExpansionPanelSummary>
            {showAmountInput && (
              <Fragment>
                <AmountInput
                  token={token}
                  disabled={amountInputDisabled}
                  classes={classes}
                  value={voteAmount}
                  onChange={e => onAmountChange(parseFloat(e.target.value))}
                  onBlur={this.handleAmountBlur}
                />
                <AddressSelect
                  wallet={store.wallet}
                  token={token}
                  classes={classes}
                  value={lastUsedAddress}
                  onChange={e => onWalletChange(e.target.value)}
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
