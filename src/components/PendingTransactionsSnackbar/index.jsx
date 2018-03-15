import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { SnackbarContent } from 'material-ui/Snackbar';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';

import styles from './styles';
import { getIntlProvider } from '../../helpers/i18nUtil';

const messages = defineMessages({
  youHave: {
    id: 'pendingTxsSnackbar.youHave',
    defaultMessage: 'You have',
  },
  pendingTransactions: {
    id: 'pendingTxsSnackbar.pendingTransactions',
    defaultMessage: 'pending transactions.',
  },
});

class PendingTransactionsSnackbar extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    classes: PropTypes.object.isRequired,
    snackbarVisible: PropTypes.bool.isRequired,
  };

  render() {
    const {
      intl,
      classes,
      snackbarVisible,
    } = this.props;

    const { locale, messages: localeMessages } = this.props.intl;
    const provider = getIntlProvider(locale, localeMessages);

    const pendingTxsCount = 2;

    return (
      <SnackbarContent
        className={classes.snackbar}
        open={snackbarVisible}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        message={
          <div>
            <Typography variant="caption">
              {`${provider.formatMessage(messages.youHave)} ${pendingTxsCount} ${provider.formatMessage(messages.pendingTransactions)}`}
            </Typography>
          </div>
        }
      />
    );
  }
}

export default injectIntl(withStyles(styles, { withTheme: true })(PendingTransactionsSnackbar));
