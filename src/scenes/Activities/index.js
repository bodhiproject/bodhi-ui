import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Tabs, Tab, withStyles } from '@material-ui/core';
import { injectIntl, intlShape, defineMessages } from 'react-intl';
import { Routes, EventStatus } from 'constants';

import ResultSetting from './ResultSetting';
import Withdraw from './Withdraw';
import ActivityHistory from './ActivityHistory';
import styles from './styles';
const { SET, WITHDRAW, ACTIVITY_HISTORY } = Routes;

const TAB_HISTORY = 0;
const TAB_SET = 1;
const TAB_WITHDRAW = 2;

const messages = defineMessages({
  set: {
    id: 'activitiesTab.Set',
    defaultMessage: 'Result Setting',
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


@withStyles(styles, { withTheme: true })
@injectIntl
@inject('store')
@observer
export default class Activities extends Component {
  static propTypes = {
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    match: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
  }

  tabIdx = { // Determine tab index based on path
    [SET]: TAB_SET,
    [WITHDRAW]: TAB_WITHDRAW,
    [ACTIVITY_HISTORY]: TAB_HISTORY,
  }[this.props.match.path]

  getTabLabel = (eventStatusIndex) => {
    const { store: { global }, intl } = this.props;

    let label;
    let count;
    switch (eventStatusIndex) {
      case EventStatus.SET: {
        label = intl.formatMessage(messages.set);
        count = global.userData.resultSettingCount;
        break;
      }
      case EventStatus.WITHDRAW: {
        label = intl.formatMessage(messages.withdraw);
        count = global.userData.withdrawCount;
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
        this.props.history.push(Routes.SET);
        break;
      }
      case TAB_WITHDRAW: {
        this.props.history.push(Routes.WITHDRAW);
        break;
      }
      case TAB_HISTORY: {
        this.props.history.push(Routes.ACTIVITY_HISTORY);
        break;
      }
      default: {
        throw new Error(`Invalid tab index: ${value}`);
      }
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Tabs
          indicatorColor="primary"
          value={this.tabIdx}
          onChange={this.handleTabChange}
          className={classes.activitiesTabWrapper}
          scrollable
          scrollButtons='off'
        >
          <Tab
            label={this.props.intl.formatMessage(messages.history)}
            className={classes.activitiesTabButton}
            classes={{ label: classes.activitiesTabLabel }}
          />
          <Tab
            label={this.getTabLabel(EventStatus.SET)}
            className={classes.activitiesTabButton}
            classes={{ label: classes.activitiesTabLabel }}
          />
          <Tab
            label={this.getTabLabel(EventStatus.WITHDRAW)}
            className={classes.activitiesTabButton}
            classes={{ label: classes.activitiesTabLabel }}
          />
        </Tabs>
        <div className={classes.activitiesTabContainer}>
          {this.tabIdx === TAB_HISTORY && <ActivityHistory />}
          {this.tabIdx === TAB_SET && <ResultSetting />}
          {this.tabIdx === TAB_WITHDRAW && <Withdraw />}
        </div>
      </div>
    );
  }
}
