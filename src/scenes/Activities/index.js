import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Tabs, { Tab } from 'material-ui/Tabs';
import { withStyles } from 'material-ui/styles';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';

import EventCardsGridContainer from '../../components/EventCardsGridContainer/index';
import EventHistory from './scenes/EventHistory/index';
import { EventStatus } from '../../constants';
import styles from './styles';

const messages = defineMessages({
  set: {
    id: 'activitiesTab.Set',
    defaultMessage: 'Result Setting',
  },
  finalize: {
    id: 'activitiesTab.Finalize',
    defaultMessage: 'Finalize',
  },
  withdraw: {
    id: 'activitiesTab.Withdraw',
    defaultMessage: 'Withdraw',
  },
  history: {
    id: 'activitiesTab.History',
    defaultMessage: 'Activities History',
  },
});

class Activities extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabIdx: 0,
      tabCount: {
        [EventStatus.Set]: 0,
        [EventStatus.Finalize]: 0,
        [EventStatus.Withdraw]: 0,
      },
    };

    this.getTabLabel = this.getTabLabel.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleEventCountUpdate = this.handleEventCountUpdate.bind(this);
  }

  render() {
    const { classes, actionableItemCount } = this.props;
    const { tabIdx, tabCount } = this.state;

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
          {tabIdx === 3 && <EventHistory />}
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

  handleEventCountUpdate(index, value) {
    const { tabCount } = this.state;

    tabCount[index] = value;
    this.setState({ tabCount });
  }

  handleTabChange(event, value) {
    this.setState({ tabIdx: value });
  }
}

Activities.propTypes = {
  classes: PropTypes.object.isRequired,
  actionableItemCount: PropTypes.object,
  // eslint-disable-next-line react/no-typos
  intl: intlShape.isRequired,
};

Activities.defaultProps = {
  actionableItemCount: undefined,
};

const mapStateToProps = (state) => ({
  ...state.App.toJS(),
  actionableItemCount: state.Graphql.get('actionableItemCount'),
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withStyles(styles, { withTheme: true })(Activities)));
