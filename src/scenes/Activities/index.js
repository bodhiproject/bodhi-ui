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
  constructor(props) {
    super(props);

    this.state = {
      tabIdx: 0,
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

    let label;
    let count;
    switch (eventStatusIndex) {
      case EventStatus.Set: {
        label = intl.formatMessage(messages.set);
        count = actionableItemCount && actionableItemCount.setResult.length;
        break;
      }
      case EventStatus.Finalize: {
        label = intl.formatMessage(messages.finalize);
        count = actionableItemCount && actionableItemCount.finalize.length;
        break;
      }
      case EventStatus.Withdraw: {
        label = intl.formatMessage(messages.withdraw);
        count = actionableItemCount && actionableItemCount.withdraw.length;
        break;
      }
      default:
        break;
    }

    let countText = '';
    if (count > 0) {
      countText = ` (${count})`;
    }
    return `${label}${countText}`;
  }

  handleTabChange(event, value) {
    this.setState({ tabIdx: value });
  }
}

Activities.propTypes = {
  history: PropTypes.object.isRequired,
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
