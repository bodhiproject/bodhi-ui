import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Tabs, { Tab } from 'material-ui/Tabs';
import { withStyles } from 'material-ui/styles';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';

import EventCardsGridContainer from '../../components/EventCardsGridContainer/index';
import EventHistory from './scenes/EventHistory/index';
import { RouterPath, EventStatus } from '../../constants';
import styles from './styles';

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

class Activities extends React.Component {
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
        tabIdx = 0;
        break;
      }
      case RouterPath.finalize: {
        tabIdx = 1;
        break;
      }
      case RouterPath.withdraw: {
        tabIdx = 2;
        break;
      }
      case RouterPath.activityHistory: {
        tabIdx = 3;
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
    const { classes, actionableItemCount, history } = this.props;
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
          {tabIdx === 0 && <EventCardsGridContainer eventStatusIndex={EventStatus.Set} />}
          {tabIdx === 1 && <EventCardsGridContainer eventStatusIndex={EventStatus.Finalize} />}
          {tabIdx === 2 && <EventCardsGridContainer eventStatusIndex={EventStatus.Withdraw} />}
          {tabIdx === 3 && <EventHistory history={history} />}
        </div>
      </div>
    );
  }

  getTabLabel(eventStatusIndex) {
    const { actionableItemCount, intl } = this.props;

    let countLabel = '';
    if (actionableItemCount && actionableItemCount.countByStatus[eventStatusIndex]) {
      countLabel = ` (${actionableItemCount.countByStatus[eventStatusIndex]})`;
    }

    switch (eventStatusIndex) {
      case EventStatus.Set:
        return `${intl.formatMessage(messages.set)}${countLabel}`;
      case EventStatus.Finalize:
        return `${intl.formatMessage(messages.finalize)}${countLabel}`;
      case EventStatus.Withdraw:
        return `${intl.formatMessage(messages.withdraw)}${countLabel}`;
      default:
        return null;
    }
  }

  handleTabChange(event, value) {
    switch (value) {
      case 0: {
        this.props.history.push(RouterPath.set);
        break;
      }
      case 1: {
        this.props.history.push(RouterPath.finalize);
        break;
      }
      case 2: {
        this.props.history.push(RouterPath.withdraw);
        break;
      }
      case 3: {
        this.props.history.push(RouterPath.activityHistory);
        break;
      }
      default: {
        throw new Error(`Invalid tab index: ${value}`);
      }
    }
  }
}

const mapStateToProps = (state) => ({
  ...state.App.toJS(),
  actionableItemCount: state.Graphql.get('actionableItemCount'),
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withStyles(styles, { withTheme: true })(Activities)));
