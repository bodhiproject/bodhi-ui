import React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { Grid } from '@material-ui/core';
import { EventWarning, ImportantNote } from 'components';
import { Sidebar, Row, Content, Title, Button, Option, ResultHistory, TransactionHistory } from '../components';

const messages = defineMessages({
  oracleConsensusThresholdMsg: {
    id: 'oracle.consensusThreshold',
    defaultMessage: 'Consensus Threshold',
  },
  oracleSetResultExplanationMsg: {
    id: 'oracle.setResultExplanation',
    defaultMessage: 'Setting the result requires staking the Consensus Threshold amount.',
  },
});

const VotingOracle = observer(({ store: { eventPage, eventPage: { oracle } } }) => (
  <Row>
    <Content>
      <Title>{oracle.name}</Title>
      {!oracle.isArchived && (
        <EventWarning id={eventPage.eventWarningMessageId} amount={eventPage.amount} type={eventPage.warningType} />
      )}
      <Options oracle={oracle} />
      <ConsensusThresholdNote consensusThreshold={oracle.consensusThreshold} />
      <VoteButton eventpage={eventPage} />
      <ResultHistory oracles={eventPage.oracles} currentEvent={oracle} />
      <TransactionHistory options={oracle.options} />
    </Content>
    <Sidebar />
  </Row>
));

const ConsensusThresholdNote = injectIntl(({ intl, consensusThreshold }) => {
  const heading = `${intl.formatMessage(messages.oracleConsensusThresholdMsg)} ${consensusThreshold} BOT`;
  const message = intl.formatMessage(messages.oracleSetResultExplanationMsg);
  return <ImportantNote heading={heading} message={message} />;
});

const Options = observer(({ oracle: { options, isArchived, consensusThreshold } }) => (
  <Container>
    {options.map((option, i) => <Option key={i} disabled={isArchived} option={option} amountPlaceholder={(consensusThreshold - option.amount).toFixed(2).toString()} />)}
  </Container>
));

const Container = styled(Grid)`
  min-width: 75%;
`;

const VoteButton = props => {
  const { oracle, vote, isPending, buttonDisabled } = props.eventpage;
  return !oracle.isArchived && (
    <Button {...props} onClick={vote} disabled={isPending || buttonDisabled}>
      <FormattedMessage id="bottomButtonText.arbitrate" defaultMessage="Arbitrate" />
    </Button>
  );
};

export default injectIntl(inject('store')(VotingOracle));
