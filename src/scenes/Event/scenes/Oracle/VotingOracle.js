/* eslint-disable */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Grid } from '@material-ui/core';
import { EventWarning, ImportantNote } from 'components';
import Transactions from '../../components/EventTxHistory';
import { Row, Content, Title, Button, Option, OracleTxConfirmDialog } from './components';
import { Sidebar } from './Sidebar';


const VotingOracle = observer(({ store: { oraclePage, oraclePage: { oracle } } }) => (
  <Row>
    <Content>
      <Title>{oracle.name}</Title>
      {!oracle.unconfirmed && <EventWarning id={oraclePage.eventWarningMessageId} amount={oraclePage.amount} type={oraclePage.warningType} />}
      <Options oracle={oracle} />
      <ConsensusThresholdNote consensusThreshold={oracle.consensusThreshold} />
      <VoteButton onClick={oraclePage.prepareVote} disabled={oraclePage.isPending} />
      {/* <EventResultHistory oracles={oracles} /> ONLY VOTE & FINALIZE */}
      <Transactions type='oracle' options={oracle.options} />
    </Content>
    <Sidebar oracle={oracle} />
    <OracleTxConfirmDialog id='txConfirmMsg.set' />
  </Row>
));

const ConsensusThresholdNote = injectIntl(({ intl, consensusThreshold }) => {
  const heading = `${intl.formatMessage({ id: 'oracle.consensusThreshold' })} ${consensusThreshold} BOT`;
  const message = intl.formatMessage({ id: 'oracle.setResultExplanation' })
  return <ImportantNote heading={heading} message={message} />;
});

const Options = observer(({ oracle }) => (
  <Grid item xs={12} lg={9}>
    {oracle.options.map((option, i) => <Option key={i} option={option} />)}
  </Grid>
));

const VoteButton = props => <Button {...props}><FormattedMessage id="bottomButtonText.arbitrate" defaultMessage="Arbitrate" /></Button>;

export default injectIntl(inject('store')(VotingOracle));
