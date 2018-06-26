import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { connect } from 'react-redux';
import {
  withStyles,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
import { FormattedMessage, injectIntl } from 'react-intl';

import styles from './styles';
import appActions from '../../redux/App/actions';
import topicActions from '../../redux/Topic/actions';
import graphqlActions from '../../redux/Graphql/actions';


@injectIntl
@withStyles(styles, { withTheme: true })
@connect((state) => ({
  get error() {
    let type = null;
    let error = null;
    if (state.App.get('errorApp')) {
      type = 'app';
      error = state.App.get('errorApp');
    } else if (state.Topic.get('errorTopic')) {
      type = 'topic';
      error = state.Topic.get('errorTopic');
    } else if (state.Graphql.get('error')) {
      type = 'graphql';
      error = state.Graphql.get('error');
    }

    if (type && error) {
      return { ...error, type };
    }
    return null;
  },
}))
@inject('store')
@observer
export default class ErrorDialog extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    error: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    error: {},
  }

  clearError = () => {
    const { error, dispatch } = this.props;

    // Clear old Redux error types
    if (error && error.type) {
      const clearError = {
        app: appActions.clearErrorApp,
        topic: topicActions.clearErrorTopic,
        graphql: graphqlActions.clearGraphqlError,
      }[error.type];
      dispatch(clearError());
    }

    // Clear error object in MobX store
    this.props.store.ui.clearError();
  }

  render() {
    const { classes, error } = this.props;
    const storeError = this.props.store.ui.error;

    // Temporarily replacing the error obj if UiStore.error is not null.
    // This is temporary until the MobX refactors for `errorApp, errorTopic, and error` Redux state objects are
    // converted to MobX.
    // Convert `errorApp, errorTopic, and error` to use UiStore.setError()
    // TODO: remove when all replaced
    let replacedError = error;
    if (storeError) {
      replacedError = {
        message: storeError.message,
        route: storeError.route,
      };
    }

    return replacedError && (
      <Dialog open={Boolean(replacedError)}>
        <DialogTitle><FormattedMessage id="str.error" defaultMessage="Error" /></DialogTitle>
        <DialogContent>
          <Typography className={classes.errorRoute}>{replacedError.route}</Typography>
          <Typography className={classes.errorMessage}>{replacedError.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.clearError}>
            <FormattedMessage id="str.ok" defaultMessage="OK" />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
