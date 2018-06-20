import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dialog, DialogTitle, DialogActions, Button } from '@material-ui/core';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';

import appActions from '../../../../redux/App/actions';


@injectIntl
@connect((state) => ({
  changePassphraseResult: state.App.get('changePassphraseResult'),
}), (dispatch) => ({
  clearChangePassphraseResult: () => dispatch(appActions.clearChangePassphraseResult()),
}))
export default class ChangePassphraseStatusDialog extends Component {
  static propTypes = {
    changePassphraseResult: PropTypes.object,
    clearChangePassphraseResult: PropTypes.func.isRequired,
  };

  static defaultProps = {
    changePassphraseResult: undefined,
  };

  render() {
    const { changePassphraseResult } = this.props;
    const isSuccessful = !_.isUndefined(changePassphraseResult) && _.has(changePassphraseResult, 'status');

    return (
      <Dialog open={!_.isUndefined(changePassphraseResult)}>
        <DialogTitle>
          {isSuccessful ? (
            <FormattedMessage id="changePassphrase.success" defaultMessage="Passphrase Change Successful" />
          ) : (
            <FormattedMessage id="changePassphrase.fail" defaultMessage="Passphrase Change Failed" />
          )}
        </DialogTitle>
        <DialogActions>
          <Button onClick={this.props.clearChangePassphraseResult}>
            <FormattedMessage id="str.close" defaultMessage="Close" />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
