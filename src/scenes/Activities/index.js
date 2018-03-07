import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Tabs, { Tab } from 'material-ui/Tabs';
import { withStyles } from 'material-ui/styles';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';

import EventCardsGridContainer from '../../components/EventCardsGridContainer/index';
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
    };

    this.handleTabChange = this.handleTabChange.bind(this);
  }

  render() {
    const { classes } = this.props;
    const { tabIdx } = this.state;

    return (
      <div>
        <Tabs indicatorColor="primary" value={tabIdx} onChange={this.handleTabChange} className={classes.activitiesTabWrapper}>
          <Tab label={this.props.intl.formatMessage(messages.set)} />
          <Tab label={this.props.intl.formatMessage(messages.finalize)} />
          <Tab label={this.props.intl.formatMessage(messages.withdraw)} />
          <Tab label={this.props.intl.formatMessage(messages.history)} />
        </Tabs>
        <div className={classes.activitiesTabContainer}>
          {tabIdx === 0 && <EventCardsGridContainer eventStatusIndex={EventStatus.Set} />}
          {tabIdx === 1 && <EventCardsGridContainer eventStatusIndex={EventStatus.Finalize} />}
          {tabIdx === 2 && <EventCardsGridContainer eventStatusIndex={EventStatus.Withdraw} />}
          {tabIdx === 3 && <div>Activities history</div>}
        </div>
      </div>
    );
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
