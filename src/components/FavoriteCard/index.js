import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import { Grid, Card, Typography, withStyles } from '@material-ui/core';
import cx from 'classnames';
import { sum } from 'lodash';
import { Phases } from 'constants';

import FavoriteButton from './FavoriteButton';
import styles from './styles';
import { getEndTimeCountDownString } from '../../helpers';

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
@inject('store')
@observer
export default class FavoriteCard extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    endTime: PropTypes.string,
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    onClick: PropTypes.func,
  };

  static defaultProps = {
    endTime: undefined,
    onClick: null,
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
    const { classes, onClick, store: { ui } } = this.props;
    const { name, url, endTime } = this.props.event;
    const { locale, messages: localeMessages } = this.props.intl;
    const amountLabel = this.getAmountLabel();
    const { currentTimeUnix } = ui;

    return (
      <Grid item xs={12}>
        <Link to={url}>
          <Card className={classes.eventCard} onClick={onClick}>
            <div className={cx(classes.eventCardSection, 'top')}>
              <Grid container spacing={8}>
                <Grid item xs={8}>
                  <Typography variant="headline" className={classes.eventCardName}>
                    {name}
                  </Typography>
                </Grid>
                <Grid item>
                  <FavoriteButton event={this.props.event} />
                </Grid>
              </Grid>
              <div className={classes.eventCardInfo}>
                {amountLabel && (
                  <div className={classes.eventCardInfoItem}>
                    <i className={cx(classes.dashBoardCardIcon, 'icon iconfont icon-ic_token')}></i>
                    {`${amountLabel} `}
                  </div>
                )}
                <div className={classes.eventCardInfoItem}>
                  <i className={cx(classes.dashBoardCardIcon, 'icon iconfont icon-ic_timer')}></i>
                  {endTime !== undefined
                    ? <Fragment>{getEndTimeCountDownString(this.props.event.endTime - currentTimeUnix, locale, localeMessages, true)}</Fragment>
                    : <FormattedMessage id="str.end" defaultMessage="Ended" />
                  }
                </div>
              </div>
            </div>
          </Card>
        </Link>
      </Grid>
    );
  }
}
