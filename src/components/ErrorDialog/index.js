import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
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

@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class ErrorDialog extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    error: PropTypes.object,
  }

  static defaultProps = {
    error: {},
  }

  clearError = () => {
    // Clear error object in MobX store
    this.props.store.ui.clearError();
  }

  render() {
    const { classes } = this.props;
    const storeError = this.props.store.ui.error;

    return storeError && (
      <Dialog open={Boolean(storeError)}>
        <DialogTitle><FormattedMessage id="str.error" defaultMessage="Error" /></DialogTitle>
        <DialogContent>
          <Typography className={classes.errorRoute}>{storeError.route}</Typography>
          <Typography className={classes.errorMessage}>{storeError.message}</Typography>
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
