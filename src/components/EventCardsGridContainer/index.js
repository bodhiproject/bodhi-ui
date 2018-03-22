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
    topics: PropTypes.array,
    getOracles: PropTypes.func,
    oracles: PropTypes.array,
    eventStatusIndex: PropTypes.number.isRequired,
    sortBy: PropTypes.string,
    syncBlockNum: PropTypes.number,
    lastUsedAddress: PropTypes.string.isRequired,
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    getMoreOracles: PropTypes.func.isRequired,
    getMoreTopics: PropTypes.func.isRequired,
  };

  static defaultProps = {
    getTopics: undefined,
    topics: [],
    getOracles: undefined,
    oracles: [],
    sortBy: SortBy.Ascending,
    syncBlockNum: undefined,
  };

  state = {
    skip: 0,
    hint: false,
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
      || sortBy !== this.props.sortBy) {
      this.executeGraphRequest(eventStatusIndex, sortBy, LIMIT, SKIP);
      this.setState({ skip: 0 });
    }
    if (syncBlockNum !== this.props.syncBlockNum && this.props.syncBlockNum !== 0) {
      this.setState({ hint: true });
      setTimeout(() => {
        this.setState({ hint: false });
      }, 3000);
    }
  }

  loadMoreOracles = () => {
    let { skip } = this.state;
    const {
      eventStatusIndex,
      sortBy,
      lastUsedAddress,
      getMoreOracles,
      getMoreTopics,
    } = this.props;
    skip += LIMIT;


    this.setState({ skip });
    const sortDirection = this.props.sortBy || SortBy.Ascending;

    switch (eventStatusIndex) {
      case EventStatus.Bet: {
        getMoreOracles(
          [
            { token: Token.Qtum, status: OracleStatus.Voting },
            { token: Token.Qtum, status: OracleStatus.Created },
          ],
          { field: 'endTime', direction: sortDirection },
          LIMIT,
          skip,
        );
        break;
      }
      case EventStatus.Set: {
        getMoreOracles(
          [
            { token: Token.Qtum, status: OracleStatus.WaitResult, resultSetterQAddress: lastUsedAddress },
            { token: Token.Qtum, status: OracleStatus.OpenResultSet },
          ],
          { field: 'resultSetEndTime', direction: sortDirection },
          LIMIT,
          skip,
        );
        break;
      }
      case EventStatus.Vote: {
        getMoreOracles(
          [
            { token: Token.Bot, status: OracleStatus.Voting },
          ],
          { field: 'endTime', direction: sortDirection },
          LIMIT,
          skip,
        );
        break;
      }
      case EventStatus.Finalize: {
        getMoreOracles(
          [
            { token: Token.Bot, status: OracleStatus.WaitResult },
          ],
          { field: 'endTime', direction: sortDirection },
          LIMIT,
          skip,
        );
        break;
      }
      case EventStatus.Withdraw: {
        getMoreTopics(
          [
            { status: OracleStatus.Withdraw },
          ],
          { field: 'blockNum', direction: sortDirection },
          LIMIT,
          skip,
        );
        break;
      }
      default: {
        throw new RangeError(`Invalid tab position ${eventStatusIndex}`);
      }
    }
  }

  render() {
    const { theme, eventStatusIndex, topics, oracles, sortBy, classes } = this.props; // eslint-disable-line
    let rowItems = [];
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
      <span>
        <InfiniteScroll
          spacing={theme.padding.sm.value}
          data={rowItems}
          loadMore={this.loadMoreOracles}
          hasMore={rowItems.length >= this.state.skip + LIMIT}
        />
        {this.state.hint && (
          <EventWarning
            message={<FormattedMessage id="str.newBlock" defaultMessage="New block comes, you can refresh to get new data" />}
            typeClass={EventWarningType.Highlight}

            className={classes.hint}
          />
        )}
      </span>
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
          skip
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
    getMoreTopics: (filters, orderBy, limit, skip) => dispatch(graphqlActions.getMoreTopics(filters, orderBy, limit, skip)),
    getOracles: (filters, orderBy, limit, skip) => dispatch(graphqlActions.getOracles(filters, orderBy, limit, skip)),
    getMoreOracles: (filters, orderBy, limit, skip) => dispatch(graphqlActions.getMoreOracles(filters, orderBy, limit, skip)),
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(EventCardsGrid)));
