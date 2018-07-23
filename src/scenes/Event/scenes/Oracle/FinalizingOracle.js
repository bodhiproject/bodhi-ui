import React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Grid } from '@material-ui/core';
import { EventWarning, ImportantNote } from 'components';
import Transactions from '../../components/EventTxHistory';
import ResultHistory from '../../components/EventTxHistory/resultHistory';
import { Row, Content, Title, Button, Option, OracleTxConfirmDialog } from './components';
import { Sidebar } from './Sidebar';


const FinalizingOracle = observer(({ store: { oraclePage, oraclePage: { oracle } } }) => (
  <Row>
    <Content>
      <Title>{oracle.name}</Title>
      {!oracle.unconfirmed && <EventWarning id={oraclePage.eventWarningMessageId} amount={oraclePage.amount} type={oraclePage.warningType} />}
      <Options oracle={oracle} />
      {oracle.unconfirmed && <ImportantNote heading='str.unconfirmed' message='oracle.eventUnconfirmed' />}
      <FinalizeButton onClick={oraclePage.finalize} disabled={oraclePage.isPending || oraclePage.buttonDisabled} />
      <ResultHistory oracles={oraclePage.oracles} />
      <Transactions type='oracle' options={oracle.options} />
    </Content>
    <Sidebar />
    <OracleTxConfirmDialog id='txConfirmMsg.set' />
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
