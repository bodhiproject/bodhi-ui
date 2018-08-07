import React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Grid } from '@material-ui/core';
import { EventWarning, ImportantNote } from 'components';

import { Row, Content, Title, Button, Option, TransactionHistory, OracleTxConfirmDialog } from './components';
import { Sidebar } from './Sidebar';


const ResultSettingOracle = observer(({ store: { eventPage, eventPage: { oracle } } }) => (
  <Row>
    <Content>
      <Title>{oracle.name}</Title>
      {!oracle.unconfirmed && (
        <EventWarning id={eventPage.eventWarningMessageId} amount={eventPage.amount} type={eventPage.warningType} />
      )}
      <Options oracle={oracle} />
      <MustStakeConsensusThresold consensusThreshold={oracle.consensusThreshold} />
      <SetResultButton
        onClick={eventPage.prepareSetResult}
        disabled={eventPage.isPending || eventPage.buttonDisabled}
      />
      <TransactionHistory type='oracle' options={oracle.options} />
    </Content>
    <Sidebar />
    <OracleTxConfirmDialog id='txConfirmMsg.set' />
  </Row>
));

const MustStakeConsensusThresold = injectIntl(({ intl, consensusThreshold }) => {
  const heading = `${intl.formatMessage({ id: 'oracle.consensusThreshold' })} ${consensusThreshold} BOT`;
  const message = intl.formatMessage({ id: 'oracle.setResultExplanation' });
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

const SetResultButton = props => (
  <Button {...props}><FormattedMessage id="str.setResult" defaultMessage="Set Result" /></Button>
);

export default injectIntl(inject('store')(ResultSettingOracle));
