/* eslint react/no-array-index-key: 0, no-nested-ternary: 0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { withStyles } from 'material-ui/styles';
import { injectIntl, intlShape, defineMessages } from 'react-intl';

import styles from './styles';
import { AppLocation, Token, OracleStatus, SortBy, EventStatus } from '../../constants';
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
    getActionableTopics: PropTypes.func.isRequired,
    getTopicsReturn: PropTypes.object,
    getOracles: PropTypes.func,
    getOraclesReturn: PropTypes.object,
    eventStatusIndex: PropTypes.number.isRequired,
    sortBy: PropTypes.string,
    syncBlockNum: PropTypes.number,
    setAppLocation: PropTypes.func.isRequired,
    walletAddresses: PropTypes.array.isRequired,
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    classes: PropTypes.object,
  };

  static defaultProps = {
    getTopicsReturn: {},
    getOracles: undefined,
    getOraclesReturn: {},
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

    this.setAppLocation(eventStatusIndex);
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

  loadMoreData = () => {
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
      getTopicsReturn,
      getOraclesReturn,
      sortBy,
      classes,
    } = this.props;

    let rowItems = [];
    switch (eventStatusIndex) {
      case EventStatus.Bet:
      case EventStatus.Set:
      case EventStatus.Vote:
      case EventStatus.Finalize: {
        if (!_.isNil(getOraclesReturn.data) && getOraclesReturn.data.length !== 0) {
          rowItems = this.renderOracles(getOraclesReturn.data, eventStatusIndex);
        } else {
          rowItems = <EventsEmptyBg />;
        }

        break;
      }
      case EventStatus.Withdraw: {
        if (!_.isNil(getTopicsReturn.data) && getTopicsReturn.data.length !== 0) {
          rowItems = this.renderTopics(getTopicsReturn.data);
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
        loadMore={this.loadMoreData}
        hasMore={rowItems.length >= this.state.skip + LIMIT}
      />
    );
  }

  setAppLocation = (eventStatusIndex) => {
    const { setAppLocation } = this.props;

    switch (eventStatusIndex) {
      case EventStatus.Bet: {
        setAppLocation(AppLocation.qtumPrediction);
        break;
      }
      case EventStatus.Set: {
        setAppLocation(AppLocation.resultSet);
        break;
      }
      case EventStatus.Vote: {
        setAppLocation(AppLocation.botCourt);
        break;
      }
      case EventStatus.Finalize: {
        setAppLocation(AppLocation.finalize);
        break;
      }
      case EventStatus.Withdraw: {
        setAppLocation(AppLocation.withdraw);
        break;
      }
      default: {
        throw new RangeError(`Invalid tab position ${eventStatusIndex}`);
      }
    }
  };

  executeGraphRequest(eventStatusIndex, sortBy, limit, skip) {
    const {
      getActionableTopics,
      getOracles,
      walletAddresses,
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

  renderOracles(oracles, eventStatusIndex) {
    const rowItems = [];
    _.each(oracles, (oracle) => {
      const amount = parseFloat(_.sum(oracle.amounts).toFixed(2));
      let buttonText;
      let amountLabel = `${amount} ${oracle.token}`;
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
          amountLabel = undefined;
          break;
        }
        default: {
          throw new RangeError(`Invalid tab position ${eventStatusIndex}`);
        }
      }

      // Constructing Card element on the right
      const oracleEle = (
        <EventCard
          key={oracle.txid}
          name={oracle.name}
          url={`/oracle/${oracle.topicAddress}/${oracle.address}/${oracle.txid}`}
          endTime={eventStatusIndex === EventStatus.Set ? oracle.resultSetEndTime : oracle.endTime}
          amountLabel={amountLabel}
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
  getTopicsReturn: state.Graphql.get('getTopicsReturn'),
  getOraclesReturn: state.Graphql.get('getOraclesReturn'),
  sortBy: state.Dashboard.get('sortBy'),
  syncBlockNum: state.App.get('syncBlockNum'),
  walletAddresses: state.App.get('walletAddresses'),
});

function mapDispatchToProps(dispatch) {
  return {
    setAppLocation: (location) => dispatch(appActions.setAppLocation(location)),
    getActionableTopics: (walletAddresses, orderBy, limit, skip) =>
      dispatch(graphqlActions.getActionableTopics(walletAddresses, orderBy, limit, skip)),
    getOracles: (filters, orderBy, limit, skip) => dispatch(graphqlActions.getOracles(filters, orderBy, limit, skip)),
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(EventCardsGrid)));
