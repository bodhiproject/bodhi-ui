/* eslint react/no-array-index-key: 0, no-nested-ternary: 0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { withStyles } from 'material-ui/styles';
import { injectIntl, intlShape, defineMessages } from 'react-intl';

import styles from './styles';
import { AppLocation, Token, OracleStatus, SortBy, EventStatus, TransactionType, TransactionStatus } from '../../constants';
import appActions from '../../redux/App/actions';
import graphqlActions from '../../redux/Graphql/actions';
import EventCard from '../EventCard/index';
import EventsEmptyBg from '../EventsEmptyBg/index';
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
  arbitrate: {
    id: 'bottomButtonText.arbitrate',
    defaultMessage: 'Arbitrate',
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

const { Pending } = TransactionStatus;
const LIMIT = 50;
const SKIP = 0;


@injectIntl
@withStyles(styles, { withTheme: true })
@connect((state) => ({
  topics: state.Graphql.get('getTopicsReturn'),
  oracles: state.Graphql.get('getOraclesReturn'),
  sortBy: state.Dashboard.get('sortBy'),
  syncBlockNum: state.App.get('syncBlockNum'),
  walletAddresses: state.App.get('walletAddresses'),
}), (dispatch) => ({
  setAppLocation: (location) => dispatch(appActions.setAppLocation(location)),
  getActionableTopics: (walletAddresses, orderBy, limit, skip) =>
    dispatch(graphqlActions.getActionableTopics(walletAddresses, orderBy, limit, skip)),
  getOracles: (filters, orderBy, limit, skip, exclude) => dispatch(graphqlActions.getOracles(filters, orderBy, limit, skip, exclude)),
}))
export default class EventCardsGrid extends Component {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    getActionableTopics: PropTypes.func.isRequired,
    topics: PropTypes.object,
    getOracles: PropTypes.func,
    oracles: PropTypes.object,
    eventStatusIndex: PropTypes.number.isRequired,
    sortBy: PropTypes.string,
    syncBlockNum: PropTypes.number,
    setAppLocation: PropTypes.func.isRequired,
    walletAddresses: PropTypes.array.isRequired,
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    status: PropTypes.string,
  };

  static defaultProps = {
    topics: {},
    getOracles: undefined,
    oracles: {},
    sortBy: SortBy.Ascending,
    syncBlockNum: undefined,
    status: '',
  };

  state = {
    skip: 0,
  }

  get oracles() {
    const { oracles, eventStatusIndex, intl: { formatMessage } } = this.props;

    const buttonText = {
      [EventStatus.Bet]: formatMessage(messages.placeBet),
      [EventStatus.Set]: formatMessage(messages.setResult),
      [EventStatus.Vote]: formatMessage(messages.arbitrate),
      [EventStatus.Finalize]: formatMessage(messages.finalizeResult),
      [EventStatus.Withdraw]: formatMessage(messages.withdraw),
    }[eventStatusIndex];

    const { ApproveSetResult, SetResult, ApproveVote, Vote, FinalizeResult, Bet } = TransactionType;
    const pendingTypes = {
      [EventStatus.Set]: [ApproveSetResult, SetResult],
      [EventStatus.Vote]: [ApproveVote, Vote],
      [EventStatus.Finalize]: [FinalizeResult],
      [EventStatus.Bet]: [Bet],
    }[eventStatusIndex] || [];

    return (_.get(oracles, 'data', [])).map((oracle) => {
      const amount = parseFloat(_.sum(oracle.amounts).toFixed(2));
      const isPending = oracle.transactions.some(({ type, status }) => pendingTypes.includes(type) && status === Pending);
      const isUpcoming = eventStatusIndex === EventStatus.Vote && oracle.status === OracleStatus.WaitResult;
      return {
        amountLabel: eventStatusIndex !== EventStatus.Finalize ? `${amount} ${oracle.token}` : '',
        url: `/oracle/${oracle.topicAddress}/${oracle.address}/${oracle.txid}`,
        endTime: eventStatusIndex === EventStatus.Set ? oracle.resultSetEndTime : oracle.endTime,
        unconfirmed: (!oracle.topicAddress && !oracle.address) || isPending,
        buttonText,
        isUpcoming,
        ...oracle,
      };
    });
  }

  get topics() {
    const { WithdrawEscrow, Withdraw } = TransactionType;
    return _.get(this.props.topics, 'data', []).map((topic) => {
      const totalQTUM = parseFloat(_.sum(topic.qtumAmount).toFixed(2));
      const totalBOT = parseFloat(_.sum(topic.botAmount).toFixed(2));
      const pendingTypes = [WithdrawEscrow, Withdraw];
      const isPending = topic.transactions.some(({ type, status }) => pendingTypes.includes(type) && status === Pending);
      const isUpcoming = false;
      return {
        amountLabel: `${totalQTUM} QTUM, ${totalBOT} BOT`,
        unconfirmed: isPending,
        url: `/topic/${topic.address}`,
        buttonText: this.props.intl.formatMessage(messages.withdraw),
        isUpcoming,
        ...topic,
      };
    });
  }

  componentWillMount() {
    const { eventStatusIndex, sortBy, walletAddresses } = this.props;

    this.setAppLocation(eventStatusIndex);
    this.executeGraphRequest(eventStatusIndex, sortBy, LIMIT, SKIP, walletAddresses);
  }

  componentWillReceiveProps(nextProps) {
    const { eventStatusIndex, sortBy, syncBlockNum, walletAddresses } = nextProps;

    if (eventStatusIndex !== this.props.eventStatusIndex
      || sortBy !== this.props.sortBy
      || syncBlockNum !== this.props.syncBlockNum
      || walletAddresses !== this.props.walletAddresses) {
      const addresses = walletAddresses || this.props.walletAddresses;
      this.executeGraphRequest(eventStatusIndex, sortBy, LIMIT, SKIP, addresses);
      this.setState({ skip: 0 });
    }
  }

  loadMoreData = () => {
    let { skip } = this.state;
    const { eventStatusIndex, sortBy, walletAddresses } = this.props;
    skip += LIMIT;
    this.executeGraphRequest(eventStatusIndex, sortBy, LIMIT, skip, walletAddresses);
    this.setState({ skip });
  }

  setAppLocation = (eventStatusIndex) => {
    const locations = {
      [EventStatus.Bet]: AppLocation.qtumPrediction,
      [EventStatus.Set]: AppLocation.resultSet,
      [EventStatus.Vote]: AppLocation.botCourt,
      [EventStatus.Finalize]: AppLocation.finalize,
      [EventStatus.Withdraw]: AppLocation.withdraw,
    };
    this.props.setAppLocation(locations[eventStatusIndex]);
  }

  executeGraphRequest(eventStatusIndex, sortBy, limit, skip, walletAddresses) {
    const { getActionableTopics, getOracles } = this.props;

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
        const filters = [{ token: Token.Qtum, status: OracleStatus.OpenResultSet }];
        _.each(walletAddresses, (addressObj) => {
          filters.push({
            token: Token.Qtum,
            status: OracleStatus.WaitResult,
            resultSetterQAddress: addressObj.address,
          });
        });

        getOracles(
          filters,
          { field: 'resultSetEndTime', direction: sortDirection },
          limit,
          skip,
        );
        break;
      }
      case EventStatus.Vote: {
        const excludeResultSetterQAddress = walletAddresses.map(({ address }) => address);
        getOracles(
          [
            { token: Token.Bot, status: OracleStatus.Voting },
            { token: Token.Qtum,
              status: OracleStatus.WaitResult,
              excludeResultSetterQAddress },
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
        getActionableTopics(
          walletAddresses,
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

  render() {
    const { theme, eventStatusIndex } = this.props;
    const { Withdraw } = EventStatus;

    const objs = eventStatusIndex === Withdraw ? this.topics : this.oracles;
    let rowItems = [];
    if (objs.length === 0) {
      rowItems = <EventsEmptyBg />;
    } else if (eventStatusIndex === Withdraw) {
      rowItems = objs.map((topic) => <EventCard key={topic.txid} {...topic} />);
    } else { // Bet, Set, Vote, Finalize
      rowItems = objs.map((oracle) => <EventCard key={oracle.txid} {...oracle} />);
    }

    return (
      <InfiniteScroll
        spacing={theme.padding.sm.value}
        data={rowItems}
        loadMore={this.loadMoreData}
        hasMore={rowItems.length >= this.state.skip + LIMIT}
      />
    );
  }
}
