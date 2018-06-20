import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
    let type = '';
    let error = { message: '', route: '' };
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
    return { ...error, type };
  },
}))
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
    if (!error.type) return;
    const clearError = {
      app: appActions.clearErrorApp,
      topic: topicActions.clearErrorTopic,
      graphql: graphqlActions.clearGraphqlError,
    }[error.type];
    dispatch(clearError());
  }

  render() {
    const { classes, error } = this.props;

    return (
      <Dialog open={!!error.message}>
        <DialogTitle><FormattedMessage id="str.error" defaultMessage="Error" /></DialogTitle>
        <DialogContent>
          <Typography className={classes.errorRoute}>{error.route}</Typography>
          <Typography className={classes.errorMessage}>{error.message}</Typography>
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
