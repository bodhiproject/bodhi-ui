import React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { Grid } from '@material-ui/core';
import { EventWarning, ImportantNote } from 'components';
import { Sidebar, Row, Content, Title, Button, Option, TransactionHistory } from '../components';

const messages = defineMessages({
  consensusThreshold: {
    id: 'oracle.consensusThreshold',
    defaultMessage: 'Consensus Threshold',
  },
  setResultExplanation: {
    id: 'oracle.setResultExplanation',
    defaultMessage: 'Setting the result requires staking the Consensus Threshold amount.',
  },
});

const ResultSettingOracle = observer(({ store: { eventPage, eventPage: { oracle } } }) => (
  <Row>
    <Content>
      <Title>{oracle.name}</Title>
      {!oracle.isArchived && (
        <EventWarning id={eventPage.eventWarningMessageId} amount={eventPage.amount} type={eventPage.warningType} />
      )}
      <Options oracle={oracle} />
      <MustStakeConsensusThresold consensusThreshold={oracle.consensusThreshold} />
      <SetResultButton eventpage={eventPage} />
      <TransactionHistory options={oracle.options} />
    </Content>
    <Sidebar />
  </Row>
));

const MustStakeConsensusThresold = injectIntl(({ intl, consensusThreshold }) => {
  const heading = `${intl.formatMessage(messages.consensusThreshold)} ${consensusThreshold} BOT`;
  const message = intl.formatMessage(messages.setResultExplanation);
  return <ImportantNote heading={heading} message={message} />;
});

const Options = observer(({ oracle }) => (
  <Container>
    {oracle.options.map((option, i) => <Option key={i} option={option} amountInputDisabled />)}
  </Container>
));

const Container = styled(Grid)`
  min-width: 75%;
`;

const SetResultButton = props => {
  const { oracle, setResult, isPending, buttonDisabled } = props.eventpage;
  return !oracle.isArchived && (
    <Button {...props} onClick={setResult} disabled={isPending || buttonDisabled}>
      <FormattedMessage id="str.setResult" defaultMessage="Set Result" />
    </Button>
  );
};

export default injectIntl(inject('store')(ResultSettingOracle));
