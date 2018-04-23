import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';

import appActions from '../../redux/App/actions';
import Config from '../../config/app';


@connect((state) => ({
  globalSnackbarVisible: state.App.get('globalSnackbarVisible'),
  globalSnackbarMessage: state.App.get('globalSnackbarMessage'),
}), (dispatch) => ({
  toggleGlobalSnackbar: (isVisible, message) => dispatch(appActions.toggleGlobalSnackbar(isVisible, message)),
}))
export default class GlobalSnackbar extends React.Component {
  static propTypes = {
    globalSnackbarVisible: PropTypes.bool.isRequired,
    globalSnackbarMessage: PropTypes.string.isRequired,
    toggleGlobalSnackbar: PropTypes.func.isRequired,
  };

  render() {
    const { globalSnackbarVisible, globalSnackbarMessage } = this.props;

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
