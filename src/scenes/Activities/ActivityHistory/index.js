import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Grid, withStyles } from '@material-ui/core';
import { injectIntl, defineMessages } from 'react-intl';
import { InstallNakaWalletInline } from 'components';
import { Routes } from 'constants';
import styles from './styles';
import EventRows from './EventRows';
import Loading from '../../../components/EventListLoading';
import EmptyPlaceholder from '../../../components/EmptyPlaceholder';
import TopActions from '../../../components/TopActions';

const messages = defineMessages({
  emptyTxHistoryMsg: {
    id: 'str.emptyTxHistory',
    defaultMessage: 'You do not have any transactions right now.',
  },
});

@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class ActivityHistory extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.store.ui.location = Routes.ACTIVITY_HISTORY;
    this.props.store.history.init();
  }

  renderContent() {
    const { classes, store: { history, wallet: { currentAddress } } } = this.props;
    const { loaded } = history;
    if (!loaded) return <Loading />;
    if (currentAddress) return <EventHistoryContent history={history} classes={classes} />;

    return <InstallNakaWalletInline />;
  }

  render() {
    return (
      <div>
        <TopActions />
        {this.renderContent()}
      </div>
    );
  }
}

const EventHistoryContent = inject('store')(observer(({ classes, store: { history: { transactions } } }) =>
  (
    transactions.length ? (
      <Grid container spacing={0} className={classes.historyTableWrapper}>
        <EventRows />
      </Grid>
    ) : (
      <EmptyPlaceholder message={messages.emptyTxHistoryMsg} />
    )
  )));
