import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import { TxSentDialog, Loading as _Loading } from 'components';
import { EventType } from 'constants';

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
    let type;
    const { path, params } = this.props.match;
    if (path.startsWith('/topic')) {
      type = EventType.TOPIC;
    } else if (path.startsWith('/oracle')) {
      const { address, topicAddress } = params;
      if (address === 'null' || topicAddress === 'null') {
        type = EventType.UNCONFIRMED;
      } else {
        type = EventType.ORACLE;
      }
    }
    this.props.store.eventPage.init({ ...params, type });
  }

  componentWillUnmount() {
    this.props.store.eventPage.reset();
  }

  render() {
    const { eventPage } = this.props.store;
    const { event, loading } = eventPage;

    if (loading) {
      return <Loading text={messages.loadOracleMsg} />;
    }

    // Unconfirmed Oracle changed txid so Oracles query comes back empty. Return to Qtum Prediction.
    if (!event) {
      this.props.history.push('/');
      return;
    }

    const Event = {
      BETTING: BettingOracle,
      VOTING: VotingOracle,
      RESULT_SETTING: ResultSettingOracle,
      FINALIZING: FinalizingOracle,
      WITHDRAWING: WithdrawingTopic,
    }[event.phase];

    // TODO: can probably remove this eventually, but
    // need to update all Oracles pages to accept `event` prop instead of `oracle`
    let props = {};
    if (event.type === EventType.ORACLE) {
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
