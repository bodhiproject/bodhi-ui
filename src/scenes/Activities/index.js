import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Tabs, { Tab } from 'material-ui/Tabs';
import { withStyles } from 'material-ui/styles';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import classNames from 'classnames';

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

const EventSetIdx = EventStatus.Set;
const EventFinalizeIdx = EventStatus.Finalize;
const EventWithdrawIdx = EventStatus.Withdraw;

class Activities extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabIdx: 0,
      tabCount: {
        EventSetIdx: 0,
        EventFinalizeIdx: 0,
        EventWithdrawIdx: 0,
      },
    };

    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleEventCountUpdate = this.handleEventCountUpdate.bind(this);
  }

  render() {
    const { classes } = this.props;
    const { tabIdx, tabCount } = this.state;

    return (
      <div>
        <Tabs indicatorColor="primary" value={tabIdx} onChange={this.handleTabChange} className={classes.activitiesTabWrapper}>
          <Tab label={`${this.props.intl.formatMessage(messages.set)} (${tabCount[EventSetIdx]})`} />
          <Tab label={`${this.props.intl.formatMessage(messages.finalize)} (${tabCount[EventFinalizeIdx]})`} />
          <Tab label={`${this.props.intl.formatMessage(messages.withdraw)} (${tabCount[EventWithdrawIdx]})`} />
          <Tab label={this.props.intl.formatMessage(messages.history)} />
        </Tabs>
        <div className={classNames(classes.activitiesTabContainer, tabIdx !== 0 ? 'hidden' : '')}>
          <EventCardsGridContainer
            eventStatusIndex={EventStatus.Set}
            handleEventCountUpdate={this.handleEventCountUpdate}
          />
        </div>
        <div className={classNames(classes.activitiesTabContainer, tabIdx !== 1 ? 'hidden' : '')}>
          <EventCardsGridContainer
            eventStatusIndex={EventStatus.Finalize}
            handleEventCountUpdate={this.handleEventCountUpdate}
          />
        </div>
        <div className={classNames(classes.activitiesTabContainer, tabIdx !== 2 ? 'hidden' : '')}>
          <EventCardsGridContainer
            eventStatusIndex={EventStatus.Withdraw}
            handleEventCountUpdate={this.handleEventCountUpdate}
          />
        </div>
        <div className={classNames(classes.activitiesTabContainer, tabIdx !== 3 ? 'hidden' : '')}>
          <EventHistory />
        </div>
      </div>
    );
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
  // eslint-disable-next-line react/no-typos
  intl: intlShape.isRequired,
};

export default injectIntl(withStyles(styles, { withTheme: true })(Activities));
