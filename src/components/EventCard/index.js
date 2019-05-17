import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import { Grid, Card, Divider, Typography, withStyles } from '@material-ui/core';
import cx from 'classnames';
import { sum, filter } from 'lodash';
import { EVENT_STATUS, EventWarningType, TransactionStatus, TransactionType } from 'constants';

import FavoriteButton from './FavoriteButton';
import EventWarning from '../EventWarning';
import styles from './styles';
import { getEndTimeCountDownString } from '../../helpers';
import carousel from '../../scenes/Event/components/Leaderboard/carousel';

const { CREATED, BETTING, ORACLE_RESULT_SETTING, OPEN_RESULT_SETTING, ARBITRATION, WITHDRAWING } = EVENT_STATUS;
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
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    onClick: PropTypes.func,
  };

  static defaultProps = {
    onClick: null,
  };

  getAmountLabel = () => {
    const { status, token, amounts, nakaAmount, nbotAmount } = this.props.event;
    switch (status) {
      case CREATED:
      case BETTING:
      case ORACLE_RESULT_SETTING:
      case OPEN_RESULT_SETTING:
      case ARBITRATION:
      case WITHDRAWING: {
        const amount = parseFloat(sum(amounts).toFixed(2));
        return `${amount} ${token}`;
      }
      default: {
        console.error(`Unhandled status: ${status}`); // eslint-disable-line
        break;
      }
    }
  }

  getButtonText = () => {
    const { status } = this.props.event;
    switch (status) {
      case CREATED:
      case BETTING: return messages.placeBet;
      case ORACLE_RESULT_SETTING:
      case OPEN_RESULT_SETTING: return messages.setResult;
      case ARBITRATION: return messages.arbitrate;
      case WITHDRAWING: return messages.withdraw;
      default: console.error(`Unhandled status: ${status}`); // eslint-disable-line
    }
  }

  get isWithdrawn() {
    const { event: { status, transactions } } = this.props;
    if (status !== WITHDRAWING) return false;
    const successTxs = filter(transactions, { status: TransactionStatus.SUCCESS, type: TransactionType.WITHDRAW });

    if (successTxs.length > 0) return true;
    return false;
  }

  getEndTime = () => {
    const { event, event: { status } } = this.props;
    switch (status) {
      case CREATED: return undefined;
      case BETTING: return event.betEndTime;
      case ORACLE_RESULT_SETTING: return event.resultSetEndTime;
      case OPEN_RESULT_SETTING: return event.resultSetEndTime;
      case ARBITRATION: return event.arbitrationEndTime;
      case WITHDRAWING: return undefined;
      default: console.error(`Unhandled status: ${status}`); // eslint-disable-line
    }
  }

  render() {
    const { classes, index, onClick, store: { ui, naka: { account } } } = this.props;
    const { name, isPending, isUpcoming, txid, status } = this.props.event;
    const { locale, messages: localeMessages, formatMessage } = this.props.intl;
    const amountLabel = this.getAmountLabel();
    const { currentTimeUnix } = ui;
    const endTime = this.getEndTime();

    return (
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Link to={`/event/${txid}`}>
          <Card className={classes.eventCard} onClick={onClick}>
            <div className={cx(classes.eventCardBg, `bg${index % 8}`)}></div>
            <div className={cx(classes.eventCardSection, 'top')}>
              {isPending() && status !== WITHDRAWING && <EventWarning id="str.pendingConfirmation" message="Pending Confirmation" />}
              {isUpcoming(account) && <EventWarning id="str.upcoming" message="Upcoming" type={EventWarningType.ORANGE} />}
              {isPending() && status === WITHDRAWING && <EventWarning id="str.withdrawing" message="Withdrawning" type={EventWarningType.INFO} />}
              {this.isWithdrawn && <EventWarning id="str.withdrawn" message="Withdrawn" type={EventWarningType.INFO} />}
              <div className={classes.eventCardNameBundle}>
                <div className={classes.eventCardNameFlex}>
                  <Typography variant="h6" className={classes.eventCardName}>
                    {name}
                  </Typography>
                </div>
                <FavoriteButton event={this.props.event} />
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
                    ? <Fragment>{getEndTimeCountDownString(endTime - currentTimeUnix, locale, localeMessages)}</Fragment>
                    : <FormattedMessage id="str.end" defaultMessage="Ended" />
                  }
                </div>
              </div>
            </div>
            <Divider />
            <div className={cx(classes.eventCardSection, 'button')}>
              {isUpcoming(account)
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
