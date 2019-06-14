import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { Button, Grid, withStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { inject, observer } from 'mobx-react';
import { Routes } from 'constants';
import styles from './styles';

@injectIntl
@withStyles(styles, { withTheme: true })
@withRouter
@inject('store')
@observer
export default class TopActions extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    noCreateEventButton: PropTypes.bool,
  };

  static defaultProps = {
    noCreateEventButton: false,
  };

  handleCreateEventClick = () => {
    const { store: { naka: { loggedIn }, ui: { showNoWalletDialog } }, history } = this.props;
    if (!loggedIn) showNoWalletDialog();
    else history.push(Routes.CREATE_EVENT);
  }

  render() {
    const { classes, noCreateEventButton, fontSize } = this.props;

    return (
      <Grid container className={classes.dashboardActionsWrapper}>
        <Grid item xs={6}>
          {!noCreateEventButton && (
            <Button
              variant="contained"
              size="medium"
              color="primary"
              className={classes.createEventButton}
              onClick={this.handleCreateEventClick}
            >
              <Add className={classes.createEventButtonIcon} fontSize={fontSize} />
              <FormattedMessage id="str.createEvent" defaultMessage="Create Event" />
            </Button>
          )}
        </Grid>
      </Grid>
    );
  }
}
