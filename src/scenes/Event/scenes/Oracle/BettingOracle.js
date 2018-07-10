/* eslint-disable */
import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Grid } from '@material-ui/core';
import { EventWarning, ImportantNote, TxConfirmDialog } from 'components';
import Transactions from '../../components/EventTxHistory';
import { Row, Content, Title, Button, Option } from './components';
import { Sidebar } from './Sidebar';


export const BettingOracle = observer(({ oracle, oraclePage }) => (
  <Row>
    <Content>
      <Title>{oracle.name}</Title>
      {!oracle.unconfirmed && <EventWarning id={oraclePage.eventWarningMessageId} amount={oraclePage.amount} type={oraclePage.warningType} />}
      <BetOptions oracle={oracle} />
      {/* ImportantNote <ConsensusThreshold /> RESULT SET */}
      {/* UNCOFIRMED, RESULST SET, VOTE, FINALIZE */}
      {oracle.unconfirmed && <ImportantNote heading='str.unconfirmed' message='oracle.eventUnconfirmed' />}
      {(!oracle.unconfirmed || oracle.phase !== 'UNCONFIRMED') && (
        <Fragment>
          <BetButton onClick={oraclePage.prepareBet} disabled={oraclePage.isPending} />
          {/* <EventResultHistory oracles={oracles} /> ONLY VOTE & FINALIZE */}
          <Transactions type='oracle' options={oracle.options} />
        </Fragment>
      )}
    </Content>
    <Sidebar oracle={oracle} />
    <BetTxConfirmDialog />
  </Row>
));

const BetTxConfirmDialog = inject('store')(injectIntl(observer(({ store: { oraclePage }, intl }) => {
  const { oracle } = oraclePage;
  return (
    <TxConfirmDialog
      onClose={() => oraclePage.confirmDialogOpen = false /* eslint-disable-line no-param-reassign */}
      onConfirm={oraclePage.confirm}
      txFees={oracle.txFees}
      open={oraclePage.confirmDialogOpen}
      txToken={oracle.token}
      txAmount={oraclePage.amount}
      txDesc={intl.formatMessage({ id: 'txConfirmMsg.bet' }, { option: oracle.selectedOption.name })}
    />
  );
})));

const BetOptions = observer(({ oracle }) => (
  <Grid item xs={12} lg={9}>
    {oracle.options.map((option, i) => (
      <Option
        key={i /* eslint-disable-line */}
        option={option}
        showAmountInput
        skipExpansion={false}
        amountInputDisabled={false}
      />
    ))}
  </Grid>
));

const BetButton = props => <Button {...props}><FormattedMessage id="bottomButtonText.placeBet" defaultMessage="Place Bet" /></Button>;
