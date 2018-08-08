import React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Grid } from '@material-ui/core';
import { EventWarning, ImportantNote } from 'components';
import TransactionHistory from '../components/TransactionHistory';
import ResultHistory from '../components/ResultHistory';
import { Row, Content, Title, Button, Option, OracleTxConfirmDialog } from '../components';
import { Sidebar } from '../components/Sidebar';


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
      <ResultHistory oracles={eventPage.oracles} />
      <TransactionHistory type='oracle' options={oracle.options} />
    </Content>
    <Sidebar />
    <OracleTxConfirmDialog id='txConfirmMsg.set' />
  </Row>
));

const ConsensusThresholdNote = injectIntl(({ intl, consensusThreshold }) => {
  const heading = `${intl.formatMessage({ id: 'oracle.consensusThreshold' })} ${consensusThreshold} BOT`;
  const message = intl.formatMessage({ id: 'oracle.setResultExplanation' });
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
