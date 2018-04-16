import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Snackbar from 'material-ui/Snackbar';
import classNames from 'classnames';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';

import styles from './styles';
import appActions from '../../redux/App/actions';

@injectIntl
@withStyles(styles, { withTheme: true })
@connect((state) => ({
  globalSnackbarVisible: state.App.get('globalSnackbarVisible'),
}), (dispatch) => ({
  toggleGlobalSnackbar: (isVisible) => dispatch(appActions.toggleGlobalSnackbar(isVisible)),
}))

class GlobalSnackbar extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    classes: PropTypes.object.isRequired,
    globalSnackbarVisible: PropTypes.bool.isRequired,
    toggleGlobalSnackbar: PropTypes.func.isRequired,
  };

  render() {
    const { intl, classes, message, globalSnackbarVisible } = this.props;

    return (
      <Snackbar
        className={classes.snackbar}
        open={globalSnackbarVisible}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        message={message}
        action={[
          <IconButton key="close" color="inherit" onClick={this.onCloseClicked}>
            <CloseIcon />
          </IconButton>,
        ]}
      />
    );
  }

  onCloseClicked = () => {
    this.props.toggleGlobalSnackbar(false);
  };
}
