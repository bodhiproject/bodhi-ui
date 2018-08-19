import React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { Grid } from '@material-ui/core';
import { EventWarning, ImportantNote } from 'components';
import { Sidebar, Row, Content, Title, Button, Option, ResultHistory, TransactionHistory, OracleTxConfirmDialog } from '../components';

const messages = defineMessages({
  txConfirmMsgSetMsg: {
    id: 'txConfirmMsg.set',
    defaultMessage: 'set the result as {option}',
  },
});

const FinalizingOracle = observer(({ store: { eventPage, eventPage: { oracle } } }) => (
  <Row>
    <Content>
      <Title>{oracle.name}</Title>
      {!oracle.isArchived && (
        <EventWarning id={eventPage.eventWarningMessageId} amount={eventPage.amount} type={eventPage.warningType} />
      )}
      <Options oracle={oracle} />
      {oracle.unconfirmed && <ImportantNote heading='str.unconfirmed' message='oracle.eventUnconfirmed' />}
      <FinalizeButton eventpage={eventPage} />
      <ResultHistory oracles={eventPage.oracles} currentEvent={oracle} />
      <TransactionHistory options={oracle.options} />
    </Content>
    <Sidebar />
    <OracleTxConfirmDialog id={messages.txConfirmMsgSetMsg.id} />
  </Row>
));

const Options = observer(({ oracle }) => (
  <Container>
    {oracle.options.map((option, i) => (
      <Option
        key={i}
        option={option}
        showAmountInput={false}
        skipExpansion
      />
    ))}
  </Container>
));

const Container = styled(Grid)`
  min-width: 75%;
`;

const FinalizeButton = props => {
  const { oracle, finalize, isPending, buttonDisabled } = props.eventpage;
  return !oracle.isArchived && (
    <Button {...props} onClick={finalize} disabled={isPending || buttonDisabled}>
      <FormattedMessage id="str.finalizeResult" defaultMessage="Finalize Result" />
    </Button>
  );
};

export default injectIntl(inject('store')(FinalizingOracle));
