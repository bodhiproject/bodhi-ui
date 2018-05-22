import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Tabs, { Tab } from 'material-ui/Tabs';
import { withStyles } from 'material-ui/styles';
import { injectIntl, intlShape, defineMessages } from 'react-intl';

import EventCardsGridContainer from '../../components/EventCardsGridContainer/index';
import EventHistory from './scenes/EventHistory/index';
import { RouterPath, EventStatus } from '../../constants';
import styles from './styles';

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
  actionableItemCount: state.graphql.actionableItemCount,
}))
export default class Activities extends Component {
  static propTypes = {
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    actionableItemCount: PropTypes.object,
  };

  static defaultProps = {
    actionableItemCount: undefined,
  };

  constructor(props) {
    super(props);

    // Determine tab index based on path
    let tabIdx;
    switch (this.props.match.path) {
      case RouterPath.set: {
        tabIdx = TAB_SET;
        break;
      }
      case RouterPath.finalize: {
        tabIdx = TAB_FINALIZE;
        break;
      }
      case RouterPath.withdraw: {
        tabIdx = TAB_WITHDRAW;
        break;
      }
      case RouterPath.activityHistory: {
        tabIdx = TAB_HISTORY;
        break;
      }
      default: {
        break;
      }
    }

    this.state = {
      tabIdx,
    };

    this.getTabLabel = this.getTabLabel.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
  }

  render() {
    const { classes, history } = this.props;
    const { tabIdx } = this.state;

    return (
      <div>
        <Tabs indicatorColor="primary" value={tabIdx} onChange={this.handleTabChange} className={classes.activitiesTabWrapper}>
          <Tab label={this.getTabLabel(EventStatus.Set)} />
          <Tab label={this.getTabLabel(EventStatus.Finalize)} />
          <Tab label={this.getTabLabel(EventStatus.Withdraw)} />
          <Tab label={this.props.intl.formatMessage(messages.history)} />
        </Tabs>
        <div className={classes.activitiesTabContainer}>
          {tabIdx === TAB_SET && <EventCardsGridContainer eventStatusIndex={EventStatus.Set} />}
          {tabIdx === TAB_FINALIZE && <EventCardsGridContainer eventStatusIndex={EventStatus.Finalize} />}
          {tabIdx === TAB_WITHDRAW && <EventCardsGridContainer eventStatusIndex={EventStatus.Withdraw} />}
          {tabIdx === TAB_HISTORY && <EventHistory history={history} />}
        </div>
      </div>
    );
  }

  getTabLabel(eventStatusIndex) {
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

  handleTabChange(event, value) {
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
}
