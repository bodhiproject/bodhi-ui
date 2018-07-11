/* eslint-disable */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Grid } from '@material-ui/core';
import { EventWarning, ImportantNote } from 'components';
import Transactions from '../../components/EventTxHistory';
import { Row, Content, Title, Button, Option, OracleTxConfirmDialog } from './components';
import { Sidebar } from './Sidebar';


const ResultSettingOracle = observer(({ store: { oraclePage, oraclePage: { oracle } } }) => (
  <Row>
    <Content>
      <Title>{oracle.name}</Title>
      {!oracle.unconfirmed && <EventWarning id={oraclePage.eventWarningMessageId} amount={oraclePage.amount} type={oraclePage.warningType} />}
      <Options oracle={oracle} />
      {/* ImportantNote <ConsensusThreshold /> RESULT SET */}
      {/* UNCOFIRMED, RESULST SET, VOTE, FINALIZE */}
      {/* {oracle.unconfirmed && <ImportantNote heading='str.unconfirmed' message='oracle.eventUnconfirmed' />} */}
      <MustStakeConsensusThresold consensusThreshold={oracle.consensusThreshold} />
      <SetResultButton onClick={oraclePage.prepareSetResult} disabled={oraclePage.isPending} />
      <Transactions type='oracle' options={oracle.options} />
    </Content>
    <Sidebar oracle={oracle} />
    <OracleTxConfirmDialog id='txConfirmMsg.set' />
  </Row>
));

const MustStakeConsensusThresold = injectIntl(({ intl, consensusThreshold }) => {
  const heading = `${intl.formatMessage({ id: 'oracle.consensusThreshold' })} ${consensusThreshold} BOT`;
  const message = intl.formatMessage({ id: 'oracle.setResultExplanation' })
  return <ImportantNote heading={heading} message={message} />;
});

const Options = observer(({ oracle }) => (
  <Grid item xs={12} lg={9}>
    {oracle.options.map((option, i) => <Option key={i} option={option} amountInputDisabled />)}
  </Grid>
));

const SetResultButton = props => <Button {...props}><FormattedMessage id="str.setResult" defaultMessage="Set Result" /></Button>;

export default injectIntl(inject('store')(ResultSettingOracle));
