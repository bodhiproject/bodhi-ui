import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { injectIntl, defineMessages } from 'react-intl';
import { Grid, Tabs, Tab, withStyles } from '@material-ui/core';
import { EventStatus } from 'constants';
import EventCard from '../../components/EventCard';
import Loading from '../../components/EventListLoading';
import styles from './styles';
import EmptyPlaceholder from '../../components/EmptyPlaceholder';

const TAB_BET = 0;
const TAB_SET = 1;
const TAB_VOTE = 2;
const TAB_WITHDRAW = 3;

const messages = defineMessages({
  set: {
    id: 'search.set',
    defaultMessage: 'Result Setting',
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
  getTabLabel = (eventStatusIndex) => {
    const { intl } = this.props;
    const { bets, votes, sets, withdraws } = this.props.store.search;
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

  renderTabs = () => {
    const {
      classes,
      store: { search },
    } = this.props;
    return (
      <Tabs
        className={classes.searchTabWrapper}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        value={search.tabIdx}
        onChange={(e, v) => search.onTabChange(v)}
      >
        <Tab
          className={classes.searchTabButton}
          label={this.getTabLabel(EventStatus.BET)}
        />
        <Tab
          className={classes.searchTabButton}
          label={this.getTabLabel(EventStatus.SET)}
        />
        <Tab
          className={classes.searchTabButton}
          label={this.getTabLabel(EventStatus.VOTE)}
        />
        <Tab
          className={classes.searchTabButton}
          label={this.getTabLabel(EventStatus.WITHDRAW)}
        />
      </Tabs>
    );
  }

  renderEvents = () => {
    const {
      store: {
        ui,
        search: {
          tabIdx,
          bets,
          sets,
          votes,
          withdraws,
        },
      },
    } = this.props;

    // Set events for the selected tab
    let tabEvents = [];
    switch (tabIdx) {
      case TAB_BET: tabEvents = bets; break;
      case TAB_SET: tabEvents = sets; break;
      case TAB_VOTE: tabEvents = votes; break;
      case TAB_WITHDRAW: tabEvents = withdraws; break;
      default: throw Error(`Invalid tab index: ${tabIdx}`);
    }

    // Show empty message if no events for this tab
    if (tabEvents.length === 0) {
      return <EmptyPlaceholder message={messages.searchEmptySearchResultMsg} />;
    }

    // Convert array of events to components
    tabEvents = tabEvents.map((event, i) => (
      <EventCard
        key={i}
        index={i}
        onClick={() => ui.disableSearchBarMode()}
        event={event}
      />
    ));
    return tabEvents;
  }

  render() {
    const {
      classes,
      store: { search: { loading } },
    } = this.props;

    return (
      <Fragment>
        <div>
          {this.renderTabs()}
          <div className={classes.searchTabContainer}>
            <Grid container spacing={2}>
              {loading
                ? <Loading message={messages.searchingMsg} />
                : this.renderEvents()
              }
            </Grid>
          </div>
        </div>
      </Fragment>
    );
  }
}
