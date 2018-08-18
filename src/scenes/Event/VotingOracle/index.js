import React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { Grid } from '@material-ui/core';
import { EventWarning, ImportantNote } from 'components';
import { Sidebar, Row, Content, Title, Button, Option, ResultHistory, TransactionHistory, OracleTxConfirmDialog } from '../components';

const messages = defineMessages({
  oracleConsensusThresholdMsg: {
    id: 'oracle.consensusThreshold',
    defaultMessage: 'Consensus Threshold',
  },
  oracleSetResultExplanationMsg: {
    id: 'oracle.setResultExplanation',
    defaultMessage: 'Setting the result requires staking the Consensus Threshold amount.',
  },
  txConfirmMsgVoteMsg: {
    id: 'txConfirmMsg.vote',
    defaultMessage: 'vote on {option}',
  },
});

const VotingOracle = observer(({ store: { eventPage, eventPage: { oracle } } }) => (
  <Row>
    <Content>
      <Title>{oracle.name}</Title>
      {!oracle.unconfirmed && !oracle.isArchived && <EventWarning id={eventPage.eventWarningMessageId} amount={eventPage.amount} type={eventPage.warningType} />}
      <Options oracle={oracle} />
      <ConsensusThresholdNote consensusThreshold={oracle.consensusThreshold} />
      {!oracle.isArchived && (
        <VoteButton onClick={eventPage.prepareVote} disabled={eventPage.isPending || eventPage.buttonDisabled} />
      )}
      <ResultHistory oracles={eventPage.oracles} currentEvent={oracle} />
      <TransactionHistory type='oracle' options={oracle.options} />
    </Content>
    <Sidebar />
    <OracleTxConfirmDialog id={messages.txConfirmMsgVoteMsg.id} />
  </Row>
));

const ConsensusThresholdNote = injectIntl(({ intl, consensusThreshold }) => {
  const heading = `${intl.formatMessage(messages.oracleConsensusThresholdMsg)} ${consensusThreshold} BOT`;
  const message = intl.formatMessage(messages.oracleSetResultExplanationMsg);
  return <ImportantNote heading={heading} message={message} />;
});

const Options = observer(({ oracle: { options, isArchived } }) => (
  <Container>
    {options.map((option, i) => <Option key={i} disabled={isArchived} option={option} />)}
  </Container>
));

const Container = styled(Grid)`
  min-width: 75%;
`;

const VoteButton = props => <Button {...props}><FormattedMessage id="bottomButtonText.arbitrate" defaultMessage="Arbitrate" /></Button>;

export default injectIntl(inject('store')(VotingOracle));
