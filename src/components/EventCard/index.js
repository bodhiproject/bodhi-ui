import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import moment from 'moment';
import { Grid, Card, Typography, withStyles } from '@material-ui/core';
import cx from 'classnames';
import { filter } from 'lodash';
import { EventWarningType, TransactionStatus, TransactionType, EVENT_STATUS } from 'constants';
import { FavoriteButton, RaisedAmount, Option, TimeCorner } from 'components';
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

  getEventDesc = () => {
    const { status } = this.props.event;
    switch (status) {
      case EVENT_STATUS.CREATED: return 'creating';
      case EVENT_STATUS.BETTING: return moment().isBefore(moment.unix(this.betStartTime)) ? 'predictionComingSoon' : 'predictionInProgress';
      case EVENT_STATUS.ORACLE_RESULT_SETTING: return moment().isBefore(moment.unix(this.resultSetEndTime)) ? 'resultSettingComingSoon' : 'resultSettingInProgress';
      case EVENT_STATUS.OPEN_RESULT_SETTING: return 'resultSettingInProgress';
      case EVENT_STATUS.ARBITRATION: return 'arbitrationInProgress';
      case EVENT_STATUS.WITHDRAWING: return 'finished';
      default: throw Error(`Invalid status: ${this.status}`);
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
    const asOptions = results.slice(1).concat(results[0]);
    return (
      <Fragment className={classes.optionGrid}>
        {asOptions.map((option, i) => (
          (status !== EVENT_STATUS.BETTING || (status === EVENT_STATUS.BETTING && i !== asOptions.length - 1)) &&
          <Option
            key={i}
            option={option}
          />
        ))}
      </Fragment>
    );
  }

  render() {
    const { classes, index, onClick } = this.props;
    const { address, name, isPending, url, status, totalBets, getEndTime, arbitrationRewardPercentage } = this.props.event;
    return (
      <Grid item xs={12} sm={6} lg={4}>
        <Link to={url}>
          <Card className={classes.eventCard} onClick={onClick}>
            <div className={cx(classes.eventCardBg, `bg${index % 8}`)}></div>
            <div className={cx(classes.eventCardSection, 'top')}>
              {isPending() && status !== WITHDRAWING && <EventWarning id="str.pendingConfirmation" message="Pending Confirmation" />}
              {isPending() && status === WITHDRAWING && <EventWarning id="str.withdrawing" message="Withdrawning" type={EventWarningType.INFO} />}
              {this.isWithdrawn && <EventWarning id="str.withdrawn" message="Withdrawn" type={EventWarningType.INFO} />}
              <div className={classes.stateText}><FormattedMessageFixed id={messages[this.getEventDesc()].id} defaultMessage={messages[this.getEventDesc()].defaultMessage} /></div>
              <div className={classes.eventCardNameBundle}>
                <div className={classes.eventCardNameFlex}>
                  <Typography variant="h6" className={classes.eventCardName}>
                    {name}
                  </Typography>
                </div>
                <FavoriteButton eventAddress={address} />
              </div>
              <div className={classes.eventCardNameBundle}>
                <div className={classes.eventCardNameFlex}>
                  <div className={classes.eventCardInfoItem}>
                    <FormattedMessage id='str.arbitrationReward' defaultMessage='Arbitration Reward' />{`: ${arbitrationRewardPercentage}%`}
                  </div>
                  <div className={classes.eventCardInfoItem}>
                    <RaisedAmount amount={totalBets} />
                  </div>
                </div>
                <div className={classes.eventCardInfo}>
                  <div className={classes.eventCardInfoItem}>
                    {getEndTime() && <TimeCorner endTime={getEndTime()} />}
                  </div>
                </div>
              </div>
              <div container className={classes.alignBottom}>
                {this.renderOptions()}
              </div>
            </div>
          </Card>
        </Link>
      </Grid>
    );
  }
}

const FormattedMessageFixed = (props) => <FormattedMessage {...props} />;
