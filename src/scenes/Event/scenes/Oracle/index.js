/* eslint-disable */
import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { TxSentDialog, Loading as _Loading } from 'components';
import BettingOracle from './BettingOracle';
import VotingOracle from './VotingOracle';
import FinalizingOracle from './FinalizingOracle';
import ResultSettingOracle from './ResultSettingOracle';
import BackButton from '../../../../components/BackButton';


@withRouter
@inject('store')
@observer
export default class OraclePage extends Component {
  componentDidMount() {
    this.props.store.oraclePage.init(this.props.match.params);
  }

  componentWillUnmount() {
    this.props.store.oraclePage.reset();
  }

  render() {
    const { oraclePage } = this.props.store;
    if (oraclePage.loading) return <Loading text='Loading Oracle...' />
    const { oracle } = oraclePage;
    // if (!oracle) { // TODO: workaround for now, there's gotta be a better way
    //   window.location = '/';
    //   return;
    // }
    if (oracle.phase === 'WITHDRAWING') {
      // TODO: make it work w/ history.push
      // this.props.history.push(`/topic/${oracle.topicAddress}`);
      window.location = `/topic/${oracle.topicAddress}`;
    }
    const Oracle = {
      BETTING: BettingOracle,
      VOTING: VotingOracle,
      RESULT_SETTING: ResultSettingOracle,
      FINALIZING: FinalizingOracle,
    }[oracle.phase];

    return (
      <Fragment>
        <BackButton />
        <Oracle oracle={oracle} oraclePage={oraclePage} />
        <EventTxSuccessDialog eventPage={oraclePage} />
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