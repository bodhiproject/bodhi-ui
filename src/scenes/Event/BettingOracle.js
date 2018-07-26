import React, { Fragment } from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Grid } from '@material-ui/core';
import { EventWarning, ImportantNote } from 'components';
import Transactions from './components/EventTxHistory';
import { Row, Content, Title, Button, Option, OracleTxConfirmDialog } from './components';
import { Sidebar } from './Sidebar';


const BettingOracle = observer(({ store: { eventPage, eventPage: { oracle } } }) => (
  <Row>
    <Content>
      <Title>{oracle.name}</Title>
      {!oracle.unconfirmed && !oracle.isArchived && <EventWarning id={eventPage.eventWarningMessageId} amount={eventPage.amount} type={eventPage.warningType} />}
      <Options oracle={oracle} />
      {oracle.unconfirmed && <EventUnconfirmedNote />}
      {!oracle.unconfirmed && (
        <Fragment>
          {!oracle.isArchived && <BetButton onClick={eventPage.prepareBet} disabled={eventPage.isPending || eventPage.buttonDisabled} />}
          <Transactions type='oracle' options={oracle.options} />
        </Fragment>
      )}
    </Content>
    <Sidebar />
    <OracleTxConfirmDialog id='txConfirmMsg.bet' />
  </Row>
));

const EventUnconfirmedNote = injectIntl(({ intl: { formatMessage } }) => (
  <ImportantNote heading={formatMessage({ id: 'str.unconfirmed' })} message={formatMessage({ id: 'oracle.eventUnconfirmed' })} />
));

const Options = observer(({ oracle }) => (
  <Container>
    {oracle.options.map((option, i) => <Option key={i} option={option} disabled={oracle.isArchived} />)}
  </Container>
));

const Container = styled(Grid)`
  min-width: 75%;
`;

const BetButton = props => <Button {...props}><FormattedMessage id="bottomButtonText.placeBet" defaultMessage="Place Bet" /></Button>;

export default injectIntl(inject('store')(BettingOracle));
