/* eslint-disable */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import { Grid, Card, Divider, Typography, withStyles } from '@material-ui/core';
import cx from 'classnames';
import { filter } from 'lodash';
import { EventWarningType, TransactionStatus, TransactionType, EVENT_STATUS } from 'constants';
import { FavoriteButton, RaisedAmount, CountdownTime, Option, TimeCorner } from 'components';
import EventWarning from '../EventWarning';
import styles from './styles';

const { CREATED, BETTING, ORACLE_RESULT_SETTING, OPEN_RESULT_SETTING, ARBITRATION, WITHDRAWING } = EVENT_STATUS;
const messages = defineMessages({
  pending: { id: 'str.pending', defaultMessage: 'Pending' },
  placeBet: { id: 'bottomButtonText.placeBet', defaultMessage: 'Place Bet' },
  setResult: { id: 'str.setResult', defaultMessage: 'Set Result' },
  arbitrate: { id: 'bottomButtonText.arbitrate', defaultMessage: 'Arbitrate' },
  withdraw: { id: 'str.withdraw', defaultMessage: 'Withdraw' },
  archived: { id: 'bottomButtonText.archived', defaultMessage: 'Archived' },
  creating: { id: 'card.creating', defaultMessage: 'Creating' },
  predictionComingSoon: { id: 'card.predictionComingSoon', defaultMessage: 'Prediction Coming Soon' },
  predictionInProgress: { id: 'card.predictionInProgress', defaultMessage: 'Prediction In Progress' },
  resultSettingComingSoon: { id: 'card.resultSettingComingSoon', defaultMessage: 'Result Setting Coming Soon' },
  resultSettingInProgress: { id: 'card.resultSettingInProgress', defaultMessage: 'Result Setting In Progress' },
  arbitrationInProgress: { id: 'card.arbitrationInProgress', defaultMessage: 'Arbitration In Progress' },
  finished: { id: 'card.finished', defaultMessage: 'Finished' },
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

  renderOptions = () => {
    const { classes, event: { results, status } } = this.props;
    // console.log('TCL: EventCard -> renderOptions -> results', results);
    console.log('TCL: EventCard -> renderOptions -> this.props', this.props);
    return (
      <Grid className={classes.optionGrid}>
        {results.map((option, i) => (
          (status !== EVENT_STATUS.BETTING || (status === EVENT_STATUS.BETTING && i !== 0)) &&
          <Option
            key={i}
            option={option}
            // disabled={isWithdrawing}
            // amountInputDisabled={isResultSetting}
          />
        ))}
      </Grid>
    );
  }

  render() {
    const { classes, index, onClick, store: { naka: { account } } } = this.props;
    const { address, name, isPending, isUpcoming, url, status, totalBets, getEndTime, getEventDesc } = this.props.event;
    const { formatMessage } = this.props.intl;
    console.log(getEndTime());
    return (
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Link to={url}>
          <Card className={classes.eventCard} onClick={onClick}>
            <div className={cx(classes.eventCardBg, `bg${index % 8}`)}></div>
            <div className={cx(classes.eventCardSection, 'top')}>
              {isPending() && status !== WITHDRAWING && <EventWarning id="str.pendingConfirmation" message="Pending Confirmation" />}
              {isUpcoming(account) && <EventWarning id="str.upcoming" message="Upcoming" type={EventWarningType.ORANGE} />}
              {isPending() && status === WITHDRAWING && <EventWarning id="str.withdrawing" message="Withdrawning" type={EventWarningType.INFO} />}
              {this.isWithdrawn && <EventWarning id="str.withdrawn" message="Withdrawn" type={EventWarningType.INFO} />}
              <div>{<EventWarning id={messages[getEventDesc()].id} message={messages[getEventDesc()].defaultMessage} type={EventWarningType.INFO} />}</div>
              <div className={classes.eventCardNameBundle}>
                <div className={classes.eventCardNameFlex}>
                  <Typography variant="h6" className={classes.eventCardName}>
                    {name}
                  </Typography>
                </div>
                <FavoriteButton eventAddress={address} />
              </div>
              <div className={classes.eventCardInfoItem}>
                <RaisedAmount amount={totalBets} />
              </div>
              <Grid container className={classes.alignBottom}>
                <Grid item xs={8} className={classes.rowLeft}>
                  {this.renderOptions()}
                </Grid>
                <Grid item xs={4}>
                <div className={classes.eventCardInfo}>
                <div className={classes.eventCardInfoItem}>
                  {/* <CountdownTime endTime={getEndTime()} /> */}
                  <TimeCorner endTime={getEndTime()} />
                </div>
              </div>
                </Grid>
              </Grid>


            </div>
          </Card>
        </Link>
      </Grid>
    );
  }
}
