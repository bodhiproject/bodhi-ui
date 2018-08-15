import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { TxSentDialog, Loading as _Loading } from 'components';
import { defineMessages } from 'react-intl';
import BettingOracle from './BettingOracle';
import VotingOracle from './VotingOracle';
import FinalizingOracle from './FinalizingOracle';
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
    const type = this.props.match.path === '/topic/:address' ? 'topic' : 'oracle';
    this.props.store.eventPage.init({ ...this.props.match.params, type });
  }

  render() {
    const { eventPage } = this.props.store;
    if (eventPage.loading) {
      return <Loading text={messages.loadOracleMsg} />;
    }

    const { event } = eventPage;
    const Event = {
      BETTING: BettingOracle,
      VOTING: VotingOracle,
      RESULT_SETTING: ResultSettingOracle,
      FINALIZING: FinalizingOracle,
      WITHDRAWING: WithdrawingTopic,
    }[event.phase];
    // TODO: crashes here because event.phase is undefined.

    // TODO: can probably remove this eventually, but
    // need to update all Oracles pages to accept `event` prop instead of `oracle`
    let props = {};
    if (event.type === 'oracle') {
      props = {
        oracle: event,
      };
    } else {
      props = {
        event,
      };
    }

    return (
      <Fragment>
        <BackButton />
        <Event {...props} eventPage={eventPage} />
        <EventTxSuccessDialog eventPage={eventPage} />
      </Fragment>
    );
  }
}

const Loading = styled(_Loading)`
  margin-top: 25rem;
  .animation {
    width: 5rem;
    height: 5rem;
  }
`;

const EventTxSuccessDialog = observer(({ eventPage }) => (
  <TxSentDialog
    txid={eventPage.event.txid}
    open={eventPage.txSentDialogOpen}
    onClose={() => eventPage.txSentDialogOpen = false}
  />
));
