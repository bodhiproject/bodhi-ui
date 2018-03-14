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

class ErrorDialog extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    errorApp: PropTypes.object,
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
          <Typography variant="body1" className={classes.errorRoute}>{error.route}</Typography>
          <Typography variant="body1">{error.message}</Typography>
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
    // clear errors
  }
}

const mapStateToProps = (state) => ({
  errorApp: state.App.get('errorApp'),
});

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(ErrorDialog)));
