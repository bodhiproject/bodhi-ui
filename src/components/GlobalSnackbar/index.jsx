import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import classNames from 'classnames';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';

import appActions from '../../redux/App/actions';
import Config from '../../config/app';

@injectIntl
@connect((state) => ({
  globalSnackbarVisible: state.App.get('globalSnackbarVisible'),
  globalSnackbarMessage: state.App.get('globalSnackbarMessage'),
}), (dispatch) => ({
  toggleGlobalSnackbar: (isVisible, message) => dispatch(appActions.toggleGlobalSnackbar(isVisible, message)),
}))

export default class GlobalSnackbar extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    globalSnackbarVisible: PropTypes.bool.isRequired,
    globalSnackbarMessage: PropTypes.string.isRequired,
    toggleGlobalSnackbar: PropTypes.func.isRequired,
  };

  render() {
    const { intl, globalSnackbarVisible, globalSnackbarMessage } = this.props;

    return (
      <Snackbar
        open={globalSnackbarVisible}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        autoHideDuration={Config.intervals.snackbarLong}
        onClose={this.onCloseClicked}
        message={globalSnackbarMessage}
        action={[
          <IconButton key="close" color="inherit" onClick={this.onCloseClicked}>
            <CloseIcon />
          </IconButton>,
        ]}
      />
    );
  }

  onCloseClicked = () => {
    this.props.toggleGlobalSnackbar(false, '');
  };
}
