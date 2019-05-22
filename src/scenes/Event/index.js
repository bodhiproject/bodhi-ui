import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import { Loading } from 'components';
import { EventType } from 'constants';

import BettingOracle from './BettingOracle';
import BackButton from '../../components/BackButton';


const messages = defineMessages({
  loadOracleMsg: {
    id: 'load.oracle',
    defaultMessage: 'Loading Oracle...',
  },
});

@withRouter
@inject('store')
@observer
export default class EventPage extends Component {
  componentDidMount() {
    const { params } = this.props.match;
    this.props.store.eventPage.init({ ...params });
  }

  componentWillUnmount() {
    this.props.store.eventPage.reset();
  }

  render() {
    const { eventPage } = this.props.store;
    const { event, loading } = eventPage;
    if (loading) {
      return <Loading text={messages.loadOracleMsg} event='true' />;
    }

    // const Event = {
    //   BETTING: BettingOracle,
    //   RESULT_SETTING: ResultSettingOracle,
    //   VOTING: VotingOracle,
    //   WITHDRAWING: WithdrawingTopic,
    // }[event.status];

    // console.log('TCL: EventPage -> render -> Event', Event);
    return (
      <Fragment>
        <BackButton />
        <BettingOracle eventPage={eventPage} />
      </Fragment>
    );
  }
}
