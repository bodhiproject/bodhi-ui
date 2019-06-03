import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Button, Grid, withStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { inject, observer } from 'mobx-react';
import { Routes } from 'constants';
import styles from './styles';

@injectIntl
@withStyles(styles, { withTheme: true })
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

  render() {
    const { classes, noCreateEventButton, fontSize, store } = this.props;
    const { createEvent } = store;

    return (
      <Grid container className={classes.dashboardActionsWrapper} sm={12}>
        <Grid item xs={12} sm={12}>
          {!noCreateEventButton && (
            <Link to={Routes.CREATE_EVENT}>
              <Button
                variant="contained"
                size="medium"
                color="primary"
                className={classes.createEventButton}
              >
                <Add className={classes.createEventButtonIcon} fontSize={fontSize} />
                <FormattedMessage id="str.createEvent" defaultMessage="Create Event" />
              </Button>
            </Link>
          )}
        </Grid>
      </Grid>
    );
  }
}
