import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import {
  Grid,
  Card,
  Divider,
  Typography,
  withStyles,
} from '@material-ui/core';
import cx from 'classnames';

import EventWarning from '../../../../components/EventWarning';
import styles from './styles';
import { getEndTimeCountDownString } from '../../../../helpers';


@injectIntl
@withStyles(styles, { withTheme: true })
export default class EventCard extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    amountLabel: PropTypes.string,
    endTime: PropTypes.string,
    buttonText: PropTypes.object,
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
  };

  static defaultProps = {
    buttonText: { id: '', defaultMessage: '' },
    amountLabel: undefined,
    endTime: undefined,
  };

  constructor() {
    super();
    this.state = {
      countDown: 0,
    };
  }

  componentDidMount() {
    this.setState({
      countDown: getEndTimeCountDownString(this.props.event.endTime),
    });
  }

  componentWillReceiveProps(next) {
    this.setState({
      countDown: getEndTimeCountDownString(next.event.endTime),
    });
  }

  render() {
    const {
      classes,
      index,
      unconfirmed,
    } = this.props;
    const {
      buttonText,
      name,
      isPending,
      isUpcoming,
      url,
      amountLabel,
      endTime,
    } = this.props.event;
    const { formatMessage } = this.props.intl;
    return (
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Link to={url}>
          <Card className={classes.eventCard}>
            <div className={cx(classes.eventCardBg, `bg${index % 8}`)}></div>
            <div className={cx(classes.eventCardSection, 'top')}>
              {(unconfirmed || isPending) && <EventWarning id="str.pendingConfirmation" message="Pending Confirmation" />}
              {isUpcoming && <EventWarning id="str.upcoming" message="Upcoming" type="upcoming" />}
              <Typography variant="headline" className={classes.eventCardName}>
                {name}
              </Typography>
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
                    ? `${endTime !== undefined && `${this.state.countDown}`}`
                    : <FormattedMessage id="str.end" defaultMessage="Ended" />
                  }
                </div>
              </div>
            </div>
            <Divider />
            <div className={cx(classes.eventCardSection, 'button')}>
              {isUpcoming ? <FormattedMessage id="str.waitForResultSetting" defaultMessage="Waiting for result setting" /> : formatMessage(buttonText)}
            </div>
          </Card>
        </Link>
      </Grid>
    );
  }
}
