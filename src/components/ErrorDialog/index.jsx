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
import { injectIntl, intlShape, defineMessages } from 'react-intl';

import styles from './styles';
import graphqlActions from '../../redux/Graphql/actions';

class ErrorDialog extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    errorApp: PropTypes.object,
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
  };

  static defaultProps = {
    errorApp: undefined,
  };

  render() {
    const {
      intl,
      classes,
      errorApp,
    } = this.props;

    const isOpen = Boolean(errorApp);
    const error = errorApp;

    return (
      <Dialog open={isOpen}>
        <DialogTitle><FormattedMessage id="str.error" defaultMessage="Error" /></DialogTitle>
        <DialogContent>
          <Typography variant="body1" className={classes.errorRoute}>{error.route}</Typography>
          <Typography variant="body1">{contentText.errorMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.onOkClicked}>
            {intl.formatMessage(messages.ok)}
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
