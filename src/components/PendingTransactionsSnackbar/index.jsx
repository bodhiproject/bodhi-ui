import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { SnackbarContent } from 'material-ui/Snackbar';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import classNames from 'classnames';
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
    pendingTxs: PropTypes.object.isRequired,
  };

  render() {
    const {
      intl,
      classes,
      snackbarVisible,
      pendingTxs,
    } = this.props;

    const { locale, messages: localeMessages } = this.props.intl;
    const provider = getIntlProvider(locale, localeMessages);

    if (pendingTxs.count <= 0) {
      return null;
    }

    return (
      <SnackbarContent
        className={classes.snackbar}
        open={snackbarVisible}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        message={
          <Grid container>
            <Grid item xs={11}>
              <Typography variant="caption" className={classes.totalCountText}>
                {`${provider.formatMessage(messages.youHave)} ${pendingTxs.count} ${provider.formatMessage(messages.pendingTransactions)}`}
              </Typography>
              {
                Object.keys(pendingTxs).map((key) => {
                  if (key !== 'count') {
                    const amount = pendingTxs[key].length;
                    if (amount > 0) {
                      return <Typography variant="caption">{`${key}: ${amount}`}</Typography>;
                    }
                    return null;
                  }
                  return null;
                })
              }
            </Grid>
            <Grid item xs={1}>
              <i className={classNames(classes.closeIcon, 'icon', 'iconfont', 'icon-ic_close')}></i>
            </Grid>
          </Grid>
        }
      />
    );
  }
}

const mapStateToProps = (state) => ({
  getPendingTransactionsReturn: state.Graphql.get('getPendingTransactionsReturn'),
});

export default injectIntl(withStyles(styles, { withTheme: true })(PendingTransactionsSnackbar));
