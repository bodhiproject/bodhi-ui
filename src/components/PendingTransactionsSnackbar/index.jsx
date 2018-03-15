import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { SnackbarContent } from 'material-ui/Snackbar';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { FormattedMessage, injectIntl } from 'react-intl';

import styles from './styles';

class PendingTransactionsSnackbar extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    snackbarVisible: PropTypes.bool.isRequired,
  };

  render() {
    const {
      classes,
      snackbarVisible,
    } = this.props;

    return (
      <SnackbarContent
        className={classes.snackbar}
        open={snackbarVisible}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        message={
          <div>
            Hello World
          </div>
        }
      />
    );
  }
}

export default injectIntl(withStyles(styles, { withTheme: true })(PendingTransactionsSnackbar));
