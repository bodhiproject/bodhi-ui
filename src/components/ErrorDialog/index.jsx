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
import topicActions from '../../redux/Topic/actions';

class ErrorDialog extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    errorApp: PropTypes.object,
    clearErrorApp: PropTypes.func.isRequired,
    errorTopic: PropTypes.object,
    clearErrorTopic: PropTypes.func.isRequired,
  };

  static defaultProps = {
    errorApp: undefined,
    errorTopic: undefined,
  };

  render() {
    const {
      classes,
      errorApp,
      errorTopic,
    } = this.props;

    const isOpen = Boolean(errorApp || errorTopic);
    let error;
    if (errorApp) {
      error = errorApp;
    } else if (errorTopic) {
      error = errorTopic;
    }

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
    this.props.clearErrorTopic();
  }
}

const mapStateToProps = (state) => ({
  errorApp: state.App.get('errorApp'),
  errorTopic: state.Topic.get('errorTopic'),
});

function mapDispatchToProps(dispatch) {
  return {
    clearErrorApp: () => dispatch(appActions.clearErrorApp()),
    clearErrorTopic: () => dispatch(topicActions.clearErrorTopic()),
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(ErrorDialog)));
