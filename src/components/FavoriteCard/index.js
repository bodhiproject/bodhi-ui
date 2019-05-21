import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Grid, Card, Typography, withStyles } from '@material-ui/core';
import cx from 'classnames';
import { FavoriteButton } from 'components';
import styles from './styles';
import { getEndTimeCountDownString } from '../../helpers';

@withStyles(styles, { withTheme: true })
@injectIntl
@inject('store')
@observer
export default class FavoriteCard extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    event: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    onClick: undefined,
  };

  renderHeader = () => {
    const {
      classes,
      event: { address, name },
    } = this.props;

    return (
      <Grid container spacing={8}>
        <Grid item xs={8}>
          <Typography variant="h5" className={classes.eventCardName}>
            {name}
          </Typography>
        </Grid>
        <Grid item>
          <FavoriteButton eventAddress={address} />
        </Grid>
      </Grid>
    );
  }

  renderTotalBets = () => {
    const {
      classes,
      event: { totalBets },
    } = this.props;

    return (
      <div className={classes.eventCardInfoItem}>
        <i className={cx(classes.dashBoardCardIcon, 'icon iconfont icon-ic_token')}></i>
        {totalBets}
      </div>
    );
  }

  renderTimeLeft = () => {
    const {
      classes,
      store: {
        ui: {
          currentTimeUnix,
        },
      },
      intl: {
        locale,
        messages: localeMessages,
      },
      event: {
        resultSetEndTime,
        arbitrationEndTime,
      },
    } = this.props;
    const endTime = arbitrationEndTime || resultSetEndTime;
    const timeLeft = endTime - currentTimeUnix;

    return (
      <div className={classes.eventCardInfoItem}>
        <i className={cx(classes.dashBoardCardIcon, 'icon iconfont icon-ic_timer')}></i>
        {timeLeft > 0
          ? <Fragment>{getEndTimeCountDownString(timeLeft, locale, localeMessages, true)}</Fragment>
          : <FormattedMessage id="str.end" defaultMessage="Ended" />
        }
      </div>
    );
  }

  render() {
    const { classes, onClick } = this.props;
    const { url } = this.props.event;

    return (
      <Grid item xs={12}>
        <Link to={url}>
          <Card className={classes.eventCard} onClick={onClick}>
            <div className={cx(classes.eventCardSection, 'top')}>
              {this.renderHeader()}
              <div className={classes.eventCardInfo}>
                {this.renderTotalBets()}
                {this.renderTimeLeft()}
              </div>
            </div>
          </Card>
        </Link>
      </Grid>
    );
  }
}
