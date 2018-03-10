import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import Grid from 'material-ui/Grid';
import Card from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import Chip from 'material-ui/Chip';
import Typography from 'material-ui/Typography';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';

import styles from './styles';
import { getLocalDateTimeString, getEndTimeCountDownString } from '../../helpers/utility';

const cardMessages = defineMessages({
  raise: {
    id: 'str.raise',
    defaultMessage: 'Raised',
  },
  ends: {
    id: 'str.ends',
    defaultMessage: 'Ends',
  },
});

class EventCard extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    url: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    totalQTUM: PropTypes.number.isRequired,
    totalBOT: PropTypes.number,
    endTime: PropTypes.string,
    buttonText: PropTypes.string.isRequired,
    unconfirmed: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/no-typos
    intl: intlShape.isRequired,
  };

  static defaultProps = {
    totalBOT: undefined,
    endTime: undefined,
  };

  render() {
    const {
      classes,
      url,
      name,
      totalQTUM,
      totalBOT,
      endTime,
      buttonText,
      unconfirmed,
    } = this.props;
    const { locale, messages: localeMessages } = this.props.intl;

    return (
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Link to={url}>
          <Card>
            <div className={classNames(classes.eventCardSection, 'top')}>
              <Typography variant="headline" className={classes.eventCardName}>
                {name}
              </Typography>
              <div className={classes.dashboardTime}>
                {endTime !== undefined ? `${this.props.intl.formatMessage(cardMessages.ends)}: ${getLocalDateTimeString(endTime)} ` : null}
              </div>
              {unconfirmed ?
                <Typography variant="body1">
                  <Chip
                    label={<FormattedMessage id="str.unconfirmed" defaultMessage="Unconfirmed" />}
                    className={classes.unconfirmedChip}
                  />
                </Typography>
                : null
              }
              <div className={classes.eventCardInfo}>
                <div>
                  <i className={classNames(classes.dashBoardCardIcon, 'icon', 'iconfont', 'icon-ic_token')}></i>
                  {`${this.props.intl.formatMessage(cardMessages.raise)} ${parseFloat(totalQTUM.toFixed(2))} QTUM `}
                  {totalBOT !== undefined ? `, ${parseFloat(totalBOT.toFixed(2))} BOT` : null}
                </div>
                <div>
                  <i className={classNames(classes.dashBoardCardIcon, 'icon', 'iconfont', 'icon-ic_timer')}></i>
                  {endTime !== undefined ? `${getEndTimeCountDownString(endTime, locale, localeMessages)}` : 'Ended'}
                </div>
              </div>
            </div>
            <Divider />
            <div className={classNames(classes.eventCardSection, 'button')}>
              {buttonText}
            </div>
          </Card>
        </Link>
      </Grid>
    );
  }
}

export default withStyles(styles, { withTheme: true })(injectIntl(EventCard));
