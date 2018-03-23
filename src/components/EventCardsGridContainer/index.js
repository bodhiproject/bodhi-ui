/* eslint react/no-array-index-key: 0, no-nested-ternary: 0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import EventWarning from '../EventWarning/index';
import graphqlActions from '../../redux/Graphql/actions';
import { Token, OracleStatus, SortBy, EventStatus, EventWarningType } from '../../constants';
import EventCard from '../EventCard/index';
import EventsEmptyBg from '../EventsEmptyBg/index';
import styles from './styles';
import InfiniteScroll from '../InfiniteScroll/index';

const messages = defineMessages({
  placeBet: {
    id: 'bottomButtonText.placeBet',
    defaultMessage: 'Place Bet',
  },
  setResult: {
    id: 'str.setResult',
    defaultMessage: 'Set Result',
  },
  vote: {
    id: 'bottomButtonText.vote',
    defaultMessage: 'Place Vote',
  },
  finalizeResult: {
    id: 'str.finalizeResult',
    defaultMessage: 'Finalize Result',
  },
  withdraw: {
    id: 'str.withdraw',
    defaultMessage: 'Withdraw',
  },
});

const LIMIT = 8;
const SKIP = 0;

class EventCardsGrid extends React.Component {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    getTopics: PropTypes.func,
    topics: PropTypes.object,
    getOracles: PropTypes.func,
    oracles: PropTypes.object,
    eventStatusIndex: PropTypes.number.isRequired,
    sortBy: PropTypes.string,
    syncBlockNum: PropTypes.number,
    lastUsedAddress: PropTypes.string.isRequired,
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    classes: PropTypes.object,
  };

  static defaultProps = {
    getTopics: undefined,
    topics: {},
    getOracles: undefined,
    oracles: {},
    sortBy: SortBy.Ascending,
    syncBlockNum: undefined,
    classes: undefined,
  };

  state = {
    skip: 0,
  }

  componentWillMount() {
    const {
      eventStatusIndex,
      sortBy,
    } = this.props;

    this.executeGraphRequest(eventStatusIndex, sortBy, LIMIT, SKIP);
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
      this.executeGraphRequest(eventStatusIndex, sortBy, LIMIT, SKIP);
      this.setState({ skip: 0 });
    }
  }

  loadMoreOracles = () => {
    let { skip } = this.state;
    const {
      eventStatusIndex,
      sortBy,
    } = this.props;
    skip += LIMIT;
    this.executeGraphRequest(eventStatusIndex, sortBy, LIMIT, skip);
    this.setState({ skip });
  }

  render() {
    const {
      theme,
      eventStatusIndex,
      topics,
      oracles,
      sortBy,
      classes,
    } = this.props;
    let rowItems = [];
    switch (eventStatusIndex) {
      case EventStatus.Bet:
      case EventStatus.Set:
      case EventStatus.Vote:
      case EventStatus.Finalize: {
        if (!_.isNil(oracles.data) && oracles.data.length !== 0) {
          rowItems = this.renderOracles(oracles.data, eventStatusIndex);
        } else {
          rowItems = <EventsEmptyBg />;
        }

        break;
      }
      case EventStatus.Withdraw: {
        if (!_.isNil(topics.data) && topics.data.length !== 0) {
          rowItems = this.renderTopics(topics.data);
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
      <InfiniteScroll
        spacing={theme.padding.sm.value}
        data={rowItems}
        loadMore={this.loadMoreOracles}
        hasMore={rowItems.length >= this.state.skip + LIMIT}
      />
    );
  }

  executeGraphRequest(eventStatusIndex, sortBy, limit, skip) {
    const {
      getTopics,
      getOracles,
      lastUsedAddress,
    } = this.props;

    const sortDirection = sortBy || SortBy.Ascending;
    switch (eventStatusIndex) {
      case EventStatus.Bet: {
        getOracles(
          [
            { token: Token.Qtum, status: OracleStatus.Voting },
            { token: Token.Qtum, status: OracleStatus.Created },
          ],
          { field: 'endTime', direction: sortDirection },
          limit,
          skip,
        );
        break;
      }
      case EventStatus.Set: {
        getOracles(
          [
            { token: Token.Qtum, status: OracleStatus.WaitResult, resultSetterQAddress: lastUsedAddress },
            { token: Token.Qtum, status: OracleStatus.OpenResultSet },
          ],
          { field: 'resultSetEndTime', direction: sortDirection },
          limit,
          skip,
        );
        break;
      }
      case EventStatus.Vote: {
        getOracles(
          [
            { token: Token.Bot, status: OracleStatus.Voting },
          ],
          { field: 'endTime', direction: sortDirection },
          limit,
          skip,
        );
        break;
      }
      case EventStatus.Finalize: {
        getOracles(
          [
            { token: Token.Bot, status: OracleStatus.WaitResult },
          ],
          { field: 'endTime', direction: sortDirection },
          limit,
          skip,
        );
        break;
      }
      case EventStatus.Withdraw: {
        getTopics(
          [
            { status: OracleStatus.Withdraw },
          ],
          { field: 'blockNum', direction: sortDirection },
          limit,
          skip,
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
          buttonText = this.props.intl.formatMessage(messages.placeBet);
          break;
        }
        case EventStatus.Set: {
          buttonText = this.props.intl.formatMessage(messages.setResult);
          break;
        }
        case EventStatus.Vote: {
          buttonText = this.props.intl.formatMessage(messages.vote);
          break;
        }
        case EventStatus.Finalize: {
          buttonText = this.props.intl.formatMessage(messages.finalizeResult);
          break;
        }
        default: {
          throw new RangeError(`Invalid tab position ${eventStatusIndex}`);
        }
      }

      const amount = parseFloat(_.sum(oracle.amounts).toFixed(2));

      // Constructing Card element on the right
      const oracleEle = (
        <EventCard
          key={oracle.txid}
          name={oracle.name}
          url={`/oracle/${oracle.topicAddress}/${oracle.address}/${oracle.txid}`}
          endTime={eventStatusIndex === EventStatus.Set ? oracle.resultSetEndTime : oracle.endTime}
          amountLabel={`${amount} ${oracle.token}`}
          buttonText={buttonText}
          unconfirmed={!oracle.topicAddress && !oracle.address}
        />
      );

      rowItems.push(oracleEle);
    });

    return rowItems;
  }

  renderTopics(topicEvents) {
    const rowItems = [];

    _.each(topicEvents, (topic) => {
      const totalQTUM = parseFloat(_.sum(topic.qtumAmount).toFixed(2));
      const totalBOT = parseFloat(_.sum(topic.botAmount).toFixed(2));
      const unconfirmed = false;

      const amountLabel = `${totalQTUM} QTUM, ${totalBOT} BOT`;

      // Constructing Card element on the right
      const topicEle = (
        <EventCard
          key={topic.txid}
          name={topic.name}
          url={`/topic/${topic.address}`}
          amountLabel={amountLabel}
          buttonText={this.props.intl.formatMessage(messages.withdraw)}
          unconfirmed={unconfirmed}
        />
      );

      rowItems.push(topicEle);
    });

    return rowItems;
  }
}

const mapStateToProps = (state) => ({
  topics: state.Graphql.get('getTopicsReturn'),
  oracles: state.Graphql.get('getOraclesReturn'),
  sortBy: state.Dashboard.get('sortBy'),
  syncBlockNum: state.App.get('syncBlockNum'),
  lastUsedAddress: state.App.get('lastUsedAddress'),
});

function mapDispatchToProps(dispatch) {
  return {
    getTopics: (filters, orderBy, limit, skip) => dispatch(graphqlActions.getTopics(filters, orderBy, limit, skip)),
    getOracles: (filters, orderBy, limit, skip) => dispatch(graphqlActions.getOracles(filters, orderBy, limit, skip)),
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(EventCardsGrid)));
