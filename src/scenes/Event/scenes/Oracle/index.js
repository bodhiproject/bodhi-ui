import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { BettingOracle } from './BettingOracle';
import BackButton from '../../../../components/BackButton';

const VotingOracle = () => <div />;
const ResultSettingOracle = () => <div />;
const FinalizingOracle = () => <div />;


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
    // console.log('ORACLE: ', oracle);
    const Oracle = {
      BETTING: BettingOracle,
      UNCONFIRMED: BettingOracle,
      VOTING: VotingOracle,
      PENDING: VotingOracle,
      RESULT_SETTING: ResultSettingOracle,
      FINALIZING: FinalizingOracle,
    }[oracle.phase];

    return (
      <Fragment>
        <BackButton />
        <Oracle oracle={oracle} oraclePage={oraclePage} />
      </Fragment>
    );
  }
}
