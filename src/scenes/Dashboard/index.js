/* eslint react/no-array-index-key: 0, no-nested-ternary:0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier

import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import EventIcon from 'material-ui-icons/Event';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';

import graphqlActions from '../../redux/Graphql/actions';
import TopActions from './components/TopActions/index';
import { Token, OracleStatus, SortBy } from '../../constants';
import DashboardCard from './components/DashboardCard/index';
import styles from './styles';

const TAB_BET = 0;
const TAB_SET = 1;
const TAB_VOTE = 2;
const TAB_FINALIZE = 3;
const TAB_WITHDRAW = 4;
const DEFAULT_TAB_INDEX = TAB_BET;

const messages = defineMessages({
  Bet: {
    id: 'dashboard.Bet',
    defaultMessage: 'Bet',
  },
  Set: {
    id: 'dashboard.Set',
    defaultMessage: 'Set',
  },
  Vote: {
    id: 'dashboard.Vote',
    defaultMessage: 'Vote',
  },
  Finalize: {
    id: 'dashboard.Finalize',
    defaultMessage: 'Finalize',
  },
  Withdraw: {
    id: 'dashboard.Withdraw',
    defaultMessage: 'Withdraw',
  },
  betend: {
    id: 'dashboard.betend',
    defaultMessage: 'Betting ends',
  },
  resultsetend: {
    id: 'dashboard.resultsetend',
    defaultMessage: 'Result setting ends',
  },
  voteend: {
    id: 'dashboard.voteend',
    defaultMessage: 'Voting ends',
  },
  voteended: {
    id: 'dashboard.voteended',
    defaultMessage: 'Voting ended',
  },
  raise: {
    id: 'str.raise',
    defaultMessage: 'Raised',
  },
  end: {
    id: 'str.end',
    defaultMessage: 'Ended',
  },
  pbet: {
    id: 'bottombutton.placebet',
    defaultMessage: 'Place Bet',
  },
  pset: {
    id: 'bottombutton.setresult',
    defaultMessage: 'Set Result',
  },
  pvote: {
    id: 'bottombutton.vote',
    defaultMessage: 'Place Vote',
  },
  pfinal: {
    id: 'bottombutton.final',
    defaultMessage: 'Finalize Result',
  },
});

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.renderEmptyList = this.renderEmptyList.bind(this);
  }

  componentWillMount() {
    this.executeGraphRequest(this.props.tabIndex);
  }

  componentWillReceiveProps(nextProps) {
    const {
      tabIndex,
      sortBy,
      syncBlockNum,
    } = nextProps;

    if (tabIndex !== this.props.tabIndex
      || sortBy !== this.props.sortBy
      || syncBlockNum !== this.props.syncBlockNum) {
      this.executeGraphRequest(tabIndex, sortBy);
    }
  }

  render() {
    const {
      theme,
      tabIndex,
      getTopicsReturn,
      getOraclesReturn,
    } = this.props;
    const topics = getTopicsReturn;
    const oracles = getOraclesReturn;

    let rowItems;
    switch (tabIndex) {
      case TAB_BET:
      case TAB_SET:
      case TAB_VOTE:
      case TAB_FINALIZE: {
        if (oracles.length) {
          rowItems = this.renderOracles(oracles, tabIndex);
        } else {
          rowItems = this.renderEmptyList();
        }

        break;
      }
      case TAB_WITHDRAW: {
        if (topics.length) {
          rowItems = this.renderTopics(topics);
        } else {
          rowItems = this.renderEmptyList();
        }

        break;
      }
      default: {
        throw new RangeError(`Invalid tab position ${tabIndex}`);
      }
    }

    return (
      <div>
        <TopActions />
        <Grid container spacing={theme.padding.sm.value}>
          {rowItems}
        </Grid>
      </div>
    );
  }

  executeGraphRequest(tabIndex, sortBy) {
    const {
      getTopics,
      getOracles,
    } = this.props;

    const sortDirection = sortBy || SortBy.Ascending;

    switch (tabIndex) {
      case TAB_BET: {
        getOracles(
          [
            { token: Token.Qtum, status: OracleStatus.Voting },
          ],
          { field: 'endTime', direction: sortDirection },
        );
        break;
      }
      case TAB_SET: {
        getOracles(
          [
            { token: Token.Qtum, status: OracleStatus.WaitResult },
            { token: Token.Qtum, status: OracleStatus.OpenResultSet },
          ],
          { field: 'resultSetEndTime', direction: sortDirection },
        );
        break;
      }
      case TAB_VOTE: {
        getOracles(
          [
            { token: Token.Bot, status: OracleStatus.Voting },
          ],
          { field: 'endTime', direction: sortDirection },
        );
        break;
      }
      case TAB_FINALIZE: {
        getOracles(
          [
            { token: Token.Bot, status: OracleStatus.WaitResult },
          ],
          { field: 'endTime', direction: sortDirection },
        );
        break;
      }
      case TAB_WITHDRAW: {
        getTopics(
          [
            { status: OracleStatus.Withdraw },
          ],
          { field: 'blockNum', direction: sortDirection },
        );
        break;
      }
      default: {
        throw new RangeError(`Invalid tab position ${tabIndex}`);
      }
    }
  }

  renderEmptyList() {
    const {
      classes,
    } = this.props;

    return (
      <div className={classes.dashboardEmptyWrapper}>
        <EventIcon className={classes.dashboardEmptyIcon} fontSize />
        <Typography variant="body1">No Event at Current Status</Typography>
      </div>
    );
  }

  renderOracles(oracles, tabIndex) {
    const rowItems = [];
    _.each(oracles, (oracle) => {
      let buttonText;
      switch (tabIndex) {
        case TAB_BET: {
          buttonText = this.props.intl.formatMessage(messages.pbet);
          break;
        }
        case TAB_SET: {
          buttonText = this.props.intl.formatMessage(messages.pset);
          break;
        }
        case TAB_VOTE: {
          buttonText = this.props.intl.formatMessage(messages.pvote);
          break;
        }
        case TAB_FINALIZE: {
          buttonText = this.props.intl.formatMessage(messages.pfinal);
          break;
        }
        default: {
          throw new RangeError(`Invalid tab position ${tabIndex}`);
        }
      }

      const totalQTUM = _.sum(oracle.amounts);

      // Constructing Card element on the right
      const oracleEle = (
        <DashboardCard
          key={oracle.address}
          name={oracle.name}
          url={`/oracle/${oracle.topicAddress}/${oracle.address}`}
          endTime={tabIndex === TAB_SET ? oracle.resultSetEndTime : oracle.endTime}
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
        <DashboardCard
          key={topic.address}
          name={topic.name}
          url={`/topic/${topic.address}`}
          totalQTUM={totalQTUM}
          totalBOT={totalBOT}
          buttonText={this.props.intl.formatMessage({ id: 'bottombutton.withdraw' })}
        />
      );

      rowItems.push(topicEle);
    });

    return rowItems;
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  getTopics: PropTypes.func,
  getTopicsReturn: PropTypes.array,
  getOracles: PropTypes.func,
  getOraclesReturn: PropTypes.array,
  tabIndex: PropTypes.number,
  sortBy: PropTypes.string,
  syncBlockNum: PropTypes.number,
  // eslint-disable-next-line react/no-typos
  intl: intlShape.isRequired,
};

Dashboard.defaultProps = {
  getTopics: undefined,
  getTopicsReturn: [],
  getOracles: undefined,
  getOraclesReturn: [],
  tabIndex: DEFAULT_TAB_INDEX,
  sortBy: undefined,
  syncBlockNum: undefined,
};

const mapStateToProps = (state) => ({
  getTopicsReturn: state.Graphql.get('getTopicsReturn'),
  getOraclesReturn: state.Graphql.get('getOraclesReturn'),
  tabIndex: state.Dashboard.get('tabIndex'),
  sortBy: state.Dashboard.get('sortBy'),
  syncBlockNum: state.App.get('syncBlockNum'),
});

function mapDispatchToProps(dispatch) {
  return {
    getTopics: (filters, orderBy) => dispatch(graphqlActions.getTopics(filters, orderBy)),
    getOracles: (filters, orderBy) => dispatch(graphqlActions.getOracles(filters, orderBy)),
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(Dashboard)));
