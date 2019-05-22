import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { Grid, Card, Typography, withStyles } from '@material-ui/core';
import cx from 'classnames';
import { FavoriteButton, RaisedAmount, CountdownTime } from 'components';
import styles from './styles';

@withStyles(styles, { withTheme: true })
@injectIntl
@inject('store')
@observer
export default class FavoriteCard extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    event: PropTypes.object.isRequired,
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
      <div className={classes.headerContainer}>
        <Typography variant="subtitle1" className={classes.eventNameText} noWrap>
          {name}
        </Typography>
        <FavoriteButton eventAddress={address} />
      </div>
    );
  }

  renderTotalBets = () => {
    const {
      classes,
      event: { totalBets },
    } = this.props;

    return (
      <div className={classes.infoItem}>
        <RaisedAmount amount={totalBets} />
      </div>
    );
  }

  renderTimeLeft = () => {
    const {
      classes,
      event: { getEndTime },
    } = this.props;

    return (
      <div className={classes.infoItem}>
        <CountdownTime endTime={getEndTime()} />
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
              <div>
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
