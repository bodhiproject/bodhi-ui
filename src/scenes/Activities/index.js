import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { connect } from 'react-redux';
import { Tabs, Tab, withStyles } from '@material-ui/core';
import { injectIntl, intlShape, defineMessages } from 'react-intl';

import EventCardsGridContainer from '../../components/EventCardsGridContainer';
import EventHistory from './scenes/EventHistory';
import { RouterPath, EventStatus, AppLocation } from '../../constants';
import styles from './styles';
const { set, finalize, withdraw, activityHistory } = RouterPath;

const TAB_SET = 0;
const TAB_FINALIZE = 1;
const TAB_WITHDRAW = 2;
const TAB_HISTORY = 3;

const messages = defineMessages({
  set: {
    id: 'activitiesTab.Set',
    defaultMessage: 'Result Setting',
  },
  finalize: {
    id: 'str.finalize',
    defaultMessage: 'Finalize',
  },
  withdraw: {
    id: 'str.withdraw',
    defaultMessage: 'Withdraw',
  },
  history: {
    id: 'activitiesTab.History',
    defaultMessage: 'Activities History',
  },
});


@injectIntl
@withStyles(styles, { withTheme: true })
@connect((state) => ({
  ...state.App.toJS(),
  actionableItemCount: state.Graphql.get('actionableItemCount'),
}))
@inject('store')
@observer
export default class Activities extends Component {
  static propTypes = {
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    actionableItemCount: PropTypes.object,
  }

  static defaultProps = {
    actionableItemCount: undefined,
  }

  tabIdx = { // Determine tab index based on path
    [set]: TAB_SET,
    [finalize]: TAB_FINALIZE,
    [withdraw]: TAB_WITHDRAW,
    [activityHistory]: TAB_HISTORY,
  }[this.props.match.path]

  componentDidMount() {
    const locations = {
      [set]: AppLocation.resultSet,
      [finalize]: AppLocation.finalize,
      [withdraw]: AppLocation.withdraw,
      [activityHistory]: AppLocation.activityHistory,
    };
    const appLocation = locations[this.props.match.path];
    this.props.store.ui.location = appLocation;
  }

  getTabLabel = (eventStatusIndex) => {
    const { actionableItemCount, intl } = this.props;

    let label;
    let count;
    switch (eventStatusIndex) {
      case EventStatus.Set: {
        label = intl.formatMessage(messages.set);
        count = actionableItemCount[EventStatus.Set];
        break;
      }
      case EventStatus.Finalize: {
        label = intl.formatMessage(messages.finalize);
        count = actionableItemCount[EventStatus.Finalize];
        break;
      }
      case EventStatus.Withdraw: {
        label = intl.formatMessage(messages.withdraw);
        count = actionableItemCount[EventStatus.Withdraw];
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
    switch (value) {
      case TAB_SET: {
        this.props.history.push(RouterPath.set);
        break;
      }
      case TAB_FINALIZE: {
        this.props.history.push(RouterPath.finalize);
        break;
      }
      case TAB_WITHDRAW: {
        this.props.history.push(RouterPath.withdraw);
        break;
      }
      case TAB_HISTORY: {
        this.props.history.push(RouterPath.activityHistory);
        break;
      }
      default: {
        throw new Error(`Invalid tab index: ${value}`);
      }
    }
  }

  render() {
    const { classes, history } = this.props;

    return (
      <div>
        <Tabs indicatorColor="primary" value={this.tabIdx} onChange={this.handleTabChange} className={classes.activitiesTabWrapper}>
          <Tab label={this.getTabLabel(EventStatus.Set)} className={classes.activitiesTabButton} />
          <Tab label={this.getTabLabel(EventStatus.Finalize)} className={classes.activitiesTabButton} />
          <Tab label={this.getTabLabel(EventStatus.Withdraw)} className={classes.activitiesTabButton} />
          <Tab label={this.props.intl.formatMessage(messages.history)} className={classes.activitiesTabButton} />
        </Tabs>
        <div className={classes.activitiesTabContainer}>
          {this.tabIdx === TAB_SET && <EventCardsGridContainer eventStatusIndex={EventStatus.Set} />}
          {this.tabIdx === TAB_FINALIZE && <EventCardsGridContainer eventStatusIndex={EventStatus.Finalize} />}
          {this.tabIdx === TAB_WITHDRAW && <EventCardsGridContainer eventStatusIndex={EventStatus.Withdraw} />}
          {this.tabIdx === TAB_HISTORY && <EventHistory history={history} />}
        </div>
      </div>
    );
  }
}
