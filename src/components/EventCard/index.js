import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import { Grid, Card, Divider, Typography, withStyles } from 'material-ui';
import cx from 'classnames';

import styles from './styles';
import { getShortLocalDateTimeString, getEndTimeCountDownString } from '../../helpers/utility';

const cardMessages = defineMessages({
  raise: {
    id: 'str.raised',
    defaultMessage: 'Raised',
  },
  ends: {
    id: 'str.ends',
    defaultMessage: 'Ends',
  },
});


@injectIntl
@withStyles(styles, { withTheme: true })
export default class EventCard extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    url: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    amountLabel: PropTypes.string,
    endTime: PropTypes.string,
    buttonText: PropTypes.string.isRequired,
    unconfirmed: PropTypes.bool.isRequired,
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
  };

  static defaultProps = {
    amountLabel: undefined,
    endTime: undefined,
  };

  render() {
    const {
      classes,
      url,
      name,
      amountLabel,
      endTime,
      buttonText,
      unconfirmed,
    } = this.props;
    const { locale, messages: localeMessages } = this.props.intl;

    return (
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Link to={url}>
          <Card>
            <div className={cx(classes.eventCardSection, 'top')}>
              {unconfirmed && (
                <Typography className={classes.unconfirmedTag}>
                  <FormattedMessage id="str.pendingConfirmation" defaultMessage="Pending Confirmation" />
                </Typography>
              )}
              <Typography variant="headline" className={classes.eventCardName}>
                {name}
              </Typography>
              <div className={classes.dashboardTime}>
                {endTime !== undefined && `${this.props.intl.formatMessage(cardMessages.ends)}: ${getShortLocalDateTimeString(endTime)}`}
              </div>
              <div className={classes.eventCardInfo}>
                {amountLabel && (
                  <div>
                    <i className={cx(classes.dashBoardCardIcon, 'icon', 'iconfont', 'icon-ic_token')}></i>
                    <FormattedMessage id="str.raised" defaultMessage="Raised" />
                    {` ${amountLabel}`}
                  </div>
                )}
                <div>
                  <i className={cx(classes.dashBoardCardIcon, 'icon', 'iconfont', 'icon-ic_timer')}></i>
                  {endTime !== undefined
                    ? `${getEndTimeCountDownString(endTime, locale, localeMessages)}`
                    : <FormattedMessage id="str.end" defaultMessage="Ended" />
                  }
                </div>
              </div>
            </div>
            <Divider />
            <div className={cx(classes.eventCardSection, 'button')}>
              {buttonText}
            </div>
          </Card>
        </Link>
      </Grid>
    );
  }
}
