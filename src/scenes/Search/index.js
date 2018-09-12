import React, { Component, Fragment, observable } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import { Grid, Typography, Tabs, Tab, withStyles } from '@material-ui/core';
import { Routes, EventStatus, Phases } from 'constants';
import theme from '../../config/theme';
import EventCard from '../../components/EventCard';

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
});
@injectIntl
@inject('store')
@observer
export default class Search extends Component {
  bets = [];
  votes = [];
  sets = [];
  withdraws = [];
  finalizes = [];
  // events = [];
  state = {
    tabIdx: TAB_BET,
    events: [],
  };

  getTabLabel = (eventStatusIndex) => {
    const { store: { global }, intl } = this.props;

    let label;
    let count;
    switch (eventStatusIndex) {
      case EventStatus.BET: {
        label = intl.formatMessage(messages.bet);
        count = this.bets.length;
        break;
      }
      case EventStatus.VOTE: {
        label = intl.formatMessage(messages.vote);
        count = this.votes.length;
        break;
      }
      case EventStatus.SET: {
        label = intl.formatMessage(messages.set);
        count = this.sets.length;
        break;
      }
      case EventStatus.FINALIZE: {
        label = intl.formatMessage(messages.finalize);
        count = this.finalizes.length;
        break;
      }
      case EventStatus.WITHDRAW: {
        label = intl.formatMessage(messages.withdraw);
        count = this.withdraws.length;
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
    this.setState({ tabIdx: value });
    switch (value) {
      case TAB_BET: {
        this.setState({ events: [...this.bets] });
        // this.events = this.bets;
        // this.props.history.push(Routes.SET);
        break;
      }
      case TAB_VOTE: {
        this.setState({ events: [...this.votes] });
        // this.events = this.votes;
        // this.props.history.push(Routes.SET);
        break;
      }
      case TAB_SET: {
        this.setState({ events: [...this.sets] });
        // this.events = this.sets;
        // this.props.history.push(Routes.SET);
        break;
      }
      case TAB_FINALIZE: {
        this.setState({ events: [...this.finalizes] });
        // this.events = this.finalizes;
        // this.props.history.push(Routes.FINALIZE);
        break;
      }
      case TAB_WITHDRAW: {
        this.setState({ events: [...this.withdraws] });
        // this.events = this.withdraws;
        // this.props.history.push(Routes.WITHDRAW);
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
    const { list, loading } = this.props.store.search;
    this.bets = (list.filter(event => event.phase === Phases.BETTING) || []).map((event, i) => (<EventCard onClick={() => ui.disableSearchBarMode()} key={i} index={i} event={event} />));
    this.votes = (list.filter(event => event.phase === Phases.VOTING) || []).map((event, i) => (<EventCard onClick={() => ui.disableSearchBarMode()} key={i} index={i} event={event} />));
    this.sets = (list.filter(event => event.phase === Phases.RESULT_SETTING) || []).map((event, i) => (<EventCard onClick={() => ui.disableSearchBarMode()} key={i} index={i} event={event} />));
    this.withdraws = (list.filter(event => event.phase === Phases.WITHDRAWING) || []).map((event, i) => (<EventCard onClick={() => ui.disableSearchBarMode()} key={i} index={i} event={event} />));
    this.finalizes = (list.filter(event => event.phase === Phases.FINALIZING) || []).map((event, i) => (<EventCard onClick={() => ui.disableSearchBarMode()} key={i} index={i} event={event} />));
    // this.state.events = this.bets;
    // this.setState({ events: [...this.bets] });
    const noResult = (
      <Typography variant="body1">
        <FormattedMessage id="search.emptySearchResult" defaultMessage="Oops, your search has no results." />
      </Typography>
    );

    return (
      <Fragment>
        <div>
          <Tabs indicatorColor="primary" value={this.state.tabIdx} onChange={this.handleTabChange} className={classes.searchTabWrapper}>
            <Tab label={this.getTabLabel(EventStatus.BET)} className={classes.searchTabButton} />
            <Tab label={this.getTabLabel(EventStatus.VOTE)} className={classes.searchTabButton} />
            <Tab label={this.getTabLabel(EventStatus.SET)} className={classes.searchTabButton} />
            <Tab label={this.getTabLabel(EventStatus.FINALIZE)} className={classes.searchTabButton} />
            <Tab label={this.getTabLabel(EventStatus.WITHDRAW)} className={classes.searchTabButton} />
          </Tabs>
          <div className={classes.searchTabContainer}>
            <Grid container spacing={theme.padding.sm.value}>
              {list.length === 0 && !loading ? noResult : this.state.events}
            </Grid>
          </div>
        </div>
      </Fragment>
    );
  }
}

const NoResult = () => (
  <Typography variant="body1">
    <FormattedMessage id="search.emptySearchResult" defaultMessage="Oops, your search has no results." />
  </Typography>
);
