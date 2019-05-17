import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import { Grid, Card, Divider, Typography, withStyles } from '@material-ui/core';
import cx from 'classnames';
import { sum, filter } from 'lodash';
import { Phases, EventWarningType, TransactionStatus, TransactionType, EVENT_STATUS } from 'constants';
import { FavoriteButton } from 'components';
import EventWarning from '../EventWarning';
import styles from './styles';
import { getEndTimeCountDownString } from '../../helpers';
import carousel from '../../scenes/Event/components/Leaderboard/carousel';

const { BETTING, RESULT_SETTING, VOTING, WITHDRAWING } = Phases;
const messages = defineMessages({
  pending: { id: 'str.pending', defaultMessage: 'Pending' },
  placeBet: { id: 'bottomButtonText.placeBet', defaultMessage: 'Place Bet' },
  setResult: { id: 'str.setResult', defaultMessage: 'Set Result' },
  arbitrate: { id: 'bottomButtonText.arbitrate', defaultMessage: 'Arbitrate' },
  withdraw: { id: 'str.withdraw', defaultMessage: 'Withdraw' },
  archived: { id: 'bottomButtonText.archived', defaultMessage: 'Archived' },
});

@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class EventCard extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    endTime: PropTypes.string,
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    onClick: PropTypes.func,
  };

  static defaultProps = {
    endTime: undefined,
    onClick: null,
  };

  getAmountLabel = () => {
    const { status, token, amounts, nakaAmount, nbotAmount } = this.props.event;
    switch (status) {
      case EVENT_STATUS.CREATED:
      case EVENT_STATUS.BETTING:
      case EVENT_STATUS.ORACLE_RESULT_SETTING:
      case EVENT_STATUS.OPEN_RESULT_SETTING:
      case EVENT_STATUS.ARBITRATION:
      case EVENT_STATUS.WITHDRAWING: {
        const amount = parseFloat(sum(amounts).toFixed(2));
        return `${amount} ${token}`;
      }
      default: {
        console.error(`Unhandled phase: ${phase}`); // eslint-disable-line
        break;
      }
    }
  }

  getButtonText = () => {
    const { status } = this.props.event;
    switch (status) {
      case EVENT_STATUS.CREATED:
      case EVENT_STATUS.BETTING: return messages.placeBet;
      case EVENT_STATUS.ORACLE_RESULT_SETTING:
      case EVENT_STATUS.OPEN_RESULT_SETTING: return messages.setResult;
      case EVENT_STATUS.ARBITRATION: return messages.arbitrate;
      case EVENT_STATUS.WITHDRAWING: return messages.withdraw;
      default: console.error(`Unhandled phase: ${phase}`); // eslint-disable-line
    }
  }

  get isWithdrawn() {
    const { event: { phase, transactions } } = this.props;
    if (phase !== Phases.WITHDRAWING) return false;
    const successTxs = filter(transactions, { status: TransactionStatus.SUCCESS, type: TransactionType.WITHDRAW });

    if (successTxs.length > 0) return true;
    return false;
  }

  render() {
    const { classes, index, onClick, store: { ui } } = this.props;
    const { address, name, isPending, isUpcoming, txid, url, endTime, phase } = this.props.event;
    const { locale, messages: localeMessages, formatMessage } = this.props.intl;
    const amountLabel = this.getAmountLabel();
    const { currentTimeUnix } = ui;

    return (
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Link to={`/event/${txid}`}>
          <Card className={classes.eventCard} onClick={onClick}>
            <div className={cx(classes.eventCardBg, `bg${index % 8}`)}></div>
            <div className={cx(classes.eventCardSection, 'top')}>
              {isPending && phase !== WITHDRAWING && <EventWarning id="str.pendingConfirmation" message="Pending Confirmation" />}
              {isUpcoming && <EventWarning id="str.upcoming" message="Upcoming" type={EventWarningType.ORANGE} />}
              {isPending && phase === WITHDRAWING && <EventWarning id="str.withdrawing" message="Withdrawning" type={EventWarningType.INFO} />}
              {this.isWithdrawn && <EventWarning id="str.withdrawn" message="Withdrawn" type={EventWarningType.INFO} />}
              <div className={classes.eventCardNameBundle}>
                <div className={classes.eventCardNameFlex}>
                  <Typography variant="h6" className={classes.eventCardName}>
                    {name}
                  </Typography>
                </div>
                <FavoriteButton eventAddress={address} />
              </div>
              <div className={classes.eventCardInfo}>
                {amountLabel && (
                  <div className={classes.eventCardInfoItem}>
                    <i className={cx(classes.dashBoardCardIcon, 'icon iconfont icon-ic_token')}></i>
                    {`${amountLabel} `}
                    <FormattedMessage id="str.raised" defaultMessage="Raised" />
                  </div>
                )}
                <div className={classes.eventCardInfoItem}>
                  <i className={cx(classes.dashBoardCardIcon, 'icon iconfont icon-ic_timer')}></i>
                  {endTime !== undefined
                    ? <Fragment>{getEndTimeCountDownString(this.props.event.endTime - currentTimeUnix, locale, localeMessages)}</Fragment>
                    : <FormattedMessage id="str.end" defaultMessage="Ended" />
                  }
                </div>
              </div>
            </div>
            <Divider />
            <div className={cx(classes.eventCardSection, 'button')}>
              {isUpcoming
                ? <FormattedMessage id="str.waitForResultSetting" defaultMessage="Waiting for result setting" />
                : formatMessage(this.getButtonText())
              }
            </div>
          </Card>
        </Link>
      </Grid>
    );
  }
}
