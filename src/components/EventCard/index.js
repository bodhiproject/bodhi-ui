import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import { Grid, Card, Divider, Typography, withStyles } from '@material-ui/core';
import cx from 'classnames';
import { sum } from 'lodash';
import { Phases } from 'constants';

import EventWarning from '../EventWarning';
import styles from './styles';
import { getEndTimeCountDownString } from '../../helpers/utility';

const { BETTING, RESULT_SETTING, VOTING, FINALIZING, WITHDRAWING } = Phases;
const messages = defineMessages({
  pending: { id: 'str.pending', defaultMessage: 'Pending' },
  placeBet: { id: 'bottomButtonText.placeBet', defaultMessage: 'Place Bet' },
  setResult: { id: 'str.setResult', defaultMessage: 'Set Result' },
  arbitrate: { id: 'bottomButtonText.arbitrate', defaultMessage: 'Arbitrate' },
  finalizeResult: { id: 'str.finalizeResult', defaultMessage: 'Finalize Result' },
  withdraw: { id: 'str.withdraw', defaultMessage: 'Withdraw' },
  archived: { id: 'bottomButtonText.archived', defaultMessage: 'Archived' },
});


@injectIntl
@withStyles(styles, { withTheme: true })
export default class EventCard extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    index: PropTypes.number.isRequired,
    endTime: PropTypes.string,
  };

  static defaultProps = {
    endTime: undefined,
  };

  getAmountLabel = () => {
    const { phase, token, amounts, qtumAmount, botAmount } = this.props.event;
    switch (phase) {
      case BETTING:
      case RESULT_SETTING:
      case VOTING: {
        const amount = parseFloat(sum(amounts).toFixed(2));
        return `${amount} ${token}`;
      }
      case FINALIZING: {
        return '';
      }
      case WITHDRAWING: {
        const totalQTUM = parseFloat(sum(qtumAmount).toFixed(2));
        const totalBOT = parseFloat(sum(botAmount).toFixed(2));
        return `${totalQTUM} QTUM, ${totalBOT} BOT`;
      }
      default: {
        console.error(`Unhandled phase: ${phase}`); // eslint-disable-line
        break;
      }
    }
  }

  getButtonText = () => {
    const { phase } = this.props.event;
    switch (phase) {
      case BETTING: return messages.placeBet;
      case RESULT_SETTING: return messages.setResult;
      case VOTING: return messages.arbitrate;
      case FINALIZING: return messages.finalizeResult;
      case WITHDRAWING: return messages.withdraw;
      default: console.error(`Unhandled phase: ${phase}`); // eslint-disable-line
    }
  }

  render() {
    const { classes, index } = this.props;
    const { name, isPending, isUpcoming, url, endTime } = this.props.event;
    const { locale, messages: localeMessages, formatMessage } = this.props.intl;
    const amountLabel = this.getAmountLabel();

    return (
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Link to={url}>
          <Card className={classes.eventCard}>
            <div className={cx(classes.eventCardBg, `bg${index % 8}`)}></div>
            <div className={cx(classes.eventCardSection, 'top')}>
              {isPending && <EventWarning id="str.pendingConfirmation" message="Pending Confirmation" />}
              {isUpcoming && <EventWarning id="str.upcoming" message="Upcoming" type="upcoming" />}
              <Typography variant="headline" className={classes.eventCardName}>
                {name}
              </Typography>
              <div className={classes.eventCardInfo}>
                {amountLabel && (
                  <div>
                    <i className={cx(classes.dashBoardCardIcon, 'icon iconfont icon-ic_token')}></i>
                    <FormattedMessage id="str.raised" defaultMessage="Raised" />
                    {` ${amountLabel}`}
                  </div>
                )}
                <div>
                  <i className={cx(classes.dashBoardCardIcon, 'icon iconfont icon-ic_timer')}></i>
                  {endTime !== undefined
                    ? `${getEndTimeCountDownString(endTime, locale, localeMessages)}`
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
