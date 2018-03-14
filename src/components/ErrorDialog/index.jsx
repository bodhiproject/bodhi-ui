import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import { withStyles } from 'material-ui/styles';
import { FormattedMessage, injectIntl } from 'react-intl';

import styles from './styles';
import appActions from '../../redux/App/actions';

class ErrorDialog extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    errorApp: PropTypes.object,
    clearErrorApp: PropTypes.func.isRequired,
  };

  static defaultProps = {
    errorApp: undefined,
  };

  render() {
    const {
      classes,
      errorApp,
    } = this.props;

    const isOpen = Boolean(errorApp);
    const error = errorApp;

    if (!error) {
      return null;
    }

    return (
      <Dialog open={isOpen}>
        <DialogTitle><FormattedMessage id="str.error" defaultMessage="Error" /></DialogTitle>
        <DialogContent>
          <Typography className={classes.errorRoute}>{error.route}</Typography>
          <Typography className={classes.errorMessage}>{error.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.onOkClicked}>
            <FormattedMessage id="str.ok" defaultMessage="OK" />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  onOkClicked = () => {
    this.props.clearErrorApp();
  }
}

const mapStateToProps = (state) => ({
  errorApp: state.App.get('errorApp'),
});

function mapDispatchToProps(dispatch) {
  return {
    clearErrorApp: () => dispatch(appActions.clearErrorApp()),
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(ErrorDialog)));
