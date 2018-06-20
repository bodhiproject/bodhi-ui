import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { withStyles, Button } from '@material-ui/core';
import { ChevronLeft } from '@material-ui/icons';
import { FormattedMessage, injectIntl } from 'react-intl';

import styles from './styles';
import { AppLocation, RouterPath } from '../../constants';

@withRouter
@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class BackButton extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  render() {
    const { classes } = this.props;

    return (
      <Button variant="raised" size="small" className={classes.button} onClick={this.onBackClick}>
        <ChevronLeft />
        <FormattedMessage id="str.back" defaultMessage="Back" />
      </Button>
    );
  }

  onBackClick = () => {
    const { history, store: { ui } } = this.props;

    switch (ui.location) {
      case AppLocation.activityHistory: {
        history.push(RouterPath.activityHistory);
        break;
      }
      case AppLocation.allEvents: {
        history.push(RouterPath.allEvents);
        break;
      }
      case AppLocation.qtumPrediction:
      case AppLocation.bet: {
        history.push(RouterPath.qtumPrediction);
        break;
      }
      case AppLocation.vote: {
        history.push(RouterPath.botCourt);
        break;
      }
      case AppLocation.resultSet: {
        history.push(RouterPath.set);
        break;
      }
      case AppLocation.finalize: {
        history.push(RouterPath.finalize);
        break;
      }
      case AppLocation.withdraw: {
        history.push(RouterPath.withdraw);
        break;
      }
      default: {
        history.push(RouterPath.qtumPrediction);
        break;
      }
    }
  };
}
