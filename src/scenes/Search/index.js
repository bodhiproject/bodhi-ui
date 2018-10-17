import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { injectIntl, defineMessages } from 'react-intl';
import { Grid, Tabs, Tab, withStyles } from '@material-ui/core';
import { EventStatus } from 'constants';
import theme from '../../config/theme';
import EventCard from '../../components/EventCard';
import Loading from '../../components/EventListLoading';
import styles from './styles';
import EmptyPlaceholder from '../../components/EmptyPlaceholder';

const TAB_BET = 0;
const TAB_VOTE = 1;
const TAB_SET = 2;
const TAB_FINALIZE = 3;
const TAB_WITHDRAW = 4;

const messages = defineMessages({
  set: {
    id: 'search.set',
    defaultMessage: 'Result Setting',
  },
  finalize: {
    id: 'search.finalize',
    defaultMessage: 'Finalize',
  },
  withdraw: {
    id: 'search.withdraw',
    defaultMessage: 'Withdraw',
  },
  bet: {
    id: 'search.bet',
    defaultMessage: 'Betting',
  },
  vote: {
    id: 'search.vote',
    defaultMessage: 'Voting',
  },
  searchingMsg: {
    id: 'search.loading',
    defaultMessage: 'Searching...',
  },
  searchEmptySearchResultMsg: {
    id: 'search.emptySearchResult',
    defaultMessage: 'Oops, your search has no results.',
  },
});
@withStyles(styles, { withTheme: true })
@injectIntl
@inject('store')
@observer
export default class Search extends Component {
  showEvents = [];
  getTabLabel = (eventStatusIndex) => {
    const { intl } = this.props;
    const { bets, votes, sets, finalizes, withdraws } = this.props.store.search;
    let label;
    let count;
    switch (eventStatusIndex) {
      case EventStatus.BET: {
        label = intl.formatMessage(messages.bet);
        count = bets.length;
        break;
      }
      case EventStatus.VOTE: {
        label = intl.formatMessage(messages.vote);
        count = votes.length;
        break;
      }
      case EventStatus.SET: {
        label = intl.formatMessage(messages.set);
        count = sets.length;
        break;
      }
      case EventStatus.FINALIZE: {
        label = intl.formatMessage(messages.finalize);
        count = finalizes.length;
        break;
      }
      case EventStatus.WITHDRAW: {
        label = intl.formatMessage(messages.withdraw);
        count = withdraws.length;
        break;
      }
      default: {
        break;
      }
    }
    let countText = '';
    if (count > 0) {
      countText = ` (${count})`;
    }
    return `${label}${countText}`;
  }

  handleTabChange = (event, value) => {
    const { bets, votes, sets, finalizes, withdraws } = this.props.store.search;
    this.props.store.search.tabIdx = value;
    switch (value) {
      case TAB_BET: {
        this.props.store.search.events = bets;
        break;
      }
      case TAB_VOTE: {
        this.props.store.search.events = votes;
        break;
      }
      case TAB_SET: {
        this.props.store.search.events = sets;
        break;
      }
      case TAB_FINALIZE: {
        this.props.store.search.events = finalizes;
        break;
      }
      case TAB_WITHDRAW: {
        this.props.store.search.events = withdraws;
        break;
      }
      default: {
        throw new Error(`Invalid tab index: ${value}`);
      }
    }
  }

  render() {
    const { classes } = this.props;
    const { ui } = this.props.store;
    const { oracles, withdraws, loading, loaded, tabIdx, events } = this.props.store.search;
    this.showEvents = (events || []).map((entry, i) => (<EventCard onClick={() => ui.disableSearchBarMode()} key={i} index={i} event={entry} />));
    const result = oracles.length === 0 && withdraws.length === 0 && loaded ? <EmptyPlaceholder message={messages.searchEmptySearchResultMsg} /> : this.showEvents;
    return (
      <Fragment>
        <div>
          <Tabs indicatorColor="primary" value={tabIdx} onChange={this.handleTabChange} className={classes.searchTabWrapper}>
            <Tab label={this.getTabLabel(EventStatus.BET)} className={classes.searchTabButton} />
            <Tab label={this.getTabLabel(EventStatus.VOTE)} className={classes.searchTabButton} />
            <Tab label={this.getTabLabel(EventStatus.SET)} className={classes.searchTabButton} />
            <Tab label={this.getTabLabel(EventStatus.FINALIZE)} className={classes.searchTabButton} />
            <Tab label={this.getTabLabel(EventStatus.WITHDRAW)} className={classes.searchTabButton} />
          </Tabs>
          <div className={classes.searchTabContainer}>
            <Grid container spacing={theme.padding.space3X.value}>
              {loading ? <Loading message={messages.searchingMsg} /> : result}
            </Grid>
          </div>
        </div>
      </Fragment>
    );
  }
}
