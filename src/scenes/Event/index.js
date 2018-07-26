import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { TxSentDialog, Loading as _Loading } from 'components';
import { Phases } from 'constants';
import BettingOracle from './BettingOracle';
import VotingOracle from './VotingOracle';
import FinalizingOracle from './FinalizingOracle';
import ResultSettingOracle from './ResultSettingOracle';
// import WithdrawingTopic from './WithdrawingTopic';
import BackButton from '../../components/BackButton';


@withRouter
@inject('store')
@observer
export default class EventPage extends Component {
  componentDidMount() {
    const type = this.props.match.path === '/topic/:address' ? 'topic' : 'oracle';
    this.props.store.eventPage.init({ ...this.props.match.params, type });
  }

  componentWillUnmount() {
    this.props.store.eventPage.reset();
  }

  render() {
    const { eventPage } = this.props.store;
    if (eventPage.loading) return <Loading text='Loading Oracle...' />;
    const { event } = eventPage;
    const EventDetailPage = {
      BETTING: BettingOracle,
      VOTING: VotingOracle,
      RESULT_SETTING: ResultSettingOracle,
      FINALIZING: FinalizingOracle,
      // WITHDRAWING: WithdrawingTopic,
    }[event.phase];

    let props = {};
    if (event.phase === Phases.WITHDRAWING) {
      props = {
        topic: event,
      };
    } else {
      props = {
        oracle: event,
      };
    }

    return (
      <Fragment>
        <BackButton />
        <EventDetailPage {...props} eventPage={eventPage} />
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
    txid={eventPage.oracle.txid}
    open={eventPage.txSentDialogOpen}
    onClose={() => eventPage.txSentDialogOpen = false}
  />
));
