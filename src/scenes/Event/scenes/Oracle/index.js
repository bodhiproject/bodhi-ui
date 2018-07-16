/* eslint-disable */
import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { TxSentDialog } from 'components';
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
    if (oraclePage.loading) return 'LOADING';
    const { oracle } = oraclePage;
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

const EventTxSuccessDialog = observer(({ eventPage }) => (
  <TxSentDialog
    txid={eventPage.oracle.txid}
    open={eventPage.txSentDialogOpen}
    onClose={() => eventPage.txSentDialogOpen = false}
  />
));