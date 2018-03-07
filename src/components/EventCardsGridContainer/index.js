/* eslint react/no-array-index-key: 0, no-nested-ternary:0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import EventIcon from 'material-ui-icons/Event';
import { withStyles } from 'material-ui/styles';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';

import graphqlActions from '../../redux/Graphql/actions';
import { Token, OracleStatus, SortBy, EventStatus } from '../../constants';
import EventCard from '../EventCard/index';
import EventsEmptyBg from '../EventsEmptyBg/index';
import styles from './styles';

const messages = defineMessages({
  pbet: {
    id: 'bottomButtonText.placeBet',
    defaultMessage: 'Place Bet',
  },
  pset: {
    id: 'bottomButtonText.setResult',
    defaultMessage: 'Set Result',
  },
  pvote: {
    id: 'bottomButtonText.vote',
    defaultMessage: 'Place Vote',
  },
  pfinal: {
    id: 'bottomButtonText.final',
    defaultMessage: 'Finalize Result',
  },
});

class EventCardsGrid extends React.Component {
  componentWillMount() {
    this.executeGraphRequest(this.props.eventStatusIndex);
  }

  componentWillReceiveProps(nextProps) {
    const {
      eventStatusIndex,
      sortBy,
      syncBlockNum,
    } = nextProps;

    if (eventStatusIndex !== this.props.eventStatusIndex
      || sortBy !== this.props.sortBy
      || syncBlockNum !== this.props.syncBlockNum) {
      this.executeGraphRequest(eventStatusIndex, sortBy);
    }
  }

  render() {
    const {
      theme,
      eventStatusIndex,
      getTopicsReturn,
      getOraclesReturn,
    } = this.props;

    const topics = getTopicsReturn;
    const oracles = getOraclesReturn;

    let rowItems;
    switch (eventStatusIndex) {
      case EventStatus.Bet:
      case EventStatus.Set:
      case EventStatus.Vote:
      case EventStatus.Finalize: {
        if (oracles.length) {
          rowItems = this.renderOracles(oracles, eventStatusIndex);
        } else {
          rowItems = <EventsEmptyBg />;
        }

        break;
      }
      case EventStatus.Withdraw: {
        if (topics.length) {
          rowItems = this.renderTopics(topics);
        } else {
          rowItems = <EventsEmptyBg />;
        }

        break;
      }
      default: {
        throw new RangeError(`Invalid tab position ${eventStatusIndex}`);
      }
    }

    return (
      <Grid container spacing={theme.padding.sm.value}>
        {rowItems}
      </Grid>
    );
  }

  executeGraphRequest(eventStatusIndex, sortBy) {
    const {
      getTopics,
      getOracles,
    } = this.props;

    const sortDirection = sortBy || SortBy.Ascending;

    switch (eventStatusIndex) {
      case EventStatus.Bet: {
        getOracles(
          [
            { token: Token.Qtum, status: OracleStatus.Voting },
          ],
          { field: 'endTime', direction: sortDirection },
        );
        break;
      }
      case EventStatus.Set: {
        getOracles(
          [
            { token: Token.Qtum, status: OracleStatus.WaitResult },
            { token: Token.Qtum, status: OracleStatus.OpenResultSet },
          ],
          { field: 'resultSetEndTime', direction: sortDirection },
        );
        break;
      }
      case EventStatus.Vote: {
        getOracles(
          [
            { token: Token.Bot, status: OracleStatus.Voting },
          ],
          { field: 'endTime', direction: sortDirection },
        );
        break;
      }
      case EventStatus.Finalize: {
        getOracles(
          [
            { token: Token.Bot, status: OracleStatus.WaitResult },
          ],
          { field: 'endTime', direction: sortDirection },
        );
        break;
      }
      case EventStatus.Withdraw: {
        getTopics(
          [
            { status: OracleStatus.Withdraw },
          ],
          { field: 'blockNum', direction: sortDirection },
        );
        break;
      }
      default: {
        throw new RangeError(`Invalid tab position ${eventStatusIndex}`);
      }
    }
  }

  renderOracles(oracles, eventStatusIndex) {
    const rowItems = [];
    _.each(oracles, (oracle) => {
      let buttonText;
      switch (eventStatusIndex) {
        case EventStatus.Bet: {
          buttonText = this.props.intl.formatMessage(messages.pbet);
          break;
        }
        case EventStatus.Set: {
          buttonText = this.props.intl.formatMessage(messages.pset);
          break;
        }
        case EventStatus.Vote: {
          buttonText = this.props.intl.formatMessage(messages.pvote);
          break;
        }
        case EventStatus.Finalize: {
          buttonText = this.props.intl.formatMessage(messages.pfinal);
          break;
        }
        default: {
          throw new RangeError(`Invalid tab position ${eventStatusIndex}`);
        }
      }

      const totalQTUM = _.sum(oracle.amounts);

      // Constructing Card element on the right
      const oracleEle = (
        <EventCard
          key={oracle.address}
          name={oracle.name}
          url={`/oracle/${oracle.topicAddress}/${oracle.address}`}
          endTime={eventStatusIndex === EventStatus.Set ? oracle.resultSetEndTime : oracle.endTime}
          totalQTUM={totalQTUM}
          buttonText={buttonText}
        />
      );

      rowItems.push(oracleEle);
    });

    return rowItems;
  }

  renderTopics(topicEvents) {
    const rowItems = [];

    _.each(topicEvents, (topic) => {
      const totalQTUM = _.sum(topic.qtumAmount);
      const totalBOT = _.sum(topic.botAmount);

      // Constructing Card element on the right
      const topicEle = (
        <EventCard
          key={topic.address}
          name={topic.name}
          url={`/topic/${topic.address}`}
          totalQTUM={totalQTUM}
          totalBOT={totalBOT}
          buttonText={this.props.intl.formatMessage({ id: 'bottomButtonText.withdraw' })}
        />
      );

      rowItems.push(topicEle);
    });

    return rowItems;
  }
}

EventCardsGrid.propTypes = {
  theme: PropTypes.object.isRequired,
  getTopics: PropTypes.func,
  getTopicsReturn: PropTypes.array,
  getOracles: PropTypes.func,
  getOraclesReturn: PropTypes.array,
  eventStatusIndex: PropTypes.number.isRequired,
  sortBy: PropTypes.string,
  syncBlockNum: PropTypes.number,
  // eslint-disable-next-line react/no-typos
  intl: intlShape.isRequired,
};

EventCardsGrid.defaultProps = {
  getTopics: undefined,
  getTopicsReturn: [],
  getOracles: undefined,
  getOraclesReturn: [],
  sortBy: SortBy.Ascending,
  syncBlockNum: undefined,
};

const mapStateToProps = (state) => ({
  getTopicsReturn: state.Graphql.get('getTopicsReturn'),
  getOraclesReturn: state.Graphql.get('getOraclesReturn'),
  sortBy: state.Dashboard.get('sortBy'),
  syncBlockNum: state.App.get('syncBlockNum'),
});

function mapDispatchToProps(dispatch) {
  return {
    getTopics: (filters, orderBy) => dispatch(graphqlActions.getTopics(filters, orderBy)),
    getOracles: (filters, orderBy) => dispatch(graphqlActions.getOracles(filters, orderBy)),
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(EventCardsGrid)));
