import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { withStyles, Button } from '@material-ui/core';
import { ChevronLeft } from '@material-ui/icons';
import { FormattedMessage, injectIntl } from 'react-intl';
import { AppLocation } from 'constants';

import styles from './styles';

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
        history.push(AppLocation.activityHistory);
        break;
      }
      case AppLocation.allEvents: {
        history.push(AppLocation.allEvents);
        break;
      }
      case AppLocation.qtumPrediction:
      case AppLocation.bet: {
        history.push(AppLocation.qtumPrediction);
        break;
      }
      case AppLocation.botCourt: {
        history.push(AppLocation.botCourt);
        break;
      }
      case AppLocation.resultSet: {
        history.push(AppLocation.set);
        break;
      }
      case AppLocation.finalize: {
        history.push(AppLocation.finalize);
        break;
      }
      case AppLocation.withdraw: {
        history.push(AppLocation.withdraw);
        break;
      }
      default: {
        history.push(AppLocation.qtumPrediction);
        break;
      }
    }
  };
}
