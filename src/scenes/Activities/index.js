import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { connect } from 'react-redux';
import { Tabs, Tab, withStyles } from '@material-ui/core';
import { injectIntl, intlShape, defineMessages } from 'react-intl';
import { Routes, EventStatus } from 'constants';
import _ from 'lodash';

import ResultSetting from './scenes/ResultSetting';
import Finalize from './scenes/Finalize';
import Withdraw from './scenes/Withdraw';
import EventHistory from './scenes/EventHistory';
import styles from './styles';
<<<<<<< HEAD
const { SET, FINALIZE, WITHDRAW, ACTIVITY_HISTORY } = Routes;
=======
const { SET, FINALIZE, WITHDRAW, ACTIVITY_HISTORY } = AppLocation;
>>>>>>> change all, all testing passed

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
    [SET]: TAB_SET,
    [FINALIZE]: TAB_FINALIZE,
    [WITHDRAW]: TAB_WITHDRAW,
    [ACTIVITY_HISTORY]: TAB_HISTORY,
  }[this.props.match.path]

  componentDidMount() {
<<<<<<< HEAD
    this.props.store.ui.location = _.invert(Routes)[this.props.match.path];
=======
    const locations = {
      [SET]: AppLocation.SET,
      [FINALIZE]: AppLocation.FINALIZE,
      [WITHDRAW]: AppLocation.WITHDRAW,
      [ACTIVITY_HISTORY]: AppLocation.ACTIVITY_HISTORY,
    };
    const appLocation = locations[this.props.match.path];
    this.props.store.ui.location = appLocation;
>>>>>>> change all, all testing passed
  }

  getTabLabel = (eventStatusIndex) => {
    const { actionableItemCount, intl } = this.props;

    let label;
    let count;
    switch (eventStatusIndex) {
      case EventStatus.SET: {
        label = intl.formatMessage(messages.set);
        count = actionableItemCount[EventStatus.SET];
        break;
      }
      case EventStatus.FINALIZE: {
        label = intl.formatMessage(messages.finalize);
        count = actionableItemCount[EventStatus.FINALIZE];
        break;
      }
      case EventStatus.WITHDRAW: {
        label = intl.formatMessage(messages.withdraw);
        count = actionableItemCount[EventStatus.WITHDRAW];
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
<<<<<<< HEAD
        this.props.history.push(Routes.SET);
        break;
      }
      case TAB_FINALIZE: {
        this.props.history.push(Routes.FINALIZE);
        break;
      }
      case TAB_WITHDRAW: {
        this.props.history.push(Routes.WITHDRAW);
        break;
      }
      case TAB_HISTORY: {
        this.props.history.push(Routes.ACTIVITY_HISTORY);
=======
        this.props.history.push(AppLocation.SET);
        break;
      }
      case TAB_FINALIZE: {
        this.props.history.push(AppLocation.FINALIZE);
        break;
      }
      case TAB_WITHDRAW: {
        this.props.history.push(AppLocation.WITHDRAW);
        break;
      }
      case TAB_HISTORY: {
        this.props.history.push(AppLocation.ACTIVITY_HISTORY);
>>>>>>> change all, all testing passed
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
          <Tab label={this.getTabLabel(EventStatus.SET)} className={classes.activitiesTabButton} />
          <Tab label={this.getTabLabel(EventStatus.FINALIZE)} className={classes.activitiesTabButton} />
          <Tab label={this.getTabLabel(EventStatus.WITHDRAW)} className={classes.activitiesTabButton} />
          <Tab label={this.props.intl.formatMessage(messages.history)} className={classes.activitiesTabButton} />
        </Tabs>
        <div className={classes.activitiesTabContainer}>
          {this.tabIdx === TAB_SET && <ResultSetting />}
          {this.tabIdx === TAB_FINALIZE && <Finalize />}
          {this.tabIdx === TAB_WITHDRAW && <Withdraw />}
          {this.tabIdx === TAB_HISTORY && <EventHistory history={history} />}
        </div>
      </div>
    );
  }
}
