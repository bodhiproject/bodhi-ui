import React, { Fragment } from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { Grid } from '@material-ui/core';
import { EventWarning, ImportantNote } from 'components';
import { Sidebar, Row, Content, Title, Button, Option, TransactionHistory, OracleTxConfirmDialog } from '../components';

const messages = defineMessages({
  unconfirmedMessage: {
    id: 'str.unconfirmed',
    defaultMessage: 'Unconfirmed',
  },
  eventUnconfirmedMessage: {
    id: 'oracle.eventUnconfirmed',
    defaultMessage: 'This created Event is unconfirmed. You cannot interact with it until it is confirmed by the blockchain.',
  },
  txConfirmMsgBetMsg: {
    id: 'txConfirmMsg.bet',
    defaultMessage: 'bet on {option}',
  },
});

const BettingOracle = observer(({ store: { eventPage, eventPage: { oracle } } }) => (
  <Row>
    <Content>
      <Title>{oracle.name}</Title>
      {!oracle.unconfirmed
        && !oracle.isArchived
        && <EventWarning id={eventPage.eventWarningMessageId} amount={eventPage.amount} type={eventPage.warningType} />
      }
      <Options oracle={oracle} />
      {oracle.unconfirmed && <EventUnconfirmedNote />}
      {!oracle.unconfirmed && (
        <Fragment>
          {!oracle.isArchived
            && <BetButton onClick={eventPage.prepareBet} disabled={eventPage.isPending || eventPage.buttonDisabled} />
          }
          <TransactionHistory type='oracle' options={oracle.options} />
        </Fragment>
      )}
    </Content>
    <Sidebar />
    <OracleTxConfirmDialog id={messages.txConfirmMsgBetMsg.id} />
  </Row>
));

const EventUnconfirmedNote = injectIntl(({ intl: { formatMessage } }) => (
  <ImportantNote
    heading={formatMessage(messages.unconfirmedMessage)}
    message={formatMessage(messages.eventUnconfirmedMessage)}
  />
));

const Options = observer(({ oracle }) => (
  <Container>
    {oracle.options.map((option, i) => <Option key={i} option={option} disabled={oracle.isArchived} />)}
  </Container>
));

const Container = styled(Grid)`
  min-width: 75%;
`;

const BetButton = props => (
  <Button {...props}><FormattedMessage id="bottomButtonText.placeBet" defaultMessage="Place Bet" /></Button>
);

export default injectIntl(inject('store')(BettingOracle));
