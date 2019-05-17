import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import { Loading } from 'components';
import { EventType } from 'constants';

import BettingOracle from './BettingOracle';
import VotingOracle from './VotingOracle';
import ResultSettingOracle from './ResultSettingOracle';
import WithdrawingTopic from './WithdrawingTopic';
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
    const { path, params } = this.props.match;
    console.log('TCL: EventPage -> componentDidMount -> params', params);
    const type = EventType.ORACLE;
    // if (path.startsWith('/topic')) {
    //   type = EventType.TOPIC;
    // } else if (path.startsWith('/oracle')) {
    //   const { hashId } = params;
    //   if (hashId) {
    //     type = EventType.UNCONFIRMED;
    //   } else {
    //     type = EventType.ORACLE;
    //   }
    // }
    this.props.store.eventPage.init({ ...params, type });
  }

  componentWillUnmount() {
    this.props.store.eventPage.reset();
  }

  render() {
    const { eventPage } = this.props.store;
    const { event, loading } = eventPage;
    console.log('TCL: EventPage -> render -> event', event);
    console.log('TCL: EventPage -> render -> eventPage', eventPage);
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
