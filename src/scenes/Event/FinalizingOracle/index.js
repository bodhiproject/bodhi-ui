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
      {!oracle.unconfirmed && <EventWarning id={eventPage.eventWarningMessageId} amount={eventPage.amount} type={eventPage.warningType} />}
      <Options oracle={oracle} />
      {oracle.unconfirmed && <ImportantNote heading='str.unconfirmed' message='oracle.eventUnconfirmed' />}
      <FinalizeButton onClick={eventPage.finalize} disabled={eventPage.isPending || eventPage.buttonDisabled} />
      <ResultHistory oracles={eventPage.oracles} currentEvent={oracle} />
      <TransactionHistory type='oracle' options={oracle.options} />
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

const FinalizeButton = props => <Button {...props}><FormattedMessage id="str.finalizeResult" defaultMessage="Finalize Result" /></Button>;

export default injectIntl(inject('store')(FinalizingOracle));
