import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { withStyles, Button } from '@material-ui/core';
import { ChevronLeft } from '@material-ui/icons';
import { FormattedMessage, injectIntl } from 'react-intl';

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
<<<<<<< HEAD
    const { history, store: { ui: { location } } } = this.props;
    history.push(location);
=======
    const { history, store: { ui } } = this.props;

    switch (ui.location) {
      case AppLocation.ACTIVITY_HISTORY: {
        history.push(AppLocation.ACTIVITY_HISTORY);
        break;
      }
      case AppLocation.ALL_EVENTS: {
        history.push(AppLocation.ALL_EVENTS);
        break;
      }
      case AppLocation.QTUM_PREDICTION:
      case AppLocation.bet: {
        history.push(AppLocation.QTUM_PREDICTION);
        break;
      }
      case AppLocation.BOT_COURT: {
        history.push(AppLocation.BOT_COURT);
        break;
      }
      case AppLocation.SET: {
        history.push(AppLocation.SET);
        break;
      }
      case AppLocation.FINALIZE: {
        history.push(AppLocation.FINALIZE);
        break;
      }
      case AppLocation.WITHDRAW: {
        history.push(AppLocation.WITHDRAW);
        break;
      }
      default: {
        history.push(AppLocation.QTUM_PREDICTION);
        break;
      }
    }
>>>>>>> change all, all testing passed
  };
}
